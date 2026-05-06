import type { Request, Response } from "express";
import sanitize from "sanitize-html";

import {
	addPost,
	deletePostBySlug,
	loadPostBySlug,
	loadPosts,
	type Post,
	updatePostBySlug,
} from "../models/postModel";
import { formatDate } from "../util/formatDate";
import { slugify } from "../util/slugify";

export async function getAdminIndex(req: Request, res: Response) {
	const q = req.query.q as string;
	const posts = await loadPosts(q);

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

export async function createPost(req: Request, res: Response) {
	const title = sanitize(req.body.title);
	const image = sanitize(req.body.image);
	const author = sanitize(req.body.author);
	const teaser = sanitize(req.body.teaser);
	const content = sanitize(req.body.content);

	if (!title || !content) {
		res.status(400).send("Title and content are required");
		return;
	}

	const post: Post = {
		title,
		image,
		author,
		teaser,
		content,
		createdAt: Math.floor(Date.now() / 1000),
	};

	await addPost(post);

	res.redirect(303, "/admin");
}

export async function showPost(req: Request, res: Response) {
	const slug = Array.isArray(req.params.slug)
		? req.params.slug[0]
		: req.params.slug;

	if (!slug) {
		res.status(400).send("Slug is required");
		return;
	}

	const post = await loadPostBySlug(slug);

	if (!post) {
		res.status(404).send("Post not found");
		return;
	}

	res.render("admin/editPost", { slug, post });
}

export async function updatePost(req: Request, res: Response) {
	const slug = Array.isArray(req.params.slug)
		? req.params.slug[0]
		: req.params.slug;

	if (!slug) {
		res.status(400).send("Slug is required");
		return;
	}

	const existing = await loadPostBySlug(slug);
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

	const updatedPost: Post = {
		title,
		image,
		author,
		teaser,
		content,
		createdAt: existing.createdAt,
	};

	await updatePostBySlug(slug, updatedPost);

	res.redirect("/admin");
}

export async function deletePost(req: Request, res: Response) {
	const slug = Array.isArray(req.params.slug)
		? req.params.slug[0]
		: req.params.slug;

	if (!slug) {
		res.status(400).send("Slug is required");
		return;
	}

	await deletePostBySlug(slug);

	res.redirect("/admin");
}
