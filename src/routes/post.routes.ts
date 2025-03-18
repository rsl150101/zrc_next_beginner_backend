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
        { model: User, as: "Likers", attributes: ["id"] },
      ],
    });

    res.status(201).json(fullPost);
  } catch (error) {
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user?.id },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
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

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{ model: User, attributes: ["id", "nickname"] }],
    });

    res.status(201).json(fullComment);
  } catch (error) {
    next(error);
  }
});

router
  .route("/:postId/like")
  .patch(isLoggedIn, async (req, res, next) => {
    try {
      const post = await Post.findOne({ where: { id: req.params.postId } });
      if (!post) {
        res.status(403).send("Not exist post.");
        return;
      }
      await post.addLikers(req.user?.id);
      res.json({ PostId: post.id, UserId: req.user?.id });
    } catch (error) {
      next(error);
    }
  })
  .delete(isLoggedIn, async (req, res, next) => {
    try {
      const post = await Post.findOne({ where: { id: req.params.postId } });
      if (!post) {
        res.status(403).send("Not exist post.");
        return;
      }
      await post.removeLikers(req.user?.id);
      res.json({ PostId: post.id, UserId: req.user?.id });
    } catch (error) {
      next(error);
    }
  });

export default router;
