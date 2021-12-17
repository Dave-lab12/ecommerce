const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const AuthRoute = require("./routes/auth");
const productsRoute = require('./routes/product')
const ordersRoute = require('./routes/order')

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
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/orders", ordersRoute);

app.listen(PORT, () => {
  console.log("server is running");
});
