import {getWeather} from './get-weather.js'
import { renderCurrentWeatherElements } from './render-current-weather.js';
import { setWeather } from '../main.js';
import { weather } from '../main.js'

export async function initGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      // Успешное получение позиции
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const currentWeather = await getWeather(latitude, longitude);
          setWeather(currentWeather);
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