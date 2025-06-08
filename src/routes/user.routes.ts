import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import db from "../models";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/auth";
import { Op } from "sequelize";

const { User, Post, Comment, Image } = db;

const router = express.Router();

interface ILastId {
  UserId?: number;
  id?: { [Op.lt]: number };
}

router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fulluserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          { model: User, as: "Followings", attributes: ["id"] },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fulluserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("Not exist user.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId/posts", async (req, res, next) => {
  try {
    const where: ILastId = { UserId: parseInt(req.params.userId, 10) };
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
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
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
              attributes: ["id"],
            },
            { model: User, as: "Followings", attributes: ["id"] },
            {
              model: User,
              as: "Followers",
              attributes: ["id"],
            },
          ],
        });
        return res.status(200).json(fulluserWithoutPassword);
      });
    }
  )(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.send("Ok");
  });
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
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

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user?.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("Not exist user!");
      return;
    }
    await user.addFollowers(req.user?.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("Not exist user!");
      return;
    }
    await user.removeFollowers(req.user?.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("Not exist user!");
      return;
    }
    await user.removeFollowings(req.user?.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id },
    });
    if (!user) {
      res.status(403).send("Not exist user!");
      return;
    }
    const followers = await user.getFollowers({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(followers);
  } catch (error) {
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id },
    });
    if (!user) {
      res.status(403).send("Not exist user!");
      return;
    }
    const followings = await user.getFollowings({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(followings);
  } catch (error) {
    next(error);
  }
});

export default router;
