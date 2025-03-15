import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import db from "./models";
import userRouter from "./routes/user.routes";
import passportConfig from "./passport";

const app = express();

db.sequelize
  ?.sync()
  .then(() => {
    console.log("Connect DB");
  })
  .catch(console.error);

passportConfig();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONT_SERVER_HOST,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.set("port", process.env.PORT || 3065);

app.use("/user", userRouter);

const handleListenServer = () => {
  console.log(`Listening on http://localhost:${app.get("port")}`);
};

app.listen(app.get("port"), handleListenServer);
