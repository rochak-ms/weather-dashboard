// variable declaration
var API_KEY = "8eff972c11574d061ec4fa0b77b58db1";
var cityInput = document.querySelector("#city-input");
var submitBtn = document.querySelector("#submit");
var weatherDisplay = document.querySelector("#weather-display");
var cityNameEl = document.querySelector("#city-name");
var cardGroup = document.querySelector("#card-group");
var saveBtn = document.querySelector("#saveBtn");

// search btn runs getCity function
submitBtn.addEventListener("click", getCity);

saveBtn.addEventListener("click", saveClickHandler);

var saveClickHandler = function (event) {
  var goTo = event.target.getAttribute("data");
  getCity(goTo);
};

// set local storage on page refresh
setLS();

// click event for submit button
function getCity(event) {
  event.preventDefault();

  var search = cityInput.value.trim().toUpperCase();

  console.log(search);

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

  console.log(api_url);

  // Function to get the weather data and fetch the url
  fetch(api_url)
    .then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          displayWeather(data, city);
          localStorage.setItem("city", city);
          var cityBtn = document.createElement("button");
          cityBtn.classList = "btn btn-success mt-3";
          cityBtn.setAttribute("data", city);
          saveBtn.appendChild(cityBtn);
          cityBtn.textContent = city;
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
var displayWeather = (data, cityName) => {
  if (data.length === 0) {
    weatherDisplay.textContent = "No data found.";
    return;
  }

  // update city name in the DOM
  cityNameEl.textContent = cityName;

  // getting today's weather displayed
  for (var i = 0; i < 1; i++) {
    var date = data.list[i].dt_txt;
    var temp = data.list[i].main.temp;
    var wind = data.list[i].wind.speed;
    var humidity = data.list[i].main.humidity;
    var icon = data.list[i].weather[i].icon;

    var justDate = date.split(" ");
    var justtemp = Math.round(temp);

    // setting weather icon
    iconEl = document.createElement("img");
    iconEl.setAttribute(
      "src",
      "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    );
    weatherDisplay.appendChild(iconEl);

    dateEl = document.createElement("h4");
    var formatDate = moment(justDate[0]).format("DD/MM/YY");
    dateEl.textContent = "Date: " + justDate;
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

    var lat = data.city.coord.lat;
    var lon = data.city.coord.lon;

    getUvIndex(lat, lon);
  }

  // displaying weather forecast for 5 days

  var previousDate = "";
  for (var i = 0; i < 40; i++) {
    var date = data.list[i].dt_txt;
    var currentDate = moment(date).format("L");

    if (currentDate !== previousDate) {
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
    previousDate = currentDate;
  }

  // console.log(date);
  // console.log(temp);
  // console.log(wind);
  // console.log(humidity);
};

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

function setLS() {}
