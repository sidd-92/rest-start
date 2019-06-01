/*//? Handle Product Related Routes */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        products: result.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => console.log(err));
});

router.post("/", (req, res, next) => {
  const newProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  newProduct
    .save()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(201).json({
          message: "Created Product Successfully",
          createdProducts: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${result._id}`
            }
          }
        });
      } else {
        res.status(404).json({
          message: "No Valid Entry Found"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// *Single Product

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then(document => {
      console.log(document);
      if (document) {
        res.status(200).json({
          product: document,
          request: {
            type: "GET",
            description: "Provides a List Of All Products",
            url: `http://localhost:3000/products`
          }
        });
      } else {
        res.status(404).json({
          message: "No Valid Entry Found"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// ? PATCH AND DELETE

router.patch("/:productID", (req, res, next) => {
  const id = req.params.productID;
  const updateOPS = {};
  //req.body is an Array
  for (const ops of req.body) {
    updateOPS[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOPS })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${id}`
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

router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "POST",
          url: `http://localhost:3000/products`,
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Given ID Not Available In DB",
        error: err
      });
    });
});
module.exports = router;
