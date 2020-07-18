const express = require("express");
const router = express.Router();
const { db } = require("../helpers/firebaseAdmin");

const firebaseConfig = require("../helpers/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

router.get("/", async (req, res) => {
	try {
		const category = await db.collection("productCategories").get();
		let categories = [];
		category.forEach((doc) => {
			categories.push(doc.data());
		});
		res.json(categories);
	} catch (error) {
		res.status(400).json(error);
	}
});

router.post("/", async (req, res) => {
	try {
		const category = await db.collection("productCategories").add(req.body);
		res.status(201).json({ message: "document added succesfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
	try {
		const category = await db
			.collection("productCategories")
			.doc(req.params.id)
			.set(req.body);
		res.status(200).json({ message: "document flaged as deleted succesfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

module.exports = router;
