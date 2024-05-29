const express = require('express');

const app = express();

app.use(express.json())


app.get('/', (req,res) => {
	res.set('Content-Type', 'text/html');
	res.status(200).send('<h1>Hello World</>')
})

app.listen(3000, (error,) => {
	if (!error) {
		console.info(`App successfully started and is listening on port ` + 3000)
		return;
	}
	
	console.info(`Error occured, server can't start`, error)
})
