import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import db from "../models";

const { User, Post } = db;

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: any, user: Express.User, info: { message: string }) => {
      if (err) {
        next(err);
      }

      if (info) {
        return res.status(403).send(info.message);
      }

      return req.login(user, async (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        const fulluserWithoutPassword = await User.findOne({
          where: { id: user.id },
          attributes: { exclude: ["password"] },
          include: [
            {
              model: Post,
            },
            { model: User, as: "Followings" },
            {
              model: User,
              as: "Followers",
            },
          ],
        });
        return res.status(200).json(fulluserWithoutPassword);
      });
    }
  )(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
  res.send("Ok");
});

router.post("/", async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      res.status(403).send("Exist user");
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("Ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
