import { NextFunction, Request, Response, Router } from 'express';

export interface Controller {
	/**
	 * Express router to define routes in the constructor
	 */
	router: Router;

	/**
	 * Get all records
	 */
	index?: (req: Request, res: Response, next?: NextFunction) => Promise<void>;

	/**
	 * Get a single record
	 */
	show?: (req: Request, res: Response, next?: NextFunction) => Promise<void>;

	/**
	 * Store a record
	 */
	store?: (req: Request, res: Response, next?: NextFunction) => Promise<void>;

	/**
	 * Update a record
	 */
	update?: (
		req: Request,
		res: Response,
		next?: NextFunction
	) => Promise<void>;

	/**
	 * Delete a record
	 */
	delete?: (
		req: Request,
		res: Response,
		next?: NextFunction
	) => Promise<void>;
}
