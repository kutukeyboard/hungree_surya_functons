const functions = require("firebase-functions");
const express = require("express");
const router = express.Router();
const app = express();

const productCategory = require("./controllers/productCategory");
router.use("/productcategory", productCategory);

app.use("/api", router);

exports.app = functions.https.onRequest(app);
