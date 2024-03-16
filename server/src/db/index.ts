import { connect } from "mongoose";

const uri = process.env.MONGO_URI as string;

connect(uri)
  .then(() => {
    console.log("db connected successfully.");
  })
  .catch((err) => {
    console.log("db connection error: ", err);
  });
