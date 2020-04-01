const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const fileupload = require("express-fileupload");
const connectDB = require("./config/db");
const passport = require("passport");
const index = require("./routes/api/index");

/**Midlewares declarations */
dotenv.config({ path: "./config/config.env" });
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(fileupload());
app.use(express.static(path.join(__dirname, "public")));
//passport middleware
app.use(passport.initialize());
//passport Config
require("./config/passport.js")(passport);

//Mount base route
app.use("/api/v1/", index);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
