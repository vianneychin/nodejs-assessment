import { body, validationResult, param, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCodes } from 'constants/';

export const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res
			.status(HttpStatusCodes.BAD_REQUEST)
			.json({ errors: errors.array() });
	}
	next();
};

export const validateUserCreate = [
	body('name')
		.notEmpty()
		.withMessage('Name is required.')
		.isString()
		.withMessage('Name must be a string.')
		.trim()
		.escape(),

	body('email')
		.notEmpty()
		.withMessage('Email is required.')
		.isEmail()
		.withMessage('Email must be a valid email address.')
		.normalizeEmail(),

	body('address.street')
		.notEmpty()
		.withMessage('Street is required.')
		.isString()
		.withMessage('Street must be a string.')
		.trim()
		.escape(),

	body('address.city')
		.notEmpty()
		.withMessage('City is required.')
		.isString()
		.withMessage('City must be a string.')
		.trim()
		.escape(),

	body('address.state')
		.notEmpty()
		.withMessage('State is required.')
		.isString()
		.withMessage('State must be a string.')
		.isLength({ min: 2, max: 2 })
		.withMessage('State must be 2 characters long.')
		.trim()
		.escape(),

	body('address.zipCode')
		.notEmpty()
		.withMessage('Zip Code is required.')
		.isString()
		.withMessage('Zip Code must be a string.')
		.isLength({ min: 5 })
		.withMessage('Zip Code must be at least 5 characters long.')
		.trim()
		.escape(),

	handleValidationErrors,
];

export const validateUserUpdate = [
	body('name')
		.optional()
		.isString()
		.withMessage('Name must be a string.')
		.trim()
		.escape(),

	body('email')
		.optional()
		.isEmail()
		.withMessage('Email must be a valid email address.')
		.normalizeEmail(),

	body('address.street')
		.optional()
		.isString()
		.withMessage('Street must be a string.')
		.trim()
		.escape(),

	body('address.city')
		.optional()
		.isString()
		.withMessage('City must be a string.')
		.trim()
		.escape(),

	body('address.state')
		.optional()
		.isString()
		.withMessage('State must be a string.')
		.isLength({ min: 2, max: 2 })
		.withMessage('State must be 2 characters long.')
		.trim()
		.escape(),

	body('address.zipCode')
		.optional()
		.isString()
		.withMessage('Zip Code must be a string.')
		.isLength({ min: 5 })
		.withMessage('Zip Code must be at least 5 characters long.')
		.trim()
		.escape(),

	handleValidationErrors,
];

export const validateId = [
	param('id')
		.isInt({ min: 1 })
		.withMessage('ID must be an integer greater than 0.'),
	handleValidationErrors,
];

export const validatePagination = [
	query('page')
		.optional()
		.isInt({ min: 1 })
		.withMessage('Page must be an integer greater than 0.'),
	query('limit')
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage('Limit must be an integer between 1 and 100.'),
	handleValidationErrors,
];
