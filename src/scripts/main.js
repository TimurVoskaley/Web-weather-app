import { initHeaderUnitsButton } from './modules/header-units-button.js';
import { initSearchCityInput } from './modules/search-city-input.js';
import {initHourlyForecastButton} from "./modules/hourly-forecast.js";
import { initRetryButton } from './modules/retry-button.js';
import { initGeolocation } from './modules/get-current-location.js';
import {getWeather} from "./modules/get-weather.js";
import { getCoordinatesByCity } from './modules/get-city-cordinates.js';
import { renderCurrentWeatherElements } from './modules/render-current-weather.js';


export let weather = null;
export const setWeather = (newWeather) => {
  weather = newWeather;
};

const searchCityButtonElement = document.querySelector('[data-js-search-button]');
const searchCityInputElement = document.querySelector('[data-js-search-input]');


document.addEventListener("DOMContentLoaded", () => {
  initHeaderUnitsButton();
  initSearchCityInput();
  initHourlyForecastButton();
  initRetryButton();
  initGeolocation();
});

searchCityButtonElement.addEventListener('click', getCurrentWeather)
searchCityInputElement.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchCityButtonElement.click()
    searchCityInputElement.blur();
    // await getCurrentWeather();
  }
});

async function getCurrentWeather() {
  const noFoundErrorElement = document.querySelector('[data-js-no-found-error]');
  const weatherSectionElement = document.querySelector('[data-js-weather]');
  const cityName = searchCityInputElement.value.trim();

  if (!cityName) {
    console.log('Пустой ввод');
    return;
  }

  try {
    let city = await getCoordinatesByCity(cityName);
    weather = await getWeather(city.latitude, city.longitude);

    await renderCurrentWeatherElements(weather);

    weatherSectionElement.style.display = 'grid';
    noFoundErrorElement.style.display = 'none';
    searchCityInputElement.value = '';

    console.log('Успешно:', weather);

  } catch (error) {
    searchCityInputElement.value = '';
    weatherSectionElement.style.display = 'none';
    noFoundErrorElement.style.display = 'flex';
    console.error('Ошибка:', error);
  }
}