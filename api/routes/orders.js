// ? All Order Related Routes
const express = require("express");
const checkAuth = require('../middleware/check-auth');
const OrdersController = require("../controllers/orders");
const router = express.Router();

router.get("/", checkAuth, OrdersController.orders_get_all );
router.post("/", checkAuth, OrdersController.orders_create );
router.get("/:orderID", checkAuth,  OrdersController.orders_getById);
router.delete("/:orderID", checkAuth,  OrdersController.orders_deleteById);

module.exports = router;
