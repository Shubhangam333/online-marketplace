import "express-async-errors";
import "dotenv/config";
import "src/db";
import express from "express";
import authRouter from "routes/auth";

const app = express();

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("<h1>hello from server</h1>");
});

// API Routes
app.use("/auth", authRouter);

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.listen(8000, () => {
  console.log("The app is running on http://localhost:8000");
});
