// apiKey
var apiKey = "&APPID=90b29c37cec531de43800537a322384a";

// get searchValue from user input
function getSearchVal() {
    var searchValue = $("#search-value").val();
    getWeather(searchValue);
    makeRow(searchValue);
}
// create history Item on page
function makeRow(searchValue) {
    var liEl = document.createElement("li")
    liEl.classList.add("list-group-item", "list-group-item-action");
    var text = searchValue;
    liEl.textContent = text;
    var historyEl = document.querySelector(".history");
    historyEl.onclick = function () {
        if (event.target.tagName == "LI") {
            getWeather(event.target.textContent)
        }
    };
    historyEl.appendChild(liEl);
}

// fetch weather data for city from openweather api
function getWeather(searchValue) {
    fetch(
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        searchValue +
        apiKey +
        "&units=metric"
    ).then(function (response) {
        return response.json();
    }).then(function (data) {
        // clear old data from display
        todayEl = document.querySelector("#today");
        todayEl.textContent = " ";

        // create current weather content
        var titleEl = document.createElement("h3")
        titleEl.classList.add("card-title");
        titleEl.textContent = data.name + " - " + moment().format("llll");
        var cardEl = document.createElement("div");
        cardEl.classList.add("card");
        var tempEl = document.createElement("p");
        tempEl.classList.add("card-text");
        var windEl = document.createElement("p");
        windEl.classList.add("card-text");
        var humidEl = document.createElement("p");
        humidEl.classList.add("card-text");
        tempEl.textContent = "Temperature: " + Math.floor(data.main.temp) + " °C";
        humidEl.textContent = "Humidity: " + data.main.humidity + " %";
        windEl.textContent = "Windspeed: " + data.wind.speed + " KPH";
        var cardBodyEl = document.createElement("div");
        cardBodyEl.classList.add("card-body");
        var imgEl = document.createElement("img");
        imgEl.setAttribute(
            "src",
            "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
        );
        //appending info to cards
        titleEl.appendChild(imgEl)
        cardBodyEl.appendChild(titleEl);
        cardBodyEl.appendChild(tempEl);
        cardBodyEl.appendChild(humidEl);
        cardBodyEl.appendChild(windEl);
        cardEl.appendChild(cardBodyEl);
        todayEl.appendChild(cardEl);

        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
    })
}

// get 5 day forecast from openweather api
function getForecast(searchValue) {
    fetch(
        "http://api.openweathermap.org/data/2.5/forecast?q=" + 
        searchValue +
        apiKey +
        "&units=metric"
    ).then(function (response) {

        return response.json();
    }).then(function (data) {
        //console.log(data)
        var forecastEl = document.querySelector("#forecasts");
        forecastEl.innerHTML = "<h4 class=\"mt-3\">5-Day Forecast:</h4>";
        forecastRowEl = document.createElement("div");
        forecastRowEl.className = "\"row\"";

        //loop over all forecasts
        for (var i = 0; i < data.list.length; i++) {

            // use forecasts for 10:00:00 am
            if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {

                // create DOM Elememts for forecast data
                var colEl = document.createElement("div");
                colEl.classList.add("col-md-2");
                var cardEl = document.createElement("div");
                cardEl.classList.add("card", "bg-primary", "text-white");
                var windEl = document.createElement("P");
                windEl.classList.add("card-text");
                windEl.textContent = " Wind speed: " + data.list[i].wind.speed + "KPH";
                var humidityEl = document.createElement("p");
                humidityEl.classList.add("card-text");
                humidityEl.textContent = "Humidity: " + data.list[i].main.humidity + " %";
                var bodyEl = document.createElement("div");
                bodyEl.classList.add("card-body", "p-2");
                var titleEl = document.createElement("h5");
                titleEl.classList.add("card-title");
                titleEl.textContent = moment(data.list[i].dt_txt).format("dddd");
                var imgEl = document.createElement("img");
                imgEl.setAttribute("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                var p1El = document.createElement("p");
                p1El.classList.add("card-text");
                p1El.textContent = "Temp: " + Math.floor(data.list[i].main.temp_max) + "°C";
                // var p2El = document.createElement("p");
                // p2El.classList.add("card-text");
                // p2El.textContent = "Humidity: " + data.list[i].main.humidity + "%";

                // add forecast data to cards and display on page
                colEl.appendChild(cardEl)
                bodyEl.appendChild(titleEl);
                bodyEl.appendChild(imgEl);
                bodyEl.appendChild(p1El);
                bodyEl.appendChild(humidityEl);
                bodyEl.appendChild(windEl);
                cardEl.appendChild(bodyEl);
                forecastEl.appendChild(colEl);
            }
        }
    });
}

// get UV index
function getUVIndex(lat, lon) {
    fetch(
        "http://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        apiKey
    ).then(function (response) {
        return response.json();
    }).then(function (data) {
        var bodyEl = document.querySelector(".card-body");
        var uvEl = document.createElement("p");
        uvEl.textContent = "UV Index: ";
        var buttonEl = document.createElement("span");
        buttonEl.classList.add("btn", "btn-sm");
        buttonEl.innerHTML = data.value;

        if (data.value < 3) {
            buttonEl.classList.add("btn-success");
        } else if (data.value < 7) {
            buttonEl.classList.add("btn-warning");
        } else {
            buttonEl.classList.add("btn-danger");
        }
        bodyEl.appendChild(uvEl);
        uvEl.appendChild(buttonEl);
    });
}

document.querySelector("#search-button").addEventListener("click", getSearchVal);