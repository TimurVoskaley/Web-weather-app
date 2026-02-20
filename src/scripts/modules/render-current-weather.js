import { getWeatherIcon } from './get-weather-icon.js'

export async function renderCurrentWeatherElements(weather) {
  const cityNameElement = document.querySelector('[data-js-current-weather-city-name]');
  const dateElement = document.querySelector('[data-js-weather-date]');
  const currentTemperatureElement = document.querySelector('[data-js-current-temperature]');
  const weatherIconElement = document.querySelector('[data-js-current-weather-icon]');
  const feelsLikeElement = document.querySelector('[data-js-feels-like]');
  const humidityElement = document.querySelector('[data-js-humidity]');
  const windSpeedElement = document.querySelector('[data-js-wind-speed]');
  const precipitationElement = document.querySelector('[data-js-precipitation]');

  try {
    // Ждем получения данных о городе
    const cityData = await getCityName(weather.latitude, weather.longitude);
    currentTemperatureElement.textContent = Math.round(weather.current.temperature_2m);
    feelsLikeElement.textContent = Math.round(weather.current.apparent_temperature);
    humidityElement.textContent = Math.round(weather.current.relative_humidity_2m);
    windSpeedElement.textContent = Math.round(weather.current.wind_speed_10m);
    precipitationElement.textContent = Math.round(weather.current.precipitation);
    renderDailyWeather(weather)

    const weatherIcon = getWeatherIcon(weather.current.weather_code)
    weatherIconElement.src = `../../assets/images/${weatherIcon}`;

    if (cityData.city && cityData.country) {
      cityNameElement.textContent = `${cityData.city}, ${cityData.country.replace(/\s*\(the\)\s*$/i, '').trim()}`;
    } else {
      cityNameElement.textContent = `Unknown`;
    }

    const currentDateToDisplay = await getCurrentDate(weather.current.time);
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

function renderDailyWeather(weather) {
  const dailyWeatherCardElements = document.querySelectorAll('[data-js-daily-card]');

  // Проверяем, что у нас есть данные
  if (!weather?.daily || dailyWeatherCardElements.length === 0) return;

  const { temperature_2m_max, temperature_2m_min, weather_code, time } = weather.daily;

  dailyWeatherCardElements.forEach((card, index) => {
    if (index >= temperature_2m_max.length) return;
    const maxTemp = Math.round(temperature_2m_max[index]);
    const minTemp = Math.round(temperature_2m_min[index]);
    const weatherCode = weather_code[index];

    const cardLabelElement = card.querySelector('[data-js-daily-card-label]');
    const cardIconElement = card.querySelector('[data-js-daily-card-icon]');
    const cardMaxTempElement = card.querySelector('[data-js-daily-card-max-temp] span');
    const cardMinTempElement = card.querySelector('[data-js-daily-card-min-temp] span');

    if (cardLabelElement && time) {
      // Получаем текущую дату и вычисляем день недели для каждого индекса
      const today = new Date();
      const date = new Date(time[index]);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      cardLabelElement.textContent = daysOfWeek[date.getDay()];
    }

    if (cardIconElement && weatherCode !== undefined) {
      const weatherIcon = getWeatherIcon(weatherCode)
      cardIconElement.src = `../../assets/images/${weatherIcon}`;
    }

    if (maxTemp !== undefined && minTemp !== undefined && cardMaxTempElement && cardMinTempElement) {
      cardMaxTempElement.textContent = maxTemp;
      cardMinTempElement.textContent = minTemp;
    }

  })
}