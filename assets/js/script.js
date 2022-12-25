// variable declaration
let cityInput = document.querySelector("#city-input");
let submitBtn = document.querySelector("#submit");
let weatherDisplay = document.querySelector("#weather-display");
let cityName = document.querySelector("#city-name");

// click event for submit button
submitBtn.addEventListener("click", getCity);
function getCity(event) {
  event.preventDefault();
  let search = cityInput.value.trim();

  console.log(search);
}
