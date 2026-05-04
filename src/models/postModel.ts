import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "../util/slugify";

export interface Post {
	title: string;
	image: string;
	author: string;
	createdAt: number;
	teaser: string;
	content: string;
}

const postsPath = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
	"data",
	"posts.json",
);

export async function loadPosts(): Promise<Post[]> {
	try {
		const raw = await readFile(postsPath, "utf-8");
		const posts = JSON.parse(raw) as Post[];
		return posts;
	} catch (error) {
		console.error("Failed to load posts" + error);
	}

	return [];
}

export async function loadPostBySlug(slug: string): Promise<Post | null> {
	try {
		const raw = await readFile(postsPath, "utf-8");
		const posts = JSON.parse(raw) as Post[];
		return posts.find((post) => slugify(post.title) === slug) ?? null;
	} catch (error) {
		console.error("Failed to load post" + error);
	}

	return null;
}

export async function createPosts(newPosts: Post[]): Promise<void> {
	const serializedPosts = JSON.stringify(newPosts, null, 2);
	try {
		await writeFile(postsPath, serializedPosts, "utf-8");
	} catch (error) {
		console.error("Failed to add posts" + error);
	}
}

export async function deletePostBySlug(slug: string): Promise<void> {
	const posts = await loadPosts();
	await createPosts(posts.filter((post) => slugify(post.title) !== slug));
}

export async function addPost(post: Post): Promise<void> {
	const posts = await loadPosts();
	await createPosts([...posts, post]);
}

export async function updatePostBySlug(
	slug: string,
	updates: Partial<Post>,
): Promise<void> {
	const posts = await loadPosts();

	await createPosts(
		posts.map((p) => (slugify(p.title) === slug ? { ...p, ...updates } : p)),
	);
}
