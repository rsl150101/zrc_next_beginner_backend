import express from "express";
import dotenv from "dotenv";

dotenv.config();

import db from "./models";

const app = express();

db.sequelize
  ?.sync()
  .then(() => {
    console.log("Connect DB");
  })
  .catch(console.error);

app.set("port", process.env.PORT || 3065);

const handleListenServer = () => {
  console.log(`Listening on http://localhost:${app.get("port")}`);
};

app.listen(app.get("port"), handleListenServer);
