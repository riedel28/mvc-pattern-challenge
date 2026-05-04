import type { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
	if (!req.cookies.admin) {
		res.redirect("/login");
		return;
	}

	next();
}
