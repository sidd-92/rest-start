const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const morgan = require("morgan");
const app = express();
//
const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://nodeshop:${
    process.env.MONGO_ATLAS_PWD
  }@nodeshoprest-xitvt.mongodb.net/test?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true
  },
  function(err, client) {
    if (err) {
      console.log(err);
    }
    console.log("connected!!!");
  }
);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Header", "*");
  if (req.method === "OPTIONS ") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    res.status(200).json({});
  }
  next();
});
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//! If the Routes comes past the above middleware
//! Then there is an Error, So all Error must be handled after the accepted routes

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: { message: error.message }
  });
});
module.exports = app;
