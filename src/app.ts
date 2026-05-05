import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";

import postsRoutes from "./routes/posts";
import contactRoutes from "./routes/contact";
import aboutRoutes from "./routes/about";
import postExampleRoutes from "./routes/examplePost";
import adminRoutes from "./routes/admin";
import apiRoutes from "./routes/api";
import loginRoutes from "./routes/login";
import { auth } from "./middleware/auth";
import { closeDB, connectDB } from "./db/database";

const app = express();
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const viewsDir = path.resolve(__dirname, "views");
const assetsDir = path.join(projectRoot, "src", "assets");
const cssDir = path.join(projectRoot, "src", "css");

await connectDB();

app.use(express.urlencoded({ extended: true }));

nunjucks.configure(viewsDir, { autoescape: true, express: app });
app.set("view engine", "html");
app.set("views", viewsDir);
app.use("/assets", express.static(assetsDir));
app.use("/css", express.static(cssDir));

app.use("/", postsRoutes);
app.use("/contact", contactRoutes);
app.use("/about", aboutRoutes);
app.use("/example-post", postExampleRoutes);

app.use("/admin", auth, adminRoutes);
app.use("/api", apiRoutes);

app.use("/login", loginRoutes);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
	console.log("SIGINT received. Closing database connection...");
	await closeDB();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("SIGTERM received. Closing database connection...");
	await closeDB();
	process.exit(0);
});
