export function slugify(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function unslugify(slug: string): string {
	return slug.replace(/-/g, " ").trim();
}
