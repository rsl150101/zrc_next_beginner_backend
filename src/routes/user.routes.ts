import express from "express";
import bcrypt from "bcrypt";

import db from "../models";

const { User } = db;

const router = express.Router();

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
