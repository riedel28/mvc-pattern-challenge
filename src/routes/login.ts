import "dotenv/config";
import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
	res.render("login");
});

router.post("/", (req, res) => {
	const username = process.env.ADMIN_USERNAME;
	const password = process.env.ADMIN_PASSWORD;

	if (req.body.username === username && req.body.password === password) {
		res.cookie("admin", "true");
		res.redirect("/admin");
	} else {
		res.render("login", { error: "Invalid username or password" });
		return;
	}
});

export default router;
