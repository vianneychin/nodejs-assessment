import request from 'supertest';
import express, { Express } from 'express';
import UserController from '../UserController';
import { HttpStatusCodes } from 'constants/';
import { User } from 'models';

let app: Express;

beforeEach(() => {
	app = express();
	app.use(express.json());
	app.use('/users', UserController);
});

describe('UserController', () => {
	describe('GET /users', () => {
		it('should return a paginated list of users', async () => {
			const response = await request(app).get('/users?page=1&limit=2');
			expect(response.status).toBe(HttpStatusCodes.OK);
			expect(response.body).toBeInstanceOf(Array);
		});
	});

	describe('GET /users/:id', () => {
		it('should return a single user', async () => {
			const response = await request(app).get('/users/1');
			expect(response.status).toBe(HttpStatusCodes.OK);
			expect(response.body).toHaveProperty('id', 1);
		});

		it('should return 404 if user does not exist', async () => {
			const response = await request(app).get('/users/99999999');
			expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
			expect(response.body.message).toBe(
				'User with ID of 99999999 does not exist.'
			);
		});
	});

	describe('POST /users', () => {
		it('should create a new user', async () => {
			const user: Omit<User, 'id'> = {
				name: 'John Doe',
				email: 'john@example.com',
				address: {
					street: '111 S. Harvard',
					city: 'Los Angeles',
					state: 'CA',
					zipCode: '11111',
				},
			};
			const response = await request(app).post('/users').send(user);
			expect(response.status).toBe(HttpStatusCodes.CREATED);
			expect(response.body).toHaveProperty('name', 'John Doe');
		});
	});

	describe('PUT /users/:id', () => {
		it('should update an existing user', async () => {
			const updatedValues = { name: 'Jane Doe' };
			const response = await request(app)
				.put('/users/1')
				.send(updatedValues);
			expect(response.status).toBe(HttpStatusCodes.OK);
			expect(response.body.message).toBe('Successfully updated user.');
		});
	});

	describe('DELETE /users/:id', () => {
		it('should delete an existing user', async () => {
			const response = await request(app).delete('/users/1');
			expect(response.status).toBe(HttpStatusCodes.OK);
			expect(response.body.message).toBe('Successfully deleted user.');
		});
	});
});
