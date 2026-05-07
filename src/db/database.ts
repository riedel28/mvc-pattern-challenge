import { open, type Database } from "sqlite";
import sqlite3 from "sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DB_PATH = path.join(fileURLToPath(import.meta.url), "..", "blog.db");
let db: Database | null = null;

export async function connectDB(): Promise<Database> {
	db = await open({
		filename: DB_PATH,
		driver: sqlite3.Database,
	});

	await db.run(
		`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      teaser TEXT,
      image TEXT,
      createdAt TEXT NOT NULL
    )`,
	);

	return db;
}

export function getDB(): Database {
	if (!db) {
		throw new Error("Database not connected");
	}

	return db;
}

export async function closeDB(): Promise<void> {
	if (db) {
		await db.close();
		db = null;
	}
}
