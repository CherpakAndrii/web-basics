const rootStyles = getComputedStyle(document.querySelector(':root'));
let inp_bg_color = rootStyles.getPropertyValue('--inputs-bg-color');
let incorrect_inp_bg_color = rootStyles.getPropertyValue('--inputs-incorrect-bg-color');
let submit_bg = rootStyles.getPropertyValue('--submit-button-color');
let submit_dis_bg = rootStyles.getPropertyValue('--submit-button-disabled-color');


const submit = document.getElementById('submit-button');
const username = document.getElementById('username');
const passwd = document.getElementById('passwd');
const full_name = document.getElementById('full_name');
const id_card = document.getElementById('id_card');
const faculty = document.getElementById('faculty');
const birthdate = document.getElementById('birthdate');
const address = document.getElementById('address');
const users_container = document.getElementById('profiles-container');

let my_profile = {};
let fetched_profiles = [];

const fields = [username, passwd, full_name, id_card, faculty, birthdate, address]
const fildIsValid = [false, false, false, false, false, false, false];
const validationFuncs = [_validateUsername, _validateChangePasswdField, _validateName, _validateIdCard, _validateFaculty, _validateBirthDate, _validateAddress]

function _validateChangePasswdField(){
	return passwd.value === null || passwd.value === "" || _validatePasswd(passwd)
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

for (let i = 0; i < fields.length; i++){
	fields[i].addEventListener('input', () => OnChanged(i));
}

function UpdateMyData(){
	axios.put("/api/my-profile", {
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
		.catch((error) => {
			if (error.response) {
				if (error.request.status === 401)
					window.location.replace("/login");
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(error.request);
			} else {
				// Щось сталося під час налаштування запиту, що викликало помилку
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
}

submit.addEventListener('click', UpdateMyData);

function getMyProfileData(){
	axios.get("/api/my-profile")
		.then((response) => response.data)
		.then((user_data) => {
			my_profile = user_data;
			
			username.value = my_profile.login;
			passwd.value = "";
			full_name.value = my_profile.full_name;
			id_card.value = my_profile.id_card;
			faculty.value = my_profile.faculty;
			birthdate.value = my_profile.birthdate;
			address.value = my_profile.address;

			if (my_profile.is_admin){
				UpdateAllProfilesData();
			}
		})
		.catch((error) => {
			if (error.response) {
				if (error.request.status === 401)
					window.location.replace("/login");
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(error.request);
			} else {
				// Щось сталося під час налаштування запиту, що викликало помилку
				console.log('Error', error.message);
			}
			console.log(error.config);
		});

	submit.disabled = true;
	submit.style.background = submit_dis_bg;
}

getMyProfileData();

function deleteUsersProfile(deleted_user_id){
	axios.delete("/api/profiles/"+deleted_user_id)
		.then((response) => response.data)
		.then((resp_data) => {
			if (resp_data.status === "Success"){
				UpdateAllProfilesData();
			}
		})
		.catch((error) => {
			if (error.response) {
				if (error.request.status === 401)
					window.location.replace("/login");
			}
			console.log(error.config);
		});
}

function makeUserAdmin(promoted_user_id){
	axios.put("/api/profiles/"+promoted_user_id)
		.then((response) => response.data)
		.then((resp_data) => {
			if (resp_data.status === "Success"){
				UpdateAllProfilesData();
			}
		})
		.catch((error) => {
			if (error.response) {
				if (error.request.status === 401)
					window.location.replace("/login");
			}
			console.log(error.config);
		});
}

function UpdateAllProfilesData(){
	axios.get("/api/profiles")
		.then((response) => response.data)
		.then((users_data) => {
			fetched_profiles = users_data;
			users_container.innerHTML = '';
			for (let profile of fetched_profiles){
				if (profile.user_id === my_profile.user_id){
					continue;
				}
				
				users_container.innerHTML += 
					`<div class="userCard">
						<p><b>Login</b>: ${profile.login}</p>
						<p><b>Full name</b>: ${profile.full_name}</p>
						<p><b>ID-card</b>: ${profile.id_card}</p>
						<p><b>Faculty</b>: ${profile.faculty}</p>
						<p><b>Birthdate</b>: ${profile.birthdate}</p>
						<p><b>Address</b>: ${profile.address}</p>
						<div class="profiles-button-container">
							<button class="delete-profile-btn" onclick="deleteUsersProfile(${profile.user_id})">Delete</button>`+
					(!profile.is_admin? `<button class="mk-admin-btn" onclick="makeUserAdmin(${profile.user_id})">Make admin</button>` : "")+
						`</div>
					</div>`
			}
		})
		.catch((error) => {
			if (error.response) {
				if (error.request.status === 401)
					window.location.replace("/login");
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(error.request);
			} else {
				// Щось сталося під час налаштування запиту, що викликало помилку
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
}
