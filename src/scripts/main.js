import { initHeaderUnitsButton } from './modules/header-units-button.js';
import { initSearchCityInput } from './modules/search-city-input.js';
import {initHourlyForecastButton} from "./modules/houtly-forecast.js";
import { initRetryButton } from './modules/retry-button.js';


document.addEventListener("DOMContentLoaded", () => {
  initHeaderUnitsButton();
  initSearchCityInput();
  initHourlyForecastButton();
  initRetryButton();
});

