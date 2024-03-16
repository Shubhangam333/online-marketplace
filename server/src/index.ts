import "dotenv/config";
import "src/db";
import express from "express";
import authRouter from "routes/auth";

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>hello from server</h1>");
});

// API Routes
app.use("/auth", authRouter);

app.listen(8000, () => {
  console.log("The app is running on http://localhost:8000");
});
