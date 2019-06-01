// ? All Order Related Routes
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order");

const router = express.Router();

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        orders: result.map(doc => {
          return {
            _id: doc._id,
            productID: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: `http://localhost:3000/orders/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const orders = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productID
  });
  orders
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// ? Order Id: Get and Delete
router.get("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  Order.findById(id)
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  Order.deleteOne({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
