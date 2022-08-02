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
const corsOptions = {
  // Ignore Cors in development but restrict to URL in production
  origin: isDevelopment ? true : process.env.FRONTEND_ORIGIN,
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
