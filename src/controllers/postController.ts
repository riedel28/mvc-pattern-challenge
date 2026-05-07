import type { Request, Response } from "express";

import {
	getPostBySlug as getPostBySlugModel,
	getPosts as getPostsModel,
} from "../models/postModel";
import { slugify } from "../util/slugify";
import { formatDate } from "../util/formatDate";

const PAGE_SIZE = 2;

export async function getPosts(req: Request, res: Response) {
	const posts = await getPostsModel();

	const authorFilter =
		typeof req.query.author === "string" ? req.query.author.trim() : "";
	const sort = req.query.sort === "oldest" ? "oldest" : "newest";
	const page =
		typeof req.query.page === "string" &&
		Number.isInteger(Number(req.query.page))
			? Math.max(1, Number(req.query.page))
			: 1;

	const filteredPosts = authorFilter
		? posts.filter((post) =>
				post.author.toLowerCase().includes(authorFilter.toLowerCase()),
			)
		: posts;

	const sortedPosts = [...filteredPosts].sort((a, b) => {
		if (sort === "oldest") {
			return a.createdAt - b.createdAt;
		}
		return b.createdAt - a.createdAt;
	});

	const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * PAGE_SIZE;
	const pagedPosts = sortedPosts.slice(start, start + PAGE_SIZE);

	const view = pagedPosts.map((post) => ({
		...post,
		slug: slugify(post.title),
		createdAt: formatDate(post.createdAt),
	}));

	res.render("index", {
		posts: view,
		controls: {
			author: authorFilter,
			sort,
			page: currentPage,
			totalPages,
			hasPrev: currentPage > 1,
			hasNext: currentPage < totalPages,
		},
	});
}

export async function getPostBySlug(req: Request, res: Response) {
	const slug = Array.isArray(req.params.slug)
		? req.params.slug[0]
		: req.params.slug;

	if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
		res.status(400).send("Invalid slug");
		return;
	}

	const post = await getPostBySlugModel(slug);

	if (!post) {
		res.status(404).send("Post not found");
		return;
	}
	res.render("post", {
		post: { ...post, createdAt: formatDate(post.createdAt) },
	});
}
