// ? All Order Related Routes

const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET Requested for all Orders"
  });
});

router.post("/", (req, res, next) => {
  const orders = {
    productID: req.body.productID,
    quantity: req.body.quantity
  };
  res.status(201).json({
    message: "POST Request For Orders",
    order: orders
  });
});

// ? Order Id: Get and Delete
router.get("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  res.status(200).json({
    message: `Get ${id} For Orders`,
    id: id
  });
});

router.delete("/:orderID", (req, res, next) => {
  const id = req.params.orderID;
  res.status(200).json({
    message: `${id} Order Deleted`
  });
});

module.exports = router;
