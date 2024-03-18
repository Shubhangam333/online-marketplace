import { Schema, model } from "mongoose";

const authVerificationTokenSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 86400,
    default: Date.now(),
  },
});

const AuthVerificationTokenModel = model(
  "AuthVerificationToken",
  authVerificationTokenSchema
);

export default AuthVerificationTokenModel;
