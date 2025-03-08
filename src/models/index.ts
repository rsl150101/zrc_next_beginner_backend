import { Sequelize } from "sequelize";
import config from "../config/config";

type Env = "development" | "test" | "production";

interface IDB {
  [key: string]: any;
  sequelize?: Sequelize;
}

const env: Env = (process.env.NODE_ENV as Env) || "development";
const configEnv = config[env];
const db: IDB = {};

const sequelize = new Sequelize(
  configEnv.database,
  configEnv.username,
  configEnv.password,
  configEnv
);

db.sequelize = sequelize;

module.exports = db;
