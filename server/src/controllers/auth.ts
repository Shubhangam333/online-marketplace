import { RequestHandler } from "express";

export const createNewUser: RequestHandler = (req, res) => {
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

  res.send("ok");
};
