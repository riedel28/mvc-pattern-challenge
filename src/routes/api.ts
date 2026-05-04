import { Router } from "express";

import {
	getRandomPost,
	getLatestPosts,
	getStats,
} from "../controllers/apiPostController";

const router = Router();

router.get("/posts/random", getRandomPost);
router.get("/posts/latest", getLatestPosts);
router.get("/stats", getStats);

export default router;
