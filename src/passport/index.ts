import passport from "passport";

import local from "./localStrategy";

export default () => {
  passport.serializeUser(() => {});
  passport.deserializeUser(() => {});

  local();
};
