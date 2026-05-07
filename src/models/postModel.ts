import { getDB } from "../db/database";
import { unslugify } from "../util/slugify";

export interface Post {
	id: number;
	title: string;
	content: string;
	author: string;
	image?: string;
	teaser?: string;
	createdAt: number;
}

export type CreatePostPayload = Omit<Post, "id" | "createdAt">;
export type UpdatePostPayload = Partial<Post>;

export async function getPosts(q?: string): Promise<Post[]> {
	try {
		const db = getDB();
		const posts = await db.all<Post[]>(
			`SELECT  posts.id,
				posts.title,
				posts.content,
				posts.image,
				posts.teaser,
				posts.createdAt,
				authors.firstName || ' ' || authors.lastName AS author FROM posts 
			 JOIN authors ON posts.authorId = authors.id
			 WHERE LOWER(posts.title) LIKE ? `,
			[`%${q?.toLowerCase() || ""}%`],
		);

		return posts;
	} catch (error) {
		console.error("Failed to load posts" + error);
	}

	return [];
}

export async function getPostById(id: number): Promise<Post | null> {
	try {
		const db = getDB();
		const post = await db.get<Post>(
			`SELECT posts.id,
				posts.title,
				posts.content,
				posts.image,
				posts.teaser,
				posts.createdAt,
  			authors.firstName || ' ' || authors.lastName AS author FROM posts 
			 JOIN authors ON posts.authorId = authors.id 
			 WHERE id = ?`,
			[id],
		);

		return post ?? null;
	} catch (error) {
		console.error("Failed to load post" + error);
	}

	return null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
	try {
		const db = getDB();
		const post = await db.get<Post>(
			`SELECT posts.id,
				posts.title,
				posts.content,
				posts.image,
				posts.teaser,
				posts.createdAt,
  			authors.firstName || ' ' || authors.lastName AS author FROM posts 
			 JOIN authors ON posts.authorId = authors.id 
			 WHERE LOWER(posts.title) = ?`,
			[unslugify(slug).toLowerCase()],
		);

		return post ?? null;
	} catch (error) {
		console.error("Failed to load post by slug" + error);
	}

	return null;
}

export async function deletePostById(id: number): Promise<void> {
	const db = getDB();
	await db.run("DELETE FROM posts WHERE id = ?", [id]);
}

export async function createPost(post: CreatePostPayload): Promise<number> {
	const db = getDB();
	const newPost = await db.run(
		"INSERT INTO posts (title, image, author, createdAt, teaser, content) VALUES ($title, $image, $author, $createdAt, $teaser, $content)",
		{
			$title: post.title,
			$image: post.image,
			$author: post.author,
			$createdAt: Math.floor(Date.now() / 1000),
			$teaser: post.teaser,
			$content: post.content,
		},
	);
	if (typeof newPost.lastID !== "number") {
		throw new Error("Failed to create post: missing inserted post id");
	}

	return newPost.lastID;
}

export async function updatePostById(
	id: number,
	updates: UpdatePostPayload,
): Promise<void> {
	const db = getDB();
	await db.run(
		"UPDATE posts SET title=$title, content=$content, author=$author, teaser=$teaser, image=$image WHERE id=$id",
		{
			$title: updates.title,
			$content: updates.content,
			$author: updates.author,
			$teaser: updates.teaser,
			$image: updates.image,
			$id: id,
		},
	);
}
