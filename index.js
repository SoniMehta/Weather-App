// -------------------- WEATHER APP --------------------
// Fetches live weather info using OpenWeatherMap API
// Demonstrates: async/await, fetch(), DOM manipulation, destructuring

// DOM Elements
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

// Your OpenWeatherMap API key
const apiKey = "2732f1720a238e465e90355e5afcc488";

// -------------------- EVENT LISTENER --------------------
weatherForm.addEventListener("submit", async event => {
  event.preventDefault(); // Prevents form reload/refresh

  const city = cityInput.value.trim();

  if (city) {
    try {
      const weatherData = await getWeatherData(city); // Wait for API result
      displayWeatherInfo(weatherData); // Show data
    } catch (error) {
      console.error(error);
      displayError("City not found or API issue");
    }
  } else {
    displayError("Please enter a city");
  }
});

// -------------------- FETCH WEATHER DATA --------------------
async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }

  // Convert API response to JSON format
  return await response.json();
}

// -------------------- DISPLAY WEATHER INFO --------------------
function displayWeatherInfo(data) {
  // Object destructuring — extracts nested data cleanly
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }]
  } = data;

  // Clear previous results
  card.textContent = "";
  card.style.display = "flex";

  // Create DOM elements dynamically
  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  // Add text + classes to elements
  cityDisplay.textContent = city;
  cityDisplay.classList.add("cityDisplay");

  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`; // Convert Kelvin → °C
  tempDisplay.classList.add("tempDisplay");

  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  humidityDisplay.classList.add("humidityDisplay");

  descDisplay.textContent = description;
  descDisplay.classList.add("descDisplay");

  weatherEmoji.textContent = getWeatherEmoji(id);
  weatherEmoji.classList.add("weatherEmoji");

  // Append all new elements to the card
  card.append(cityDisplay, tempDisplay, humidityDisplay, descDisplay, weatherEmoji);
}

// -------------------- WEATHER ICON LOGIC --------------------
function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️"; // Thunderstorm
    case weatherId >= 300 && weatherId < 400:
      return "🌦️"; // Drizzle
    case weatherId >= 500 && weatherId < 600:
      return "🌧️"; // Rain
    case weatherId >= 600 && weatherId < 700:
      return "❄️"; // Snow
    case weatherId >= 700 && weatherId < 800:
      return "🌫️"; // Atmosphere (mist/fog)
    case weatherId === 800:
      return "☀️"; // Clear
    case weatherId >= 801 && weatherId < 810:
      return "☁️"; // Clouds
    default:
      return "❓"; // Unknown
  }
}

// -------------------- ERROR HANDLER --------------------
function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
