const socket = io();
const joinForm = document.getElementById('join-form');
const chatArea = document.getElementById('main-area');
const chatMessages = document.getElementById('messages');
const chatList = document.getElementById('chat-list');
const participants = document.getElementById('participants-list');
const currentChatTitle = document.getElementById('title');

let currentChatParticipants = []
let activePopUps = 0;

function addMessage(user, message){
	chatMessages.innerHTML = `<li><strong>${user}:</strong> ${message}</li>` + chatMessages.innerHTML;
}

function addJoinMessage(user){
	chatMessages.innerHTML = `<li>${user} приєднався(лася) до розмови</li>` + chatMessages.innerHTML;
}

function addLeaveMessage(user){
	chatMessages.innerHTML = `<li>${user} залишив(ла) чат</li>` + chatMessages.innerHTML;
}

function joinChat(chatLink){
	let chatname = chatLink.innerText;
	socket.emit('join chat', chatname);
	currentChatTitle.innerText = chatname;
	socket.currentChat = chatname;
	document.getElementById('message-form').style.visibility = 'visible';
}

function addChatToList(chatname){
	chatList.innerHTML += `<li onclick="joinChat(this)">${chatname}</li>`;
}

function showPopup(text){
	activePopUps += 1;
	document.getElementById('popup-text').innerText = text;
	document.getElementById('popup').classList.add('popup-show');
	document.getElementById('timer-bar').classList.remove('timer-running');
	setTimeout(() => {
		document.getElementById('timer-bar').classList.add('timer-running');
	}, 10);
	setTimeout(() => {
		activePopUps -= 1;
		if (activePopUps === 0){
			document.getElementById('popup').classList.remove('popup-show');
			setTimeout(() => {
				if (activePopUps === 0)
					document.getElementById('timer-bar').classList.remove('timer-running');
			}, 1000);
		}
	}, 3500);
}

function updateParticipantsList(){
	let users = '';
	for (let i = 0; i < currentChatParticipants.length; i++) {
		let usr = currentChatParticipants[i];
		users += `<li>${usr}</li>`;
	}
	participants.innerHTML = users;
}

document.getElementById('log-in').addEventListener('click', () => {
	const username = document.getElementById('username').value;
	if (username) {
		socket.emit('new user', username);
		socket.username = username;
	}
});

document.getElementById('username').addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		document.getElementById("log-in").click();
	}
});

document.getElementById('create').addEventListener('click', () => {
	const chatname = document.getElementById('chatname-inp').value.toString();
	if (chatname) {
		socket.emit('create chat', chatname);
	}
});

document.getElementById('chatname-inp').addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		document.getElementById("create").click();
	}
});

socket.on('chatname taken', (chatname) => {
	showPopup(`Чат з назвою "${chatname}" вже існує!`);
});

socket.on('chatname available', (chatname) => {
	document.getElementById('chatname-inp').value = '';
	showPopup(`Новий чат "${chatname}" створено!`)
});

socket.on('username taken', (username) => {
	showPopup(`Користувач з ім\'ям "${username}" вже існує!`);
});

socket.on('username available', (chatsList) => {
	joinForm.style.display = 'none';
	chatArea.style.display = 'flex';
	chatList.innerHTML = '';
	for (let ch in chatsList){
		addChatToList(ch);
	}
});

socket.on('reload', () => {
	chatList.innerHTML = '';
	participants.innerHTML = '';
	chatMessages.innerHTML = '';
	currentChatParticipants = [];
	document.getElementById('message-form').style.visibility = 'hidden';
	currentChatTitle.innerText = "Оберіть чат, будь ласка";
	if (socket.username){
		socket.emit('new user', socket.username);
	}
});

socket.on('new chat', (chatname) => {
	addChatToList(chatname);
});

socket.on('user joined', (user_chat) => {
	if (user_chat.chat === socket.currentChat){
		addJoinMessage(user_chat.username);
		currentChatParticipants.push(user_chat.username);
		updateParticipantsList();
	}
});

socket.on('history', (messages) => {
	chatMessages.innerHTML = '';
	for (let i = 0; i < messages.length; i++) {
		let msg = messages[i];
		if (msg.type === "conn"){
			addJoinMessage(msg.user);
		}
		else if (msg.type === "discon"){
			addLeaveMessage(msg.user);
		}
		else if (msg.type === "mess"){
			addMessage(msg.user, msg.message);
		}
	}
});

socket.on('users', (users) => {
	currentChatParticipants = users;
	updateParticipantsList();
});

socket.on('user leaved', (user_chat) => {
	if (user_chat.chat === socket.currentChat) {
		addLeaveMessage(user_chat.username);
		let index = currentChatParticipants.indexOf(user_chat.username);
		if (index > -1){
			currentChatParticipants.splice(index, 1);
			updateParticipantsList();
		}
	}
});

socket.on('chat message', (data) => {
	if (data.chat === socket.currentChat) {
		addMessage(data.username, data.message);
	}
});

document.getElementById('send').addEventListener('click', () => {
	const message = document.getElementById('message').value.toString();
	if (message) {
		socket.emit('chat message', message);
		document.getElementById('message').value = '';
	}
});

document.getElementById('message').addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		document.getElementById("send").click();
	}
});
