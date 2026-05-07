import { Router } from "express";

import {
	getAdminIndex,
	updatePostHandler,
	getNewPost,
	createPostHandler,
	deletePost,
	showPost,
} from "../controllers/adminController";

const router = Router();

router.get("/", getAdminIndex);
router.get("/posts/new", getNewPost);
router.post("/posts", createPostHandler);
router.get("/posts/:slug/edit", showPost);
router.post("/posts/:slug/delete", deletePost);
router.post("/posts/:slug", updatePostHandler);

export default router;
