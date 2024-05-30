const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
const saveUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

const getAllUsers = (req, res) => {
	const users = getUsers();
	res.json(users);
};

const createUser = (req, res) => {
	const {name, email, address} = req.body;
	const users = getUsers();
	const newUser = {id: users.length + 1, name, email, address};
	users.push(newUser);
	saveUsers(users);
	res.status(201).json(newUser);
};

const getUserById = (req, res) => {
	const users = getUsers();
	const userId = parseInt(req.params.id);
	let user;
	
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === userId) {
			user = users[i];
			break;
		}
	}
	
	if (user) {
		res.json(user);
	} else {
		res.status(404).json({error: 'User not found'});
	}
};

const updateUser = (req, res) => {
	const users = getUsers();
	const userId = parseInt(req.params.id);
	const {name, email, address} = req.body;
	let user;
	
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === userId) {
			user = users[i];
			break;
		}
	}
	
	if (user) {
		user.name = name;
		user.email = email;
		user.address = address;
		saveUsers(users);
		res.json(user);
	} else {
		res.status(404).json({error: 'User not found'});
	}
};

const deleteUser = (req, res) => {
	const users = getUsers();
	const userId = parseInt(req.params.id);
	let user;
	
	for (let i = 0; i < users.length; i++) {
		if (users[i].id === userId) {
			user = users[i];
			break;
		}
	}
	
	if (user) {
		const updatedUsers = users.filter((u) => u.id !== userId);
		saveUsers(updatedUsers);
		res.json({message: 'User deleted successfully'});
	} else {
		res.status(404).json({error: 'User not found'});
	}
};

module.exports = {getAllUsers, createUser, getUserById, updateUser, deleteUser};
