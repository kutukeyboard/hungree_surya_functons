const express = require("express");
const router = express.Router();
const { db } = require("../helpers/firebaseAdmin");
const verifyToken = require("../helpers/verifyToken");

router.get("/:id?", verifyToken, async (req, res) => {
	let product;
	try {
		if (req.params.id) {
			product = await db.collection("products").doc(req.params.id).get();
			res.json(product.data());
		} else {
			product = await db
				.collection("products")
				.where("isDeleted", "==", false)
				.get();

			let products = [];

			product.forEach((doc) => {
				products.push({
					name: doc.data().name,
					price: doc.data().price,
					category: doc.data().category,
					isDeleted: doc.data().isDeleted,
					id: doc.id,
				});
			});

			res.json(products);
		}
	} catch (error) {
		res.status(400).json(error);
	}
});

router.post("/", verifyToken, async (req, res) => {
	try {
		const product = await db.collection("products").add(req.body);
		res.status(201).json({ message: "document added succesfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.patch("/:id", verifyToken, async (req, res) => {
	try {
		const product = await db
			.collection("products")
			.doc(req.params.id)
			.set(req.body);
		res.status(200).json({ message: "document updated succesfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

module.exports = router;
