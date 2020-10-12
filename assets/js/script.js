var apiKey = "90b29c37cec531de43800537a322384a";
var searhcBtnEl = $(".searchBtn");
//var searchInput = $(".searchInput");
var searchInput = "Toronto";

function getWeather (searchInput) {
    fetch("http://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&APPID=" + apiKey);
};