const rootStyles = getComputedStyle(document.querySelector(':root'));
let inp_bg_color = rootStyles.getPropertyValue('--inputs-bg-color');
let incorrect_inp_bg_color = rootStyles.getPropertyValue('--inputs-incorrect-bg-color');
let submit_bg = rootStyles.getPropertyValue('--submit-button-color');
let submit_dis_bg = rootStyles.getPropertyValue('--submit-button-disabled-color');


const submit = document.getElementById('submit-button');
const form1 = document.getElementById('form1');
const form2 = document.getElementById('form2');

const username = document.getElementById('username');
const passwd = document.getElementById('passwd');
const full_name = document.getElementById('full_name');
const id_card = document.getElementById('id_card');
const faculty = document.getElementById('faculty');
const birthdate = document.getElementById('birthdate');
const address = document.getElementById('address');

const fields = [full_name, id_card, faculty, birthdate, address]
const fildIsValid = [false, false, false, false, false];
const validationFuncs = [_validateName, _validateIdCard, _validateFaculty, _validateBirthDate, _validateAddress]


submit.addEventListener('click', GoNext);

function GoNext(){
	if (username.value && passwd.value){
		if (!_validateUsername(username)){
			alert("Incorrect username format! Please, use only latin letters, digits and underlines!")
		}
		else if (!_validatePasswd(passwd)){
			alert("Insecure password! Please, use digits, uppercase and lowercase latin letters!")
		}
		else{
			fetch(`/api/sign-up/${username.value}`).then((resp) => resp.json()).then(
				data => {
					if (data.available){
						form1.style.display = 'none';
						form2.style.display = 'flex';
						submit.innerText = 'Sign Up';
						submit.removeEventListener('click', GoNext);
						for (let i = 0; i < fields.length; i++){
							fields[i].addEventListener('input', () => OnChanged(i));
						}
						submit.addEventListener('click', TrySignUp);
					}
					else{
						alert('username taken');
					}
				}
			);
		}
	}
}

function OnChanged(i){
	fildIsValid[i] = validationFuncs[i](fields[i]);
	if (fildIsValid.every((el) => el)) {
		submit.disabled = false;
		submit.style.background = submit_bg;
	}
	else {
		submit.disabled = true;
		submit.style.background = submit_dis_bg;
	}
}

function TrySignUp(){
	axios.post("/api/sign-up", {
		login: username.value,
		passwd: passwd.value,
		full_name: full_name.value,
		id_card: id_card.value,
		faculty: faculty.value,
		birthdate: birthdate.value,
		address: address.value
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
				alert("Something went wrong")
			}
		});
}

function PrintData(data){
	const classname = "data-out-container";
	if (document.body.getElementsByClassName(classname).length > 2){
		document.body.getElementsByClassName(classname)[0].remove();
	}
	let dataOutput = "<div class="+classname+"><h1>Введені дані:</h1>" +
		"<p><b>ПІБ:</b> " + data.fullname.value + "</p>" +
		"<p><b>ID-карта:</b> " + data.IdCard.value + "</p>" +
		"<p><b>Факультет:</b> " + data.faculty.value + "</p>" +
		"<p><b>Дата народження:</b> " + data.birthdate.value + "</p>" +
		"<p><b>Адреса:</b> " + data.address.value + "</p></div>";
	document.body.innerHTML += dataOutput;
}
