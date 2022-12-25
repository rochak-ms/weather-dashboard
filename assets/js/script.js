// variable declaration
var API_KEY = "8eff972c11574d061ec4fa0b77b58db1";
var cityInput = document.querySelector("#city-input");
var submitBtn = document.querySelector("#submit");
var weatherDisplay = document.querySelector("#weather-display");
var cityName = document.querySelector("#city-name");
var cardGroup = document.querySelector("card-group");

// click event for submit button
function getCity(event) {
  event.preventDefault();
  let search = cityInput.value.trim().toUpperCase();

  console.log(search);

  if (search) {
    getCity(search);

    weatherDisplay.textContent = "";
    cityName.value = "";
  } else {
    alert(`Please Enter a City Name`);
  }
}
submitBtn.addEventListener("click", getCity);

// Function to handle getting user input to the city search field
var getCity = (city) => {
  // save city name to city name variable
  let api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  console.log(api_url);

  // Function to get the weather data and fetch the url
  fetch(api_url)
    .then((res) => {
      if (res.ok) {
        console.log(res);
        res.json().then((data) => {
          console.log(data.list);
          console.log(data);
          displayWeather(data.list, city);
        });
      } else {
        alert("Error: " + res.statusText);
      }
    })
    .catch((err) => {
      alert("Unable to connect to Open Weather");
    });
};

// Display Weather
var displayWeather = (weathers, cityName) => {
  if (weathers.length === 0) {
    weatherDisplay.textContent = "No data found.";
    return;
  }

  cityName.textContent = cityName;

  for (var i = 0; i < 1; i++) {
    var date = weathers[i].dt_txt;
    var temp = weathers[i].main.temp;
    var wind = weathers[i].wind.speed;
    var humidity = weathers[i].main.humidity;
    var icon = weathers[i].weather[i].icon;

    var justDate = date.split(" ");
    var justtemp = Math.round(temp);

    iconEl = document.createElement("img");
    iconEl.setAttribute(
      "src",
      "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    );
    weatherDisplay.appendChild(iconEl);

    dateEl = document.createElement("h4");
    dateEl.textContent = "Date: " + justDate[0];
    weatherDisplay.appendChild(dateEl);

    tempEl = document.createElement("h4");
    tempEl.textContent = "Temp: " + justtemp + " C";
    weatherDisplay.appendChild(tempEl);

    windEl = document.createElement("h4");
    windEl.textContent = "Wind: " + wind + "km/h";
    weatherDisplay.appendChild(windEl);

    humidEl = document.createElement("h4");
    humidEl.textContent = "Humidity: " + humidity + "%";
    weatherDisplay.appendChild(humidEl);

    console.log(date);
    console.log(temp);
    console.log(wind);
    console.log(humidity);
  }

  for (var i = 0; i < weathers.length; i++) {
    var date = weathers[i].dt_txt;
    var temp = weathers[i].main.temp;
    var wind = weathers[i].wind.speed;
    var humidity = weathers[i].main.humidity;

    console.log(date);
    console.log(temp);
    console.log(wind);
    console.log(humidity);
  }
};
