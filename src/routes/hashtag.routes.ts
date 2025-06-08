import express from "express";
import { Op } from "sequelize";

import db from "../models";

const { Post, Comment, User, Image, Hashtag } = db;

const router = express.Router();

interface ILastId {
  UserId?: number;
  id?: { [Op.lt]: number };
}

router.get("/:hashtag", async (req, res, next) => {
  try {
    const where: ILastId = {};
    if (parseInt(req.query.lastId as string, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId as string, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) },
        },
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
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
