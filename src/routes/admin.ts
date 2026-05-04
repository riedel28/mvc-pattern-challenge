import { Router } from "express";

import {
	getAdminIndex,
	updatePost,
	getNewPost,
	createPost,
	deletePost,
	showPost,
} from "../controllers/adminController";

const router = Router();

router.get("/", getAdminIndex);
router.get("/posts/new", getNewPost);
router.post("/posts", createPost);
router.get("/posts/:slug/edit", showPost);
router.post("/posts/:slug/delete", deletePost);
router.post("/posts/:slug", updatePost);

export default router;
