/*//? Handle Product Related Routes */
const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const path = require("path");
const fs = require("fs");
const ProductsController = require("../controllers/products");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir("./uploads/", (err) => {
      cb(null, "./uploads/");
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //rejecr a file
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
router.get("/", ProductsController.products_getAll);
router.post("/", upload.single("productImage"), ProductsController.products_create);
router.get("/:productID", ProductsController.products_getSingleProduct);
router.patch("/:productID", checkAuth, ProductsController.products_updateSingleProduct);
router.delete("/:productID", checkAuth, ProductsController.products_deleteSingleProduct);
module.exports = router;
