import { getWeatherIcon } from './get-weather-icon.js'
import { renderDailyWeather } from './daily-forecast.js'
import { renderHourlyWeather } from './hourly-forecast.js'


export async function renderCurrentWeatherElements(weather) {
  const cityNameElement = document.querySelector('[data-js-current-weather-city-name]');
  const dateElement = document.querySelector('[data-js-weather-date]');
  const feelsLikeElement = document.querySelector('[data-js-feels-like]');
  const humidityElement = document.querySelector('[data-js-humidity]');
  const windSpeedElement = document.querySelector('[data-js-wind-speed]');
  const precipitationElement = document.querySelector('[data-js-precipitation]');
  const temperatureContainer = document.querySelector('[data-js-current-temperature-wrapper]');

  try {
    // Ждем получения данных о городе
    const cityData = await getCityName(weather.latitude, weather.longitude);
    feelsLikeElement.innerHTML = `${Math.round(weather.current.apparent_temperature)}&deg;`;
    humidityElement.textContent = `${Math.round(weather.current.relative_humidity_2m)}%`;
    windSpeedElement.textContent = `${Math.round(weather.current.wind_speed_10m)} ${weather.current_units.wind_speed_10m === 'km/h' ? 'km/h' : 'mph'}`;
    precipitationElement.textContent = `${Math.round(weather.current.precipitation)} ${weather.current_units.precipitation === 'mm' ? 'mm' : 'in'}`;
    renderDailyWeather(weather)
    renderHourlyWeather(weather)

    const weatherIcon = getWeatherIcon(weather.current.weather_code)
    temperatureContainer.innerHTML = `
    <img
      class="weather__current-card-icon"
      src="./assets/images/${weatherIcon}"
      alt="weather icon"
      width="120"
      height="120"
      data-js-current-weather-icon
    >
    <p class="weather__current-card-degrees">
      <span data-js-current-temperature>${Math.round(weather.current.temperature_2m)}</span>&deg;
    </p>
    `

    if (cityData.city && cityData.country) {
      cityNameElement.textContent = `${cityData.city}, ${cityData.country.replace(/\s*\(the\)\s*$/i, '').trim()}`;
    } else {
      cityNameElement.textContent = `Unknown`;
    }

    const currentDateToDisplay = getCurrentDate(weather.current.time);
    if (currentDateToDisplay) {
      dateElement.textContent = currentDateToDisplay;
    }

  } catch (error) {
    console.error('Ошибка рендеринга каточки текущей погоды:', error);
  }
}


// Получаем назавние населенного пункта из координать полученной погоды
async function getCityName(lat, lon) {
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const response = await fetch(bdcUrl);


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    let cityName = null;

    if (data.city && data.city.includes('Rayon') && !data.city.includes('район')) {
      cityName = data.locality;
      console.log('Выбран населенный пункт (locality):', cityName);
    } else {
      cityName = data.city
    }

    return {
      city: cityName || data.principalSubdivision || 'Unknown',
      country: data.countryName || '',
    };

  } catch (error) {
    console.error('Ошибка получения названия города:', error);
    return {
      city: 'Неизвестный город',
      country: ''
    };
  }
}

//Получаем текущую дату в нужном формате для отображения
function getCurrentDate(date) {
  const currentDate = new Date(date);

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return formattedDate;
}