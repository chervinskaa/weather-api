import './style.css'

const cityInput = document.querySelector("#city-input");
const getWeatherBtn = document.querySelector("#get-weather");
const weatherResult = document.querySelector("#weather-result");

const cityNameEl = document.querySelector("#city-name");
const tempEl = document.querySelector("#temperature");
const timeEl = document.querySelector("#time");
const dateEl = document.querySelector("#date");
const weekdayEl = document.querySelector("#weekday");

const tempMaxEl = document.querySelector("#temp-max");
const tempMinEl = document.querySelector("#temp-min");
const humidityEl = document.querySelector("#humidity");
const cloudsEl = document.querySelector("#clouds");
const windEl = document.querySelector("#wind");

const apiKey = import.meta.env.VITE_API_KEY;

// Зміна фону
function setBackground(videoFile) {
    const bg = document.querySelector("#background-video");
    bg.src = videoFile;
}

// Картка погоди зверху
function updateWeatherCard(city, temp) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const weekday = now.toLocaleString("uk-UA", { weekday: "long" });
    const day = now.getDate();
    const month = now.toLocaleString('uk-UA', { month: 'short' });
    const year = now.getFullYear();

    cityNameEl.textContent = city;
    tempEl.textContent = `${Math.round(temp)}°C`;
    timeEl.textContent = `${hours}:${minutes}`;
    weekdayEl.textContent = weekday;
    dateEl.textContent = `${day} ${month} ${year}`;

    // оновлення часу 
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// Нижня частина сторінки
function updateWeatherDetails(data) {
    tempMaxEl.textContent = `${Math.round(data.main.temp_max)}°C`;
    tempMinEl.textContent = `${Math.round(data.main.temp_min)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;
    cloudsEl.textContent = `${data.clouds.all}%`;
    windEl.textContent = `${data.wind.speed} м/с`;
}

// Зміна фону за погодою
function setWeatherBackground(weather) {
    if (weather === "Thunderstorm") setBackground("/video-backround/thunder-backround.mp4");
    else if (weather === "Rain") setBackground("/video-backround/rain-backround.mp4");
    else if (weather === "Snow") setBackground("/video-backround/snow-backround.mp4");
    else if (weather === "Clear") setBackground("/video-backround/sunbackround.mp4");
    else if (weather === "Clouds") setBackground("/video-backround/Cloud-backround.mp4");
}

// Погода за координатами
async function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=uk`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        updateWeatherCard(data.name, data.main.temp);
        updateWeatherDetails(data);
        setWeatherBackground(data.weather[0].main);

    } catch (error) {
        weatherResult.textContent = "Помилка отримання погоди";
        console.error(error);
    }
}

// Пошук міста
async function getCity() {
    const city = cityInput.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=uk`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        updateWeatherCard(data.name, data.main.temp);
        updateWeatherDetails(data);
        setWeatherBackground(data.weather[0].main);

        cityInput.value = ""; 

    } catch (error) {
        weatherResult.textContent = "Помилка отримання погоди";
        console.error(error);
    }
}

// Слухаємо події
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error("Геолокація не доступна:", error);
            }
        );
    }
});

getWeatherBtn.addEventListener("click", getCity);
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") getCity();
});
