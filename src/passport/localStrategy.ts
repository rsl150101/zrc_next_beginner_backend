import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import db from "../models";

const { User } = db;

export default () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
            raw: true,
          });

          if (!user) {
            return done(null, false, { message: "Not exist user!" });
          }

          const result = await bcrypt.compare(password, user.password);

          if (result) {
            return done(null, user);
          }

          return done(null, false, { message: "Incorrect password." });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
