import express from "express";
import dotenv from "dotenv";

dotenv.config();

import db from "./models";
import userRouter from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  ?.sync()
  .then(() => {
    console.log("Connect DB");
  })
  .catch(console.error);

app.set("port", process.env.PORT || 3065);

app.use("/user", userRouter);

const handleListenServer = () => {
  console.log(`Listening on http://localhost:${app.get("port")}`);
};

app.listen(app.get("port"), handleListenServer);
