
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

let searchInputBox = document.getElementById('input-box');
searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);  
    }
});

function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)  
        .then(weather => weather.json())
        .then(showWeaterReport);  
}

function showWeaterReport(weather) {
    let city_code = weather.cod;
    if (city_code === '400') { 
        swal("Empty Input", "Please enter any city", "error");
        reset();
    } else if (city_code === '404') {
        swal("Bad Input", "Entered city didn't match", "warning");
        reset();
    } else {
        let todayDate = new Date();
        let weather_body = document.getElementById('weather-body');

        weather_body.style.display = 'flex';
        weather_body.innerHTML = `
        <div class="weather-left">
            <div class="location-deatils">
                <div class="city">${weather.name}, ${weather.sys.country}</div>
                <div class="date">${dateManage(todayDate)}</div>
            </div>
            <div class="weather-status">
                <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>
                <div class="weather">${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i></div>
                <div class="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
                <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
            </div>
            <hr>
            <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}%<br>Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
        </div>
        <div class="weather-right">
            <div class="highlight-box">
                <span>👕 Clothing Tip:</span> ${getClothingSuggestion(weather)}
            </div>
            <div class="highlight-box">
                <span>🧳 Travel Planner:</span> ${getTravelSuggestion(weather)}
            </div>
        </div>
        `;

        changeBg(weather.weather[0].main);
        reset();
    }
}

function getClothingSuggestion(weather) {
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const condition = weather.weather[0].main;
    let suggestion = "";

    if (temp > 30) suggestion += "<span>Wear</span> light cotton clothes. ";
    else if (temp > 20) suggestion += "<span>Wear</span> comfortable clothes. ";
    else suggestion += "<span>Wear</span> warm clothes. ";

    if (humidity > 70) suggestion += "Avoid synthetic fabrics. ";
    if (condition === "Rain" || condition === "Drizzle") suggestion += "<span>Carry</span> an umbrella. ";
    if (condition === "Clear" && temp > 25) suggestion += "<span>Apply</span> sunscreen. ";
    if (weather.wind.speed > 20) suggestion += "Use a windbreaker jacket. ";

    return suggestion;
}

function getTravelSuggestion(weather) {
    const temp = weather.main.temp;
    const condition = weather.weather[0].main;

    if (condition === "Rain" || condition === "Thunderstorm") return "<span>Avoid</span> travel now due to bad weather.";
    if (temp >= 18 && temp <= 30 && condition === "Clear") return "Perfect time to go out or take a walk.";
    if (temp > 32) return "Too hot. Prefer <span>evening travel</span>.";
    return "Weather is moderate. You can go out with <span>precautions</span>.";
}

function getTime(todayDate) {
    let hour = addZero(todayDate.getHours());
    let minute = addZero(todayDate.getMinutes());
    return `${hour}:${minute}`;
}

function dateManage(dateArg) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let year = dateArg.getFullYear();
    let month = months[dateArg.getMonth()];
    let date = dateArg.getDate();
    let day = days[dateArg.getDay()];
    return `${date} ${month} (${day}) , ${year}`;
}

function changeBg(status) {
    const bgMap = {
        Clouds: 'clouds.jpg',
        Rain: 'rainy.jpg',
        Clear: 'clear.jpg',
        Snow: 'snow.jpg',
        Sunny: 'sunny.jpg',
        Thunderstorm: 'thunderstrom.jpg',
        Drizzle: 'drizzle.jpg',
        Mist: 'mist.jpg',
        Haze: 'mist.jpg',
        Fog: 'mist.jpg'
    };
    document.body.style.backgroundImage = `url(img/${bgMap[status] || 'bg.jpg'})`;
}

function getIconClass(classarg) {
    const iconMap = {
        Rain: 'fas fa-cloud-showers-heavy',
        Clouds: 'fas fa-cloud',
        Clear: 'fas fa-cloud-sun',
        Snow: 'fas fa-snowman',
        Sunny: 'fas fa-sun',
        Mist: 'fas fa-smog',
        Thunderstorm: 'fas fa-thunderstorm',
        Drizzle: 'fas fa-thunderstorm'
    };
    return iconMap[classarg] || 'fas fa-cloud-sun';
}

function reset() {
    document.getElementById('input-box').value = "";
}

function addZero(i) {
    return (i < 10) ? "0" + i : i;
}
