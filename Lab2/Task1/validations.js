const rootStyles = getComputedStyle(document.querySelector(':root'));
let inp_bg_color = rootStyles.getPropertyValue('--inp-bg-color');
let incorrect_inp_bg_color = rootStyles.getPropertyValue('--incorrect-inp-bg-color');

function ValidateFormData(data)
{
	if (_validateName(data.fullname) &&
		_validateIdCard(data.IdCard) &&
		_validateFaculty(data.faculty) &&
		_validateBirthDate(data.birthdate) &&
		_validateAddress(data.address))
	{
		PrintData(data);
		return true;
	}
	
	return false;
}

function _validateName(fullname)
{
	if (fullname.value != null && (/^[A-ZА-ЯІҐЄЇ][a-zа-яіґєї]+ [A-ZА-ЯІҐЄЇ]\.[A-ZА-ЯІҐЄЇ]\.$/.test(fullname.value)))
	{
		fullname.style.background = inp_bg_color;
		return true;
	}

	fullname.style.background = incorrect_inp_bg_color;
	alert("Некоректний формат імені!")
	return false;
}

function _validateIdCard(IdCard)
{
	return true;
	if (IdCard.value != null && (/^\d{9}$/.test(IdCard.value)))
	{
		IdCard.style.background = inp_bg_color;
		return true;
	}

	IdCard.style.background = incorrect_inp_bg_color;
	alert("Некоректний формат номеру ID-карти!")
	return false;
}

function _validateFaculty(faculty)
{
	if (faculty.value != null && (/^[A-ZА-ЯІҐЄЇ]{3,5}$/.test(faculty.value)))
	{
		faculty.style.background = inp_bg_color;
		return true;
	}

	faculty.style.background = incorrect_inp_bg_color;
	alert("Некоректний формат назви факультету!")
	return false;
}

function _validateBirthDate(birthdate)
{
	if (birthdate.value != null &&
		// самі значення перевіряти на коректність не варто (як от місяць > 0 та < 13), форма не пропустить сміття
		Date.parse(birthdate.value) < Date.now())
	{
		birthdate.style.background = inp_bg_color;
		return true;
	}
	
	birthdate.style.background = incorrect_inp_bg_color;
	alert("Некоректний формат дати народження!")
	return false;
}

function _validateAddress(address)
{
	if (address.value != null && (/^м. [А-ЯІҐЄЇ][а-яіґєї]+(-[А-ЯІҐЄЇ][а-яіґєї]+)?$/.test(address.value)))
	{
		address.style.background = inp_bg_color;
		return true;
	}

	address.style.background = incorrect_inp_bg_color;
	alert("Некоректний формат адреси!")
	return false;
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
