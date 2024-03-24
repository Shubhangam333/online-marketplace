import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from "crypto";
import AuthVerificationTokenModel from "src/models/authVerificationToken";
import { sendErrorRes } from "src/utils/helper";
import jwt from "jsonwebtoken";
import mail from "src/utils/mail";

export const createNewUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!name) return sendErrorRes(res, "Name is missing!", 422);
    if (!email) return sendErrorRes(res, "Email is missing!", 422);
    if (!password) return sendErrorRes(res, "Password is missing!", 422);

    const existingUser = await UserModel.findOne({ email });

    if (existingUser)
      return sendErrorRes(
        res,
        "Unauthorized request, email is already in use!",
        401
      );

    const user = await UserModel.create({ name, email, password });

    const token = crypto.randomBytes(36).toString("hex");
    await AuthVerificationTokenModel.create({ owner: user._id, token });

    const link = `http://localhost:8000/verify.html?id=${user._id}&token=${token}`;

    await mail.sendVerification(user.email, link);

    res.json({ message: "Please check your inbox." });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res) => {
  const { id, token } = req.body;

  const authToken = await AuthVerificationTokenModel.findOne({ owner: id });
  if (!authToken) return sendErrorRes(res, "unauthorized request!", 403);

  const isMatched = await authToken.compareToken(token);
  if (!isMatched)
    return sendErrorRes(res, "unauthorized request, invalid token!", 403);

  await UserModel.findByIdAndUpdate(id, { verified: true });

  await AuthVerificationTokenModel.findByIdAndDelete(authToken._id);

  res.json({ message: "Thanks for joining us, your email is verified." });
};

export const generateVerificationLink: RequestHandler = async (
  req,
  res,
  next
) => {
  const { id } = req.user;
  const token = crypto.randomBytes(36).toString("hex");
  const link = `http://localhost:8000/verify.html?id=${id}&token=${token}`;

  await AuthVerificationTokenModel.findOneAndDelete({ owner: id });

  await AuthVerificationTokenModel.create({ owner: id, token });

  await mail.sendVerification(req.user.email, link);

  res.json({ message: "Please check your inbox" });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) return sendErrorRes(res, "Email/Password missmatch!", 403);

  const isMatched = await user.comparePassword(password);

  if (!isMatched) return sendErrorRes(res, "Email/Password missmatch!", 403);

  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, "secret", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, "secret");

  if (!user.tokens) user.tokens = [refreshToken];
  else user.tokens.push(refreshToken);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
    tokens: { refresh: refreshToken, access: accessToken },
  });
};

export const sendProfile: RequestHandler = async (req, res) => {
  res.json({
    profile: req.user,
  });
};

export const grantAccessToken: RequestHandler = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return sendErrorRes(res, "Unauthorized request!", 403);

  const payload = jwt.verify(refreshToken, "secret") as { id: string };
  if (!payload.id) {
    return sendErrorRes(res, "Unauthorized request", 401);
  }

  const user = await UserModel.findOne({
    _id: payload.id,
    tokens: refreshToken,
  });

  if (!user) {
    //user is compromised, remove all the previous tokens
    await UserModel.findByIdAndUpdate(payload.id, { tokens: [] });
    return sendErrorRes(res, "Unautorized request!", 401);
  }

  const newAccessToken = jwt.sign({ id: user._id }, "secret", {
    expiresIn: "15m",
  });
  const newRefreshToken = jwt.sign({ id: user._id }, "secret");

  const filteredTokens = user.tokens.filter((t) => t !== refreshToken);
  user.tokens = filteredTokens;
  user.tokens.push(newRefreshToken);

  await user.save();

  res.json({
    tokens: { refresh: newRefreshToken, access: newAccessToken },
  });
};
