import { config } from 'dotenv';

config();
export const env = {
	port: process.env.PORT ?? 3000,
	node: process.env.NODE_ENV ?? 'development',
	db: {
		host: process.env.DB_HOST ?? '127.0.0.1',
		password: process.env.DB_PASSWORD ?? null,
		port: process.env.DB_PORT ?? null,
	},
};
