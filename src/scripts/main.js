import { initHeaderUnitsButton } from './modules/header-units-button.js';
import { initSearchCityInput } from './modules/search-city-input.js';
import {initHourlyForecastButton} from "./modules/hourly-forecast.js";
import { initRetryButton } from './modules/retry-button.js';
import { initGeolocation } from './modules/get-current-location.js';
import {getWeather} from "./modules/get-weather.js";
import { getCoordinatesByCity } from './modules/get-city-cordinates.js';
import { updateWeatherUI } from './modules/render-current-weather.js';
import  {getCities, saveCity} from './modules/citiesStorage.js';


export let weather = null;
export const setWeather = (newWeather) => {
  weather = newWeather;
};

const searchCityButtonElement = document.querySelector('[data-js-search-button]');
const searchCityInputElement = document.querySelector('[data-js-search-input]');
const noFoundErrorElement = document.querySelector('[data-js-no-found-error]');
const weatherSectionElement = document.querySelector('[data-js-weather]');
const mainContantElement = document.querySelector('[data-js-main-contant]');
const apiErrorContainer = document.querySelector('[data-js-api-error]');
let cities = null

document.addEventListener("DOMContentLoaded", () => {
  initHeaderUnitsButton();
  initSearchCityInput();
  initHourlyForecastButton();
  initRetryButton();
  initGeolocation();
  cities = getCities();
});

searchCityButtonElement.addEventListener('click', getCurrentWeather)
searchCityInputElement.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchCityButtonElement.click()
    searchCityInputElement.blur();
  }
});

async function getCurrentWeather() {
  noFoundErrorElement.style.display = 'none';
  if (apiErrorContainer) apiErrorContainer.style.display = 'none';

  const rawCityName = searchCityInputElement.value.trim();
  const cityName = rawCityName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  if (!cityName) return;
  saveCity(cityName)

  try {
    let city = await getCoordinatesByCity(cityName);
    weather = await getWeather(city.latitude, city.longitude);

    await updateWeatherUI(weather);

    weatherSectionElement.style.display = 'grid';
    noFoundErrorElement.style.display = 'none';
    searchCityInputElement.value = '';

    // console.log('Успешно:', weather);

  } catch (error) {
    searchCityInputElement.value = '';

  // Щибка город не найдет
  if (error.message.includes('не найден') || error.message.toLowerCase().includes('not found')) {
      console.log('🔍 Город не найден:', error.message);
      weatherSectionElement.style.display = 'none';
      noFoundErrorElement.style.display = 'block';
      if (apiErrorContainer) apiErrorContainer.style.display = 'none';
    }
    //  3. Другие ошибки API
    else {
      console.error('⚠️ Неизвестная ошибка:', error);
      mainContantElement.style.display = 'none';
      noFoundErrorElement.style.display = 'none';
      if (apiErrorContainer) apiErrorContainer.style.display = 'flex';
    }
  }
}