import { RequestHandler } from "express";
import { sendErrorRes } from "src/utils/helper";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserModel from "src/models/user";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
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
    const payload = jwt.verify(token, "secret") as { id: string };

    const user = await UserModel.findById(payload.id);
    if (!user) return sendErrorRes(res, "unauthorized request!", 403);

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
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
