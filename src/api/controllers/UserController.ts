import { NextFunction, Request, Response, Router } from 'express';
import { Controller } from './Controller';
import { HttpStatusCodes } from 'constants/';
import { UserCollectionBuilder } from 'services/UserCollectionBuilder';
import {
	validateId,
	validatePagination,
	validateUserCreate,
	validateUserUpdate,
} from 'middleware/user.middleware';

class UserController implements Controller {
	/**
	 * Inject dependencies and routes
	 *
	 * @param {UserCollectionBuilder} userCollectionBuilder
	 * @param {Router} router
	 */
	constructor(
		private userCollectionBuilder: UserCollectionBuilder = new UserCollectionBuilder(),
		public router: Router = Router()
	) {
		this.router.get('/', validatePagination, this.index);
		this.router.get('/:id', validateId, this.show);
		this.router.post('/', validateUserCreate, this.store);
		this.router.put('/:id', validateUserUpdate, this.update);
		this.router.delete('/:id', validateId, this.delete);
	}

	/**
	 * Get paginated users
	 */
	public index = async (req: Request, res: Response, next?: NextFunction) => {
		try {
			const { page = '1', limit = '25' } = req.query;
			const users = this.userCollectionBuilder
				.paginate(+page, +limit)
				.get();
			res.status(HttpStatusCodes.OK).json(users);
		} catch (error) {
			res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'An error occurred while fetching users.',
			});
		}
	};

	/**
	 * Get a single user
	 */
	public show = async (req: Request, res: Response) => {
		try {
			const user = new UserCollectionBuilder()
				.where('id', +req.params.id)
				.first();
			if (!user) {
				res.status(HttpStatusCodes.NOT_FOUND).json({
					message: `User with ID of ${req.params.id} does not exist.`,
				});
			}
			res.json(user);
		} catch (error) {
			res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
				message: `An error occurred while fetching user with ID: ${req.params.id}.`,
			});
		}
	};

	/**
	 * Store a new user
	 */
	public store = async (req: Request, res: Response) => {
		const { name, email, address } = req.body;
		try {
			const createdUser = this.userCollectionBuilder.create({
				name,
				email,
				address,
			});
			res.status(HttpStatusCodes.CREATED).json(createdUser);
		} catch (error) {
			res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'An error occurred while creating the user.',
			});
		}
	};

	/**
	 * Update user
	 */
	public update = async (req: Request, res: Response) => {
		const updatedValues = req.body;
		try {
			const updated: boolean = this.userCollectionBuilder.update(
				+req.params.id,
				updatedValues
			);
			if (updated) {
				res.status(HttpStatusCodes.OK).json({
					message: 'Successfully updated user.',
				});
			} else {
				res.status(HttpStatusCodes.BAD_REQUEST).json({
					message: 'Something went wrong with updating the user.',
				});
			}
		} catch (error) {
			res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'An error occurred while updating the user.',
			});
		}
	};

	/**
	 * Delete a user
	 */
	public delete = async (req: Request, res: Response) => {
		try {
			const deleted: boolean = this.userCollectionBuilder.delete(
				+req.params.id
			);
			if (deleted) {
				res.status(HttpStatusCodes.OK).json({
					message: 'Successfully deleted user.',
				});
			} else {
				res.status(HttpStatusCodes.BAD_REQUEST).json({
					message: 'Something went wrong with deleting the user.',
				});
			}
		} catch (error) {
			res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'An error occurred while deleting the user.',
			});
		}
	};
}

export default new UserController().router;
