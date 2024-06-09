import express from 'express';
import { env } from './configs/env';
import { UserController } from './api/controllers';

const app = express();
app.use(express.json());
app.use('/users', UserController);

app.listen(env.port, () => {
	console.info(
		`App successfully started and is listening on port ` + env.port
	);
});
