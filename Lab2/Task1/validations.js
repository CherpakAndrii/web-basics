function ValidateFormData(data)
{
	if (_validateName(data.fullname.value) &&
		_validateIdCard(data.IdCard.value) &&
		_validateFaculty(data.faculty.value) &&
		_validateBirthDate(data.birthdate.value) &&
		_validateAddress(data.address.value))
	{
		PrintData(data);
		return true;
	}
	
	return false;
}

function _validateName(fullname)
{
	if (fullname != null && (/^[A-ZА-ЯІҐЄЇ][a-zа-яіґєї]+ [A-ZА-ЯІҐЄЇ]\.[A-ZА-ЯІҐЄЇ]\.$/.test(fullname)))
	{
		return true;
	}
	
	alert("Некоректний формат імені!")
	return false;
}

function _validateIdCard(IdCard)// refine needed format
{
	return true;
	if (IdCard != null && (/^w+[-_.]*w+@w+-?w+.[a-z]{2,4}$/.test(IdCard)))
	{
		return true;
	}

	alert("Некоректний формат номеру ID-карти!")
	return false;
}

function _validateFaculty(faculty)
{
	if (faculty != null && (/^[A-ZА-ЯІҐЄЇ]{3,5}$/.test(faculty)))
	{
		return true;
	}
	
	alert("Некоректний формат назви факультету!")
	return false;
}

function _validateBirthDate(birthdate)
{
	if (birthdate != null &&
		// самі значення перевіряти на коректність не варто (як от місяць > 0 та < 13), форма не пропустить сміття
		Date.parse(birthdate) < Date.now())
	{
		return true;
	}
	
	alert("Некоректний формат дати народження!")
	return false;
}

function _validateAddress(address)// refine needed format
{
	if (address != null && (/^м. [А-ЯІҐЄЇ-]+$/.test(address)))
	{
		return true;
	}
	
	alert("Некоректний формат адреси!")
	return false;
}

function PrintData(data){
	let dataOutput = "<h1>Введені дані:</h1>" +
		"<p><b>ПІБ:</b> " + data.fullname.value + "</p>" +
		"<p><b>ID-карта:</b> " + data.IdCard.value + "</p>" +
		"<p><b>Факультет:</b> " + data.faculty.value + "</p>" +
		"<p><b>Дата народження:</b> " + data.birthdate.value + "</p>" +
		"<p><b>Адреса:</b> " + data.address.value + "</p>";
	document.body.innerHTML += dataOutput;
}
