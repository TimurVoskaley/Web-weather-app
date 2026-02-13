import { getWeatherIcon } from './get-weather-icon.js'

export async function renderCurrentWeatherElements(weather) {
  const cityNameElement = document.querySelector('[data-js-current-weather-city-name]');
  const dateElement = document.querySelector('[data-js-weather-date]');
  const currentTemperatureElement = document.querySelector('[data-js-current-temperature]');
  const weatherIconElement = document.querySelector('[data-js-current-weather-icon]');

  try {
    // Ждем получения данных о городе
    const cityData = await getCityName(weather.latitude, weather.longitude);
    currentTemperatureElement.textContent = Math.round(weather.current.temperature_2m);

    const weatherIcon = getWeatherIcon(weather.current.weather_code)
    weatherIconElement.src = `../../assets/images/${weatherIcon}`;

    if (cityData.city && cityData.country) {
      cityNameElement.textContent = `${cityData.city}, ${cityData.country}`;
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

    if (data.locality && !data.locality.includes('Rayon') && !data.locality.includes('район')) {
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