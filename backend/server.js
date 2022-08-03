require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV === "development";

require("./helpers/passport");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

// Set Up Cors
// Put a list of allowed URLs
//  ie: https://cheerful-phoenix-656d2e.netlify.app
//  REFER: https://expressjs.com/en/resources/middleware/cors.html#configuration-options
const ALLOW_ORIGINS_LIST = [];
const corsOptions = {
  // Ignore Cors in development but restrict to URL in production
  origin: isDevelopment ? true : ALLOW_ORIGINS_LIST,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Enable Cors for all requests

// Set Up Database
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Set Up Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/api", apiRouter);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
