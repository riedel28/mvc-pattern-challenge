import type { Request, Response } from "express";

import { getPosts, type Post } from "../models/postModel";

export async function getRandomPost(
	_req: Request,
	res: Response,
): Promise<void> {
	const posts = await getPosts();
	const randomIndex = Math.floor(Math.random() * posts.length);
	const post = posts[randomIndex] as Post;

	if (!post) {
		res.status(404).json({ message: "Post not found" });
	}

	res.status(200).json(post);
}

export async function getLatestPosts(
	_req: Request,
	res: Response,
): Promise<void> {
	const posts = await getPosts();
	const latestPosts = posts.slice(0, 3);
	res.json(latestPosts);
}

export async function getStats(_req: Request, res: Response) {
	const posts = await getPosts();
	const totalPosts = posts.length;
	const [newestPost] = [...posts].sort((a, b) => b.createdAt - a.createdAt);
	const [newestPostDate] = new Date(newestPost.createdAt * 1000)
		.toISOString()
		.split("T");

	const stats = {
		totalPosts,
		newestPostDate,
	};

	res.status(200).json(stats);
}
