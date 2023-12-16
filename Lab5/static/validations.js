function _validateUsername(usrname)
{
	return (usrname.value != null && (/^\w{3,20}$/.test(username.value)));
}

function _validatePasswd(passw)
{
	return passw.value != null && passw.value.length > 5 && passw.value.match(/[A-Z]/)?.length && passw.value.match(/[a-z]/)?.length && passw.value.match(/\d/)?.length;
}

function _validateName(fullname)
{
	if (fullname.value != null && (/^[A-ZА-ЯІҐЄЇ][a-zа-яіґєї]+ [A-ZА-ЯІҐЄЇ]\.[A-ZА-ЯІҐЄЇ]\.$/.test(fullname.value)))
	{
		fullname.style.background = inp_bg_color;
		return true;
	}

	fullname.style.background = incorrect_inp_bg_color;
	return false;
}

function _validateIdCard(IdCard)
{
	if (IdCard.value != null && (/^\d{9}$/.test(IdCard.value)))
	{
		IdCard.style.background = inp_bg_color;
		return true;
	}

	IdCard.style.background = incorrect_inp_bg_color;
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
	return false;
}

function _validateBirthDate(birthdate)
{
	if (birthdate.value != null && Date.parse(birthdate.value) != null &&
		birthdate.value.length === 10 && Date.parse(birthdate.value) < Date.now())
	{
		birthdate.style.background = inp_bg_color;
		return true;
	}

	birthdate.style.background = incorrect_inp_bg_color;
	return false;
}

function _validateAddress(address)
{
	if (address.value != null && (/^м. [А-ЯІҐЄЇ][а-яіґєї]+([- ][А-ЯІҐЄЇ][а-яіґєї]+)?$/.test(address.value)))
	{
		address.style.background = inp_bg_color;
		return true;
	}

	address.style.background = incorrect_inp_bg_color;
	return false;
}
