const socket = io();
const joinForm = document.getElementById('join-form');
const chat = document.getElementById('chat');

document.getElementById('join').addEventListener('click', () => {
	const username = document.getElementById('username').value;
	if (username) {
		socket.emit('new user', username);
		joinForm.style.display = 'none';
		chat.style.display = 'block';
	}
});

socket.on('username taken', () => {
	alert('Користувач з таким ім\'ям вже у чаті. Змініть ім\'я');
});

socket.on('user connected', (username) => {
	document.getElementById('messages').innerHTML += `<li>${username} приєднався(лася) до розмови</li>`;
});

socket.on('chat message', (data) => {
	document.getElementById('messages').innerHTML += `<li><strong>${data.username}:</strong> ${data.message}</li>`;
});

socket.on('user disconnected', (username) => {
	document.getElementById('messages').innerHTML += `<li>${username} залишив(ла) чат</li>`;
});

document.getElementById('send').addEventListener('click', () => {
	const message = document.getElementById('message').value;
	socket.emit('chat message', message);
	document.getElementById('message').value = '';
});
