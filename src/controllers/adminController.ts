import type { Request, Response } from "express";
import sanitize from "sanitize-html";

import {
	createPost,
	updatePostById,
	deletePostById,
	getPostBySlug,
	getPosts,
	type CreatePostPayload,
	type UpdatePostPayload,
} from "../models/postModel";
import { formatDate } from "../util/formatDate";
import { slugify } from "../util/slugify";

export async function getAdminIndex(req: Request, res: Response) {
	const q = req.query.q as string;
	const posts = await getPosts(q);

	res.render("admin/index", {
		q,
		posts: posts
			.map((post) => ({
				title: post.title,
				author: post.author,
				slug: slugify(post.title),
				createdAtLabel: formatDate(post.createdAt),
			}))
			.reverse(),
	});
}

export function getNewPost(_req: Request, res: Response) {
	res.render("admin/newPost");
}

export async function createPostHandler(req: Request, res: Response) {
	const title = sanitize(req.body.title);
	const image = sanitize(req.body.image);
	const author = sanitize(req.body.author);
	const teaser = sanitize(req.body.teaser);
	const content = sanitize(req.body.content);

	if (!title || !content) {
		res.status(400).send("Title and content are required");
		return;
	}

	const post: CreatePostPayload = {
		title,
		image,
		author,
		teaser,
		content,
	};

	try {
		await createPost(post);
		res.redirect("/admin");
	} catch {
		res.status(500).json({ error: "Could not create a post" });
	}
}

export async function showPost(req: Request, res: Response) {
	const slug = Array.isArray(req.params.slug)
		? req.params.slug[0]
		: req.params.slug;

	if (!slug) {
		res.status(400).send("Slug is required");
		return;
	}

	const post = await getPostBySlug(slug);

	if (!post) {
		res.status(404).render("admin/index", { error: "Post not found" });
		return;
	}

	res.render("admin/editPost", { slug: slugify(post.title), post });
}

export async function updatePostHandler(req: Request, res: Response) {
	const slug = Array.isArray(req.params.slug)
		? req.params.slug[0]
		: req.params.slug;

	if (!slug) {
		res.status(400).send("Slug is required");
		return;
	}

	const existing = await getPostBySlug(slug);

	if (!existing) {
		res.status(404).send("Post not found");
		return;
	}

	const title = sanitize(req.body.title);
	const image = sanitize(req.body.image);
	const author = sanitize(req.body.author);
	const teaser = sanitize(req.body.teaser);
	const content = sanitize(req.body.content);

	if (!title || !content) {
		res.status(400).send("Title and content are required");
		return;
	}

	const updatedPost: UpdatePostPayload = {
		title,
		image,
		author,
		teaser,
		content,
		createdAt: existing.createdAt,
	};

	try {
		await updatePostById(existing.id, updatedPost);
		res.redirect("/admin");
	} catch {
		res
			.status(500)
			.render("admin/index", { error: "Could not update the post" });
	}
}

export async function deletePost(req: Request, res: Response) {
	const slug = Array.isArray(req.params.slug)
		? req.params.slug[0]
		: req.params.slug;

	if (!slug) {
		res.status(400).send("Slug is required");
		return;
	}

	const post = await getPostBySlug(slug);
	if (!post) {
		res.status(404).send("Post not found");
		return;
	}

	try {
		await deletePostById(post.id);
		res.redirect("/admin");
	} catch {
		res
			.status(500)
			.render("admin/index", { error: "Could not delete the post" });
	}
}
