const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const AuthRoute = require("./routes/auth");
const PORT = process.env.PORT || 5000;
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connection was successful");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", AuthRoute);

app.listen(PORT, () => {
  console.log("server is running");
});
