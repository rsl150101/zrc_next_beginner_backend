import express from "express";

import db from "../models";

const { Post, User, Image, Comment } = db;

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      //   where: { id: lastId },
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: { exclude: ["password"] } }],
        },
        { model: User, as: "Likers", attributes: ["id"] },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

export default router;
