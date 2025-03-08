import { Sequelize } from "sequelize";
import path from "path";
import fs from "fs";

import config from "../config/config";

type Env = "development" | "test" | "production";

interface IDB {
  [key: string]: any;
  sequelize?: Sequelize;
}

const env: Env = (process.env.NODE_ENV as Env) || "development";
const configEnv = config[env];
const db: IDB = {};
const basename = path.basename(__filename);
const fileExtension = process.env.NODE_ENV === "production" ? ".js" : ".ts";

const sequelize = new Sequelize(
  configEnv.database,
  configEnv.username,
  configEnv.password,
  configEnv
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === fileExtension &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
    model.default.initiate(sequelize);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
