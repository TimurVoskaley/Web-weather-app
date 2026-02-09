export async function renderCurrentWeatherElements(weather) {
  const cityNameElement = document.querySelector('[data-js-current-weather-city-name]');
  const dateElement = document.querySelector('[data-js-weather-date]');

  try {
    // Ждем получения данных о городе
    const cityData = await getCityName(weather.latitude, weather.longitude);

    if (cityData.city && cityData.country) {
      cityNameElement.textContent = `${cityData.city}, ${cityData.country}`;
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
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`;

    const response = await fetch(reverseGeocodeUrl, {
      headers: {
        'User-Agent': 'WeatherApp/1.0 (contact@example.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Возвращаем ВЕСЬ объект данных, а не только название
    return {
      city: data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.municipality,
      country: data.address.country,
      fullAddress: data.address,
      displayName: data.display_name
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
    weekday: 'long',    // Tuesday
    month: 'short',     // Aug
    day: 'numeric',     // 5
    year: 'numeric'     // 2025
  });
  return formattedDate;
}