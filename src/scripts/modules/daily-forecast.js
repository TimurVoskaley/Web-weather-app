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