// variable declaration
var API_KEY = "8eff972c11574d061ec4fa0b77b58db1";
var cityInput = document.querySelector("#city-input");
var submitBtn = document.querySelector("#submit");
var weatherDisplay = document.querySelector("#weather-display");
var cityNameEl = document.querySelector("#city-name");
var cardGroup = document.querySelector("#card-group");
var savedBtn = document.querySelector("#hereThis");
var clearBtn = document.querySelector("#clear");

var cities = JSON.parse(localStorage.getItem("cities")) || [];
// search btn runs getCity function
submitBtn.addEventListener("click", getCity);

// format users search term, make sure they enter something
function getCity(event) {
  event.preventDefault();

  var search = cityInput.value.trim().toUpperCase();

  if (search) {
    getCity(search);

    weatherDisplay.textContent = "";
    cityNameEl.value = "";
    cardGroup.textContent = "";
  } else {
    alert(`Please Enter a City Name`);
  }
}

// Function to handle getting user input to the city search field
var getCity = (city) => {
  // save city name to city name variable
  let api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  // Function to get the weather data and fetch the url
  fetch(api_url)
    .then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          displayWeather(data, city);
        });
      } else {
        alert("Error: " + res.statusText);
      }
    })
    .catch((err) => {
      alert("Unable to connect to Open Weather");
    });
  cities.push(city);
  saveSearch();
  pastSearch(city);
};

function saveSearch() {
  localStorage.setItem("cities", JSON.stringify(cities));
}

getStorage();

function getStorage() {
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  for (var i = 0; i < storedCities.length; i++) {
    var cityButton = document.createElement("button");
    cityButton.classList = "btn btn-primary mt-3";
    cityButton.setAttribute("data", storedCities[i]);
    cityButton.setAttribute("id", "click");
    savedBtn.appendChild(cityButton);
    cityButton.textContent = storedCities[i];
  }
}

var pastSearch = (city) => {
  var cityButton = document.createElement("button");
  cityButton.classList = "btn btn-primary mt-3";
  cityButton.setAttribute("data", city);
  cityButton.setAttribute("id", "click");
  savedBtn.appendChild(cityButton);
  cityButton.textContent = city;
};

var pastSearchHandler = (event) => {
  var city = event.target.getAttribute("data");
  weatherDisplay.textContent = "";
  cityNameEl.value = "";
  cardGroup.textContent = "";
  var api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(api_url)
    .then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          displayWeather(data, city);
        });
      } else {
        alert("Error: " + res.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect tp Open Weather");
    });
};

// when button is clicked runs the past search
savedBtn.addEventListener("click", pastSearchHandler);

// loop today's main Weather
function displayWeather(data, city) {
  if (data.list.length === 0) {
    weatherDisplay.textContent = "No data found.";
    return;
  }

  // update city name in the DOM
  cityNameEl.textContent = city;
  for (let i = 0; i < 1; i++) {
    var date = data.list[0].dt_txt;
    var temp = data.list[0].main.temp;
    var wind = data.list[0].wind.speed;
    var humidity = data.list[0].main.humidity;
    var iconWeather = data.list[0].weather[0].icon;
    var justDate = date.split(" ");
    var justtemp = Math.round(temp);

    // setting weather icon
    iconEl = document.createElement("img");
    iconEl.setAttribute(
      "src",
      "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png"
    );
    weatherDisplay.appendChild(iconEl);

    // shows the date
    dateEl = document.createElement("h4");
    var formatDate = moment(justDate[0]).format("dddd, MMMM Do YYYY");
    dateEl.textContent = "Date: " + formatDate;
    weatherDisplay.appendChild(dateEl);

    // show the temperature
    tempEl = document.createElement("h4");
    tempEl.textContent = "Temp: " + justtemp + " C";
    weatherDisplay.appendChild(tempEl);

    // shows the wind speed
    windEl = document.createElement("h4");
    windEl.textContent = "Wind: " + wind + "km/h";
    weatherDisplay.appendChild(windEl);

    // shows the humidity
    humidEl = document.createElement("h4");
    humidEl.textContent = "Humidity: " + humidity + "%";
    weatherDisplay.appendChild(humidEl);

    var lat = data.city.coord.lat;
    var lon = data.city.coord.lon;
    getUvIndex(lat, lon);
    getFiveDay(data);
  }

  function getFiveDay(data) {
    // loops through array to pull the 5 days, excluding 3hours time intevals

    for (var i = 0; i < data.list.length; i = i + 8) {
      var date = data.list[i].dt_txt;
      var next = data.list[i];
      var temp = data.list[i].main.temp;
      var wind = data.list[i].wind.speed;
      var humidity = data.list[i].main.humidity;

      newCard = document.createElement("div");
      newCard.classList = "card";
      cardGroup.appendChild(newCard);

      innerCard = document.createElement("div");
      innerCard.classList = "card-body";
      newCard.appendChild(innerCard);

      // append the date
      var justDate = date.split(" ");
      var formatDate = moment(justDate[0]).format("dddd");
      cardContent = document.createElement("h4");
      cardContent.textContent = formatDate;
      newCard.appendChild(cardContent);

      // append the temp
      var justTemp = Math.round(temp);
      cardContent = document.createElement("h4");
      cardContent.textContent = "Temp: " + justTemp + " C";
      innerCard.appendChild(cardContent);

      // append the wind
      cardContent = document.createElement("h4");
      cardContent.textContent = "Wind: " + wind + " km/h";
      innerCard.appendChild(cardContent);

      // append the humidity
      cardContent = document.createElement("h4");
      cardContent.textContent = "Humidity: " + humidity + " %";
      innerCard.appendChild(cardContent);
    }
  }
}

// retreive UV index by calling api
var getUvIndex = (lat, lon) => {
  var api_url = `https://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}&lat=${lat}&lon=${lon}`;

  fetch(api_url).then((res) => {
    res.json().then((data) => {
      displayUvIndex(data);
    });
  });
};

// appends UV index to today's weather and gives it a background color based on the values received
var displayUvIndex = (index) => {
  uvIndexValue = document.createElement("h4");
  uvIndexValue.textContent = "UV Index: " + index.value;

  if (index.value <= 2) {
    uvIndexValue.classList = "favourable";
  } else if (index.value > 2 && index.value <= 8) {
    uvIndexValue.classList = "moderate";
  } else if (index.value > 8) {
    uvIndexValue.classList = "severe";
  }
  weatherDisplay.appendChild(uvIndexValue);
};
