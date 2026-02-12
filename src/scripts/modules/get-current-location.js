import {getWeather} from './get-weather.js'
import { renderCurrentWeatherElements } from './render-current-weather.js';

export async function initGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      // Успешное получение позиции
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const weather = await getWeather(latitude, longitude);
          await renderCurrentWeatherElements(weather);

          const weatherSectionElement = document.querySelector('[data-js-weather]');
          const noFoundErrorElement = document.querySelector('[data-js-no-found-error]');

          if (weatherSectionElement) {
            weatherSectionElement.style.display = 'grid';
          }
          if (noFoundErrorElement) {
            noFoundErrorElement.style.display = 'none';
          }

        } catch (error) {
          console.error("Ошибка получения погоды:", error);
        }
      },

      // Ошибка получения позиции (пользователь запретил)
      (error) => {
        console.warn("Геолокация недоступна:", error.message);
      }
    );
  } else {
    console.warn("Браузер не поддерживает геолокацию");
  }
}