const apiKey = '6557810176c36fac5f0db536711a6c52';
const defaultCity = 'Agra'; // Default city

const loadingIcon = 'http://openweathermap.org/img/wn/01d@2x.png'; // Default icon

// Show loading icon initially
document.getElementById('weatherIcon').src = loadingIcon;
document.getElementById('cityName').innerText = 'Loading...';
document.getElementById('temperature').innerText = 'Loading...';
document.getElementById('description').innerText = 'Loading...';

// Main fetch weather function
async function fetchWeather(city = defaultCity) {
  // Show loading while fetching
  document.getElementById('weatherIcon').src = loadingIcon;
  document.getElementById('cityName').innerText = 'Loading...';
  document.getElementById('temperature').innerText = 'Loading...';
  document.getElementById('description').innerText = 'Loading...';

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    if (weatherData.cod !== 200) {
      alert(`City not found: ${city}`);
      return;
    }

    displayWeather(weatherData);
    displayForecast(forecastData.list);

    // Update background
    fetchBackgroundImage(city);

  } catch (error) {
    alert('Failed to fetch weather data.');
    console.error(error);
  }
}

function displayWeather(data) {
  document.getElementById('cityName').innerText = data.name;
  document.getElementById('temperature').innerText = `Temperature: ${Math.floor(data.main.temp)}°C`;
  document.getElementById('description').innerText = data.weather[0].description;

  const weatherCondition = data.weather[0].main.toLowerCase();
  let iconPath = 'http://openweathermap.org/img/wn/01d@2x.png'; // Default icon

  if (weatherCondition.includes('cloud')) iconPath = 'http://openweathermap.org/img/wn/02d@2x.png';
  else if (weatherCondition.includes('sun') || weatherCondition.includes('clear')) iconPath = 'http://openweathermap.org/img/wn/01d@2x.png';
  else if (weatherCondition.includes('rain')) iconPath = 'http://openweathermap.org/img/wn/09d@2x.png';
  else if (weatherCondition.includes('snow')) iconPath = 'http://openweathermap.org/img/wn/13d@2x.png';

  document.getElementById('weatherIcon').src = iconPath;
}

function displayForecast(forecastList) {
  const dailyForecasts = forecastList.filter((_, index) => index % 8 === 0);
  dailyForecasts.forEach((day, index) => {
    if (index < 4) {
      const dayCard = document.getElementById(`day${index + 1}`);
      dayCard.querySelector('.day').innerText = new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' });

      const forecastCondition = day.weather[0].main.toLowerCase();
      let forecastIconPath = 'http://openweathermap.org/img/wn/01d@2x.png';

      if (forecastCondition.includes('cloud')) forecastIconPath = 'http://openweathermap.org/img/wn/02d@2x.png';
      else if (forecastCondition.includes('sun') || forecastCondition.includes('clear')) forecastIconPath = 'http://openweathermap.org/img/wn/01d@2x.png';
      else if (forecastCondition.includes('rain')) forecastIconPath = 'http://openweathermap.org/img/wn/09d@2x.png';
      else if (forecastCondition.includes('snow')) forecastIconPath = 'http://openweathermap.org/img/wn/13d@2x.png';

      dayCard.querySelector('.forecast-icon').src = forecastIconPath;
      dayCard.querySelector('.forecast-temp').innerText = `${Math.floor(day.main.temp)}°C`;
    }
  });
}

async function fetchBackgroundImage(city) {
  const unsplashApiKey = '0uY1bzQVyuAPaa9uKhVnkFgLUhdX1Z9utjgTaesv1LI'; // Replace with your Unsplash key
  const unsplashUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}&per_page=1`;

  try {
    const response = await fetch(unsplashUrl);
    const data = await response.json();

    if (data.results.length > 0) {
      const imageUrl = data.results[0].urls.full;
      document.body.style.backgroundImage = `url(${imageUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    }
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
  }
}

// ✅ Called when clicking search icon or button
function searchWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a city name.');
  }
}

// ✅ Called when pressing Enter
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    searchWeather();
  }
}

// Load default city weather on page load
fetchWeather();
