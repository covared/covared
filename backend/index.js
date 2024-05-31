require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const db = require("./models");
const { job } = require("./cron");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const origins = process.env.FRONT_END_URL
  ? [
      process.env.FRONT_END_URL,
      process.env.FRONT_END_URL.replace("https://", "https://www."),
    ]
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", routes);

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    job.start();
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
});
