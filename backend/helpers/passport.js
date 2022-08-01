const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const { verifyPassword } = require("../helpers/hash");
const User = require("../models/User");

/* Validates User Credentials */
passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user)
        return cb(null, false, { message: "Incorrect username or password." });
      const isValid = await verifyPassword(password, user.password);
      if (!isValid)
        return cb(null, false, { message: "Incorrect username or password." });
      // Found User in Database
      return cb(null, user, { message: "Logged in successfully." });
    } catch (err) {
      return cb(err);
    }
  })
);

/* Validates JWT Token */
const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};
passport.use(
  new JWTStrategy(opts, async (jwt_payload, cb) => {
    try {
      return cb(null, jwt_payload.user);
    } catch (err) {
      return cb(err, false);
    }
  })
);
