const jwt = require("jsonwebtoken");

exports.isVerified = async (req) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (bearerHeader) {
    const bearerToken = bearerHeader.split(" ")[1];
    try {
      const authData = jwt.verify(bearerToken, process.env.SECRET_KEY);
      return true;
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
};
