import express from "express";

import db from "../models";
import { isLoggedIn } from "../middlewares/auth";
import upload from "../middlewares/multer";
import Hashtag from "../models/hashtag";

const { Post, Comment, Image, User } = db;
const router = express.Router();

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      nickname: req.user?.nickname,
      content: req.body.content,
      UserId: req.user?.id,
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag: string) =>
          Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })
        )
      );
      await post.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map((image: string) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

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

router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    try {
      if (req.files) {
        const images = (req.files as Express.Multer.File[]).map(
          (file) => file.filename
        );
        res.status(201).json(images);
      } else {
        res.status(400).json({ message: "No files uploaded." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

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
