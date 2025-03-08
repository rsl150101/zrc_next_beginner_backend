import dotenv from "dotenv";
dotenv.config();

interface DBConfig {
  username: string;
  password: string | undefined;
  database: string;
  host: string;
  dialect: "mysql" | "postgres" | "sqlite" | "mssql";
}

interface Config {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
}

const development: DBConfig = {
  username: process.env.MYSQL_USERNAME!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
  host: process.env.MYSQL_HOST!,
  dialect: "mysql",
};

const test: DBConfig = {
  username: process.env.MYSQL_USERNAME!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE_TEST!,
  host: process.env.MYSQL_HOST!,
  dialect: "mysql",
};

const production: DBConfig = {
  username: process.env.MYSQL_USERNAME!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE_PRODUCTIO!,
  host: process.env.MYSQL_HOST!,
  dialect: "mysql",
};

const config: Config = { development, test, production };

export default config;
