import { RequestHandler } from "express";
import UserModel from "src/models/user";
import crypto from "crypto";
import AuthVerificationTokenModel from "src/models/authVerificationToken";
import { userInfo } from "os";

export const createNewUser: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;

  if (!name) {
    return res.status(422).json({ message: "Name is missing!" });
  }
  if (!email) {
    return res.status(422).json({ message: "Email is missing!" });
  }
  if (!password) {
    return res.status(422).json({ message: "Password is missing!" });
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser)
    return res
      .status(401)
      .json({ message: "Unauthorized request, email is already in use!" });

  const user = await UserModel.create({ name, email, password });

  const token = crypto.randomBytes(36).toString("hex");
  await AuthVerificationTokenModel.create({ owner: user._id, token });

  const link = `http://localhost:8000/verify?id=${user._id}&token=${token}`;

  res.send(link);
};
