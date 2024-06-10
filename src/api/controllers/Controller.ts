import { NextFunction, Request, Response, Router } from 'express';

export interface Controller {
	/**
	 * Express router to define routes in the constructor
	 */
	router: Router;

	/**
	 * Get all records
	 */
	index?: (
		req: Request,
		res: Response,
		next?: NextFunction
	) => Promise<Response>;

	/**
	 * Get a single record
	 */
	show?: (
		req: Request,
		res: Response,
		next?: NextFunction
	) => Promise<Response>;

	/**
	 * Store a record
	 */
	store?: (
		req: Request,
		res: Response,
		next?: NextFunction
	) => Promise<Response>;

	/**
	 * Update a record
	 */
	update?: (
		req: Request,
		res: Response,
		next?: NextFunction
	) => Promise<Response>;

	/**
	 * Delete a record
	 */
	delete?: (
		req: Request,
		res: Response,
		next?: NextFunction
	) => Promise<Response>;
}
