const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use('/static', express.static(__dirname +'/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
	socket.on('new user', (username) => {
		if (username in users) {
			socket.emit('username taken');
		} else {
			socket.username = username;
			users[username] = socket.id;
			io.emit('user connected', username);
		}
	});

	socket.on('chat message', (message) => {
		io.emit('chat message', { username: socket.username, message });
	});

	socket.on('disconnect', () => {
		delete users[socket.username];
		io.emit('user disconnected', socket.username);
	});
});

server.listen(3000, () => {
	console.log('Сервер запущено на порту 3000');
});
