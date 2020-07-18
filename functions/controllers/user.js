const express = require("express");
const router = express.Router();
const { db } = require("../helpers/firebaseAdmin");

const firebaseConfig = require("../helpers/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

router.post("/signup", async (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		name: req.body.name,
		roleGroupId: req.body.roleGroupId,
	};

	try {
		const registerUser = await db
			.doc(`/users/${newUser.email}`)
			.get()
			.then((doc) => {
				if (doc.exists) {
					res.status(400).json({ error: "email already taken" });
				} else {
					return firebase
						.auth()
						.createUserWithEmailAndPassword(newUser.email, newUser.password);
				}
			});
		const token = await registerUser.user.getIdToken();

		const createUser = {
			email: newUser.email,
			password: newUser.password,
			name: newUser.name,
			roleGroupId: newUser.roleGroupId,
		};
		const user = await db
			.doc(`/users/${registerUser.user.uid}`)
			.set(createUser);

		res.status(201).json({ token });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.post("/login", async (req, res) => {
	const loginUser = {
		email: req.body.email,
		password: req.body.password,
	};

	try {
		const userData = await firebase
			.auth()
			.signInWithEmailAndPassword(loginUser.email, loginUser.password);
		const token = await userData.user.getIdToken();

		res.status(200).json({ token });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

module.exports = router;
