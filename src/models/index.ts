import { Sequelize } from "sequelize";
import config from "../config/config";
import { initUser } from "./user";
import { initPost } from "./post";
import { initComment } from "./comment";
import { initHashtag } from "./hashtag";
import { initImage } from "./image";

type Env = "development" | "test" | "production";

const env: Env = (process.env.NODE_ENV as Env) || "development";
const configEnv = config[env];

const sequelize = new Sequelize(
  configEnv.database,
  configEnv.username,
  configEnv.password,
  configEnv
);

initUser(sequelize);
initPost(sequelize);
initComment(sequelize);
initHashtag(sequelize);
initImage(sequelize);

export default sequelize;
