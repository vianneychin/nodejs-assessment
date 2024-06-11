import fs from 'fs';
import path from 'path';
import { User } from 'models/User';
import { env } from 'configs/env';

const usersFilePath =
	process.env.NODE_ENV === 'TEST'
		? path.join(__dirname, '..', 'storage', 'users.test.json')
		: path.join(__dirname, '..', 'storage', 'users.json');

export class UserCollectionBuilder {
	private users: User[];
	private page: number | null = null;
	private limit: number = 25;

	constructor() {
		if (env.node === 'TEST') {
			const originalDb = fs.readFileSync(
				path.join(__dirname, '..', 'storage', 'users.json'),
				'utf8'
			);
			this.users = JSON.parse(originalDb);
			fs.writeFileSync(
				path.join(__dirname, '..', 'storage', 'users.test.json'),
				originalDb
			);
		} else {
			this.users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
		}
	}

	/**
	 * Sets the pagination for users data
	 *
	 * @param {number} page - The page number.
	 * @param {number} limit - The number of results per page.
	 * @returns {this} - The instance of UserCollectionBuilder for chaining.
	 */
	paginate = (page: number, limit: number): this => {
		this.page = page;
		this.limit = limit;
		return this;
	};

	/**
	 * "Query" the users based on key and value
	 *
	 * @template K - A key from the User type.
	 * @param {K} key - The key to filter users by.
	 * @param {User[K]} value - The value to match with the key.
	 * @returns {this} - The instance of UserCollectionBuilder for chaining.
	 */
	where = <K extends keyof User>(key: K, value: User[K]): this => {
		this.users = this.users.filter(user => user[key] == value);
		return this;
	};

	/**
	 * First item of user results
	 * @returns {UserCollectionBuilder}
	 */
	first = (): User | null => {
		return this.users[0] || null;
	};

	/**
	 * Returns an array of users
	 *
	 * @returns {User[]} - Array of users.
	 */
	get = (): User[] => {
		if (!this.page) return this.users;

		const startIndex = (this.page - 1) * this.limit;
		const endIndex = this.page * this.limit;
		return this.users.slice(startIndex, endIndex);
	};

	/**
	 * Creates a new user and stores it in the database.
	 *
	 * @param {Omit<User, 'id'>} data - Values to create a new user.
	 * @returns {User} - The created user.
	 */
	create = (data: Omit<User, 'id'>): User => {
		const newUser: User = {
			id: this.users.length + 1,
			...data,
		};
		this.users = [...this.users, newUser];
		fs.writeFileSync(usersFilePath, JSON.stringify(this.users, null, 2));
		return newUser;
	};

	/**
	 * Updates a user's values.
	 *
	 * @param {number} id - The id of the user to update.
	 * @param {Partial<User>} updatedValues - The new values for the user.
	 * @returns {boolean} - If the update operation was successful
	 */
	update = (id: number, updatedValues: Partial<User>): boolean => {
		const userIndex = this.users.findIndex(user => user.id === id);
		if (userIndex === -1) return false;

		this.users = this.users.map((user, index) =>
			index === userIndex ? { ...user, ...updatedValues } : user
		);
		fs.writeFileSync(usersFilePath, JSON.stringify(this.users, null, 2));
		return true;
	};

	/**
	 * Deletes a user.
	 *
	 * @param {number} id - The id of the user to delete.
	 * @returns {boolean} - If the delete operation was successful.
	 */
	delete = (id: number): boolean => {
		const userIndex = this.users.findIndex(user => user.id === id);
		if (userIndex === -1) return false;

		this.users = this.users.filter((_, index) => index !== userIndex);
		fs.writeFileSync(usersFilePath, JSON.stringify(this.users, null, 2));
		return true;
	};
}
