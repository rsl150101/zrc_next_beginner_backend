import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import path from "path";

dotenv.config();

import db from "./models";
import passportConfig from "./passport";

import userRouter from "./routes/user.routes";
import postRouter from "./routes/post.routes";
import postsRouter from "./routes/posts.routes";
import hashtagRouter from "./routes/hashtag.routes";

const app = express();

db.sequelize
  ?.sync()
  .then(() => {
    console.log("Connect DB");
  })
  .catch(console.error);

passportConfig();

app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONT_SERVER_HOST,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET!,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("port", process.env.PORT || 3065);

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/hashtag", hashtagRouter);

const handleListenServer = () => {
  console.log(`Listening on http://localhost:${app.get("port")}`);
};

app.listen(app.get("port"), handleListenServer);
