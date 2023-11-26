const username = document.getElementById('username');
const passwd = document.getElementById('passwd');
const submit = document.getElementById('submit-button');

const rootStyles = getComputedStyle(document.querySelector(':root'));
let incorrect_button_color = rootStyles.getPropertyValue('--submit-button-incorrect-color');
let correct_button_color = rootStyles.getPropertyValue('--submit-button-color');


submit.addEventListener('click', () => {TryLogIn();});

function TryLogIn(){
	axios.post("/api/log-in", {
		username: username.value,
		passwd: passwd.value
	}, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
		.then((response) => response.data)
		.then((data) => {
			if (data.status === "Success"){
				window.location.replace("/");
			}
			else{
				submit.innerText = "Incorrect"
				submit.style.backgroundColor = incorrect_button_color;
				submit.removeEventListener('click', () => {TryLogIn();});
				username.addEventListener('input', () => discard_incorrect_state());
				passwd.addEventListener('input', () => discard_incorrect_state());
			}
		});
}

function discard_incorrect_state(){
	submit.innerText = "Log in"
	submit.style.backgroundColor = correct_button_color;
	submit.addEventListener('click', () => {TryLogIn();});
	username.removeEventListener('change', () => discard_incorrect_state());
	passwd.removeEventListener('change', () => discard_incorrect_state());
}
