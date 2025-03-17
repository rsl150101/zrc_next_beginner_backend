import express from "express";

import db from "../models";
import { isLoggedIn } from "../middlewares/auth";

const { Post, Comment, Image, User } = db;
const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      nickname: req.user?.nickname,
      content: req.body.content,
      UserId: req.user?.id,
    });

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        { model: Comment },
        { model: User, attributes: { exclude: ["password"] } },
      ],
    });

    res.status(201).json(fullPost);
  } catch (error) {
    next(error);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      res.status(403).send("Not exist post!");
      return;
    }

    const comment = await Comment.create({
      nickname: req.user?.nickname,
      content: req.body.content,
      UserId: req.user?.id,
      PostId: parseInt(req.params.postId, 10),
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

export default router;
