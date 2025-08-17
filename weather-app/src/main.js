import './style.css'
const cityInput = document.querySelector("#city-input");
const getWeatherBtn = document.querySelector("#get-weather");
const weatherResult = document.querySelector("#weather-result");

const apiKey = import.meta.env.VITE_API_KEY;

async function getCity() {
    const city = cityInput.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=uk`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        weatherResult.textContent = `Погода у ${city}: ${data.main.temp}°C, ${data.weather[0].description}`;

    } catch (error) {
        weatherResult.textContent = "Помилка отримання погоди";
        console.error(error);
    }
}

getWeatherBtn.addEventListener("click", getCity);
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getCity();
    }
});