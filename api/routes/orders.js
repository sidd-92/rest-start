// ? All Order Related Routes
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

const router = express.Router();

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name price")
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
  Product.findById(req.body.productID)
    .exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product Not Found"
        });
      }
      const orders = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productID
      });
      return orders.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order Stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result._id}`
        }
      });
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
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then(result => {
      console.log(result);
      if (!result) {
        return res.status(404).json({
          message: "No Order Was Found"
        });
      }
      res.status(200).json({
        product: result.product,
        quantity: result.quantity,
        _id: result._id,
        request: {
          type: "GET",
          description: "Get All Orders",
          url: `http://localhost:3000/orders`
        }
      });
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
      res.status(200).json({
        message: "Order Deleted",
        request: {
          type: "POST",
          url: `http://localhost:3000/orders`,
          body: { productID: "_id", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
