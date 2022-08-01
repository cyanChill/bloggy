const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.loginPost = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(400).json({ message: "Something went wrong." });
      }

      req.login(user, { session: false }, (err) => {
        if (err) return res.send(err);

        const body = { _id: user.id, username: user.username };
        const opts = { expiresIn: "1d" };
        const token = jwt.sign({ user: body }, process.env.SECRET_KEY, opts);
        return res.status(200).json({
          message: "Successfully logged in.",
          token: token,
        });
      });
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  })(req, res);
};

exports.logoutGet = async (req, res, next) => {
  // req.logout(); // Used for sessions (clear JWT token client-side)
  res.status(200).json({ message: "Successfully Logged Out" });
};
