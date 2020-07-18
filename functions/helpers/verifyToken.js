const { db, admin } = require("../helpers/firebaseAdmin");

const verifyToken = async (req, res, next) => {
	let userToken;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		userToken = req.headers.authorization.split("Bearer ")[1];
	} else {
		res.status(403).json({ error: "Unauthorized" });
	}
	try {
		const authData = await admin.auth().verifyIdToken(userToken);
		const user = await db
			.collection("users")
			.where("email", "==", authData.email)
			.limit(1)
			.get();

		req.user = authData;
		req.user.email = user.docs[0].data().email;
		return next();
	} catch (err) {
		res.status(400).json({ error: err });
	}
};

module.exports = verifyToken;
