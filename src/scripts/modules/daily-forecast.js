import {getWeatherIcon} from "./get-weather-icon.js";

export function renderDailyWeather(weather) {
  const dailyWeatherCardElements = document.querySelectorAll('[data-js-daily-card]');

  // Проверяем, что у нас есть данные
  if (!weather?.daily || dailyWeatherCardElements.length === 0) return;

  const { temperature_2m_max, temperature_2m_min, weather_code, time } = weather.daily;

  dailyWeatherCardElements.forEach((card, index) => {
    if (index >= temperature_2m_max.length) return;
    const maxTemp = Math.round(temperature_2m_max[index]);
    const minTemp = Math.round(temperature_2m_min[index]);
    const weatherCode = weather_code[index];

    if (weatherCode !== undefined && time && maxTemp !== undefined && minTemp !== undefined ) {
      // Получаем текущую дату и вычисляем день недели для каждого индекса
      const today = new Date();
      const date = new Date(time[index]);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weatherIcon = getWeatherIcon(weatherCode)
      card.innerHTML = `
        <span class="weather__daily-card-label" data-js-daily-card-label>${daysOfWeek[date.getDay()]}</span>
          <img
            class="weather__daily-card-icon"
            src="./assets/images/${weatherIcon}"
            alt="weather icon"
            width="60"
            height="60"
          >
          <div class="weather__daily-card-temperature-wrapper">
            <span class="weather__daily-card-temperature-max" data-js-daily-card-max-temp>${maxTemp}&deg;</span>
            <span class="weather__daily-card-temperature-min" data-js-daily-card-min-temp>${minTemp}&deg</span>
          </div>
      `
    }
  })
}