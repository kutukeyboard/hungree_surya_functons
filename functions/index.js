const functions = require("firebase-functions");
const express = require("express");
const router = express.Router();
const app = express();

const productCategory = require("./controllers/productCategory");
router.use("/productcategory", productCategory);

const user = require("./controllers/user");
router.use("/user", user);

const product = require("./controllers/product");
router.use("/product", product);

app.use("/api", router);

exports.app = functions.https.onRequest(app);
