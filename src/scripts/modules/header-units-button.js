import { weather } from '../main.js'
import { setWeather } from '../main.js';
import {getWeather} from './get-weather.js'
import { updateWeatherUI } from './render-current-weather.js';

const unitsToggleButtonElement = document.querySelector("[data-js-header-dropdown-button]");
let isMetric = true;
export const initHeaderUnitsButton = () => {
  const unitsBtnElement = document.querySelector("[data-js-units-button]");
  const headerDropdownElement = document.querySelector("[data-js-header-dropdown]");

  if (!unitsBtnElement || !headerDropdownElement) {
    console.warn('Header units button elements not found');
    return;
  }

  // Открытие и закрытие dropdown по клику на кнопку
  unitsBtnElement.addEventListener('click', function(e) {
    e.stopPropagation();
    headerDropdownElement.classList.toggle('dropdown-visible');
  });

  // Закрытие dropdown по клику в любое место документа вне dropdown
  document.addEventListener('click', function(e) {
    // Закрываем только если клик был вне dropdown и не по кнопке
    if (!e.target.classList.contains('dropdown')) {
      headerDropdownElement.classList.remove('dropdown-visible');
    }
  });

  // Закрытие dropdown по клавише escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && headerDropdownElement.classList.contains('dropdown-visible')) {
      headerDropdownElement.classList.remove('dropdown-visible');
    }
  });
};


function switchWeatherUnits() {

  const buttonTexts = {
    metric: 'Switch to Imperial',
    imperial: 'Switch to Metric'
  };

  if (unitsToggleButtonElement) {
    unitsToggleButtonElement.textContent = isMetric ? buttonTexts.metric : buttonTexts.imperial;
  }

  // Обновляем выбранные пункты в dropdown
  const sections = document.querySelectorAll('.header-dropdown__section');

  sections.forEach((section, index) => {
    const items = section.querySelectorAll('.header-dropdown__section-item');

    items.forEach(item => {
      item.classList.remove('selected');
    });

    items[isMetric ? 0 : 1].classList.add('selected');

  });


}

unitsToggleButtonElement.addEventListener('click', async () => {
  isMetric = !isMetric;
  switchWeatherUnits()

  if (weather !== null) {
    try {

      let newUnitsWeather = await getWeather(weather.latitude, weather.longitude, isMetric)
      setWeather(newUnitsWeather);
      updateWeatherUI(weather)

    } catch(error) {

    }
  }
})