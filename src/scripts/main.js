import { initHeaderUnitsButton } from './modules/header-units-button.js';
import { initSearchCityInput } from './modules/search-city-input.js';
import {initHourlyForecastButton} from "./modules/hourly-forecast.js";
import { initRetryButton } from './modules/retry-button.js';
import { initGeolocation } from './modules/get-current-location.js';
import {getWeather} from "./modules/get-weather.js";
import { getCoordinatesByCity } from './modules/get-city-cordinates.js';
import { renderCurrentWeatherElements } from './modules/render-current-weather.js';
import  {getCities, saveCity} from './modules/citiesStorage.js';


export let weather = null;
export const setWeather = (newWeather) => {
  weather = newWeather;
};

const searchCityButtonElement = document.querySelector('[data-js-search-button]');
const searchCityInputElement = document.querySelector('[data-js-search-input]');
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
  const noFoundErrorElement = document.querySelector('[data-js-no-found-error]');
  const weatherSectionElement = document.querySelector('[data-js-weather]');

  // Получаем значение и форматируем
  const rawCityName = searchCityInputElement.value.trim();
  const cityName = rawCityName.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');

  if (!cityName) {
    console.log('Пустой ввод');
    return;
  }
  saveCity(cityName)

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