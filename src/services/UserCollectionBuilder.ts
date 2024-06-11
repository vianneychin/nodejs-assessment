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
		this.users = this.initDb();
	}

	paginate = (page: number, limit: number): this => {
		this.page = page;
		this.limit = limit;
		return this;
	};

	where = <K extends keyof User>(key: K, value: User[K]): this => {
		this.users = this.users.filter(user => user[key] == value);
		return this;
	};

	first = (): User | null => {
		return this.users[0] || null;
	};

	get = (): User[] => {
		if (!this.page) return this.users;

		const startIndex = (this.page - 1) * this.limit;
		const endIndex = this.page * this.limit;
		return this.users.slice(startIndex, endIndex);
	};

	create = (data: Omit<User, 'id'>): User => {
		const newUser: User = {
			id: this.users.length + 1,
			...data,
		};
		this.users = [...this.users, newUser];
		fs.writeFileSync(usersFilePath, JSON.stringify(this.users, null, 2));
		return newUser;
	};

	update = (id: number, updatedValues: Partial<User>): boolean => {
		const userIndex = this.users.findIndex(user => user.id === id);
		if (userIndex === -1) return false;

		this.users = this.users.map((user, index) =>
			index === userIndex ? { ...user, ...updatedValues } : user
		);
		fs.writeFileSync(usersFilePath, JSON.stringify(this.users, null, 2));
		return true;
	};

	delete = (id: number): boolean => {
		const userIndex = this.users.findIndex(user => user.id === id);
		if (userIndex === -1) return false;

		this.users = this.users.filter((_, index) => index !== userIndex);
		fs.writeFileSync(usersFilePath, JSON.stringify(this.users, null, 2));
		return true;
	};

	private initDb = (): User[] => {
		let users: User[];
		if (env.node === 'TEST') {
			const originalDb = fs.readFileSync(
				path.join(__dirname, '..', 'storage', 'users.json'),
				'utf8'
			);
			users = JSON.parse(originalDb);
			fs.writeFileSync(
				path.join(__dirname, '..', 'storage', 'users.test.json'),
				originalDb
			);
		} else {
			users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
		}
		return users;
	};
}
