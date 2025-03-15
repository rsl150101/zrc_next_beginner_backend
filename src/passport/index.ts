import passport from "passport";

import local from "./localStrategy";
import db from "../models";

const { User } = db;

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  local();
};
