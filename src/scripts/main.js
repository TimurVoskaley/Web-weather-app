import { initHeaderUnitsButton } from './modules/header-units-button.js';
import { initSearchCityInput } from './modules/search-city-input.js';
import {initHourlyForecastButton} from "./modules/houtly-forecast.js";
import { initRetryButton } from './modules/retry-button.js';
import { initGeolocation } from './modules/get-current-location.js';
import {getWeather} from "./modules/get-weather.js";
import { getCoordinatesByCity } from './modules/get-city-cordinates.js';


document.addEventListener("DOMContentLoaded", () => {
  initHeaderUnitsButton();
  initSearchCityInput();
  initHourlyForecastButton();
  initRetryButton();
  // initGeolocation();
});

const searchCityButtonElement = document.querySelector('[data-js-search-button]');
searchCityButtonElement.addEventListener('click', async (event) => {
  const searchCityInput = document.querySelector('[data-js-search-input]');
  const noFoundErrorElement = document.querySelector('[data-js-no-found-error]');
  const weatherSectionElement = document.querySelector('[data-js-weather]');
  if (searchCityInput.value !== '') {
    try {
      let city = await getCoordinatesByCity(searchCityInput.value)
      const weather = await getWeather(city.latitude, city.longitude);
      weatherSectionElement.style.display = 'block';
      noFoundErrorElement.style.display = 'none';
      console.log(weather);
    } catch (error) {

      searchCityInput.value = ''
      weatherSectionElement.style.display = 'none';
      noFoundErrorElement.style.display = 'block';
      console.error(error);
    }
  }
})