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
const chats = {};

io.on('connection', (socket) => {
	socket.on('new user', (username) => {
		if (username in users) {
			socket.emit('username taken', username);
		} else {
			socket.emit('username available', chats);
			socket.username = username;
			users[username] = socket.id;
		}
	});

	socket.on('create chat', (chatname) => {
		if (chatname in chats) {
			socket.emit('chatname taken', chatname);
		} else {
			socket.emit('chatname available', chatname);
			chats[chatname] = {messages: [], users: []};
			io.emit('new chat', chatname);
		}
	});

	socket.on('join chat', (chatname) => {
		if (socket.currentChat !== undefined){
			chats[socket.currentChat].messages.push({type: "disconn", user: socket.username});
			let index = chats[socket.currentChat].users.indexOf(socket.username);
			if (index > -1){
				chats[socket.currentChat].users.splice(index, 1);
			}
			io.emit('user leaved', {username: socket.username, chat: socket.currentChat});
		}
		socket.currentChat = chatname;
		chats[socket.currentChat].users.push(socket.username);
		chats[socket.currentChat].messages.push({type: "conn", user: socket.username});
		io.emit('user joined', {username: socket.username, chat: socket.currentChat});
		socket.emit('history', chats[socket.currentChat].messages);
		socket.emit('users', chats[socket.currentChat].users);
	});

	socket.on('chat message', (message) => {
		io.emit('chat message', { username: socket.username, chat: socket.currentChat, message: message });
		chats[socket.currentChat].messages.push({type: "mess", user: socket.username, message: message});
	});

	socket.on('disconnect', () => {
		delete users[socket.username];
		
		if (socket.currentChat !== undefined){
			io.emit('user leaved', {username: socket.username, chat: socket.currentChat})
			chats[socket.currentChat].messages.push({type: "disconn", user: socket.username});
			let index = chats[socket.currentChat].users.indexOf(socket.username);
			if (index > -1){
				chats[socket.currentChat].users.splice(index, 1);
			}
		}
	});
});

server.listen(3000, () => {
	console.log('Сервер запущено на порту 3000');
});
