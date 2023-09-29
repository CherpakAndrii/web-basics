document.addEventListener('DOMContentLoaded', function () {
	const fetchDataButton = document.getElementById("fetchButton");
	const usersContainer = document.getElementById("usersContainer");

	fetchDataButton.addEventListener("click", () => {
		fetchDataButton.textContent = "Перезавантажити";
		usersContainer.innerHTML = "";

		for (let i = 0; i < 7; i++) {
			fetch("https://randomuser.me/api")
				.then((response) => response.json())
				.then((data) => {
					const userData = data.results[0];

					usersContainer.innerHTML += `<div class="userCard">
																				<img class="userPicture" src="${userData.picture.large}" alt="Profile picture"/>
																				<p>Name: ${userData.name.first} ${userData.name.last}</p>
																				<p>City: ${userData.location.city}</p>
																				<p>Postcode: ${userData.location.postcode}</p>
																				<p>Phone: ${userData.phone}</p>
																			</div>`
					
				})
				.catch((error) => {
					console.error("Помилка при отриманні даних:", error);
				});
		}
	});
});
