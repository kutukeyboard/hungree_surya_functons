const express = require("express");
const router = express.Router();
const { db } = require("../helpers/firebaseAdmin");
const verifyToken = require("../helpers/verifyToken");

router.get("/:id?", verifyToken, async (req, res) => {
	try {
		let category;
		if (req.params.id) {
			category = await db
				.collection("productCategories")
				.doc(req.params.id)
				.get();

			res.json(category.data());
		} else {
			category = await db
				.collection("productCategories")
				.where("isDeleted", "==", false)
				.get();
			let categories = [];
			category.forEach((doc) => {
				categories.push({
					name: doc.data().name,
					isDeleted: doc.data().isDeleted,
					id: doc.id,
				});
			});
			res.json(categories);
		}
	} catch (error) {
		res.status(400).json(error);
	}
});

router.post("/", verifyToken, async (req, res) => {
	try {
		const category = await db.collection("productCategories").add(req.body);
		res.status(201).json({ message: "document added succesfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.patch("/:id", verifyToken, async (req, res) => {
	try {
		const category = await db
			.collection("productCategories")
			.doc(req.params.id)
			.set(req.body);
		res.status(200).json({ message: "document updated succesfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

module.exports = router;
