import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserModel from "src/models/user";
import PasswordResetTokenModel from "src/models/passwordResetToken";
import { Schema } from "mongoose";

interface UserProfile {
  id: Schema.Types.ObjectId;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
}

declare global {
  namespace Express {
    interface Request {
      user: UserProfile;
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) return sendErrorRes(res, "unauthorized request!", 403);

    const token = authToken.split("Bearer ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await UserModel.findById(payload.id);
    if (!user) return sendErrorRes(res, "unauthorized request!", 403);

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendErrorRes(res, "Session Expired!", 401);
    }
    if (error instanceof JsonWebTokenError) {
      return sendErrorRes(res, "unauthorized access!", 401);
    }

    next(error);
  }
};

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { id, token } = req.body;
  console.log("i", id, token);
  const resetPassToken = await PasswordResetTokenModel.findOne({ owner: id });

  if (!resetPassToken)
    return sendErrorRes(res, "Unauthorized request,invalid token", 403);

  const matched = await resetPassToken.compareToken(token);

  if (!matched)
    return sendErrorRes(res, "Unauthorized request,invalid token", 403);

  next();
};
