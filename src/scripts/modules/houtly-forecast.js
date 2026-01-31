export const initHourlyForecastButton = () => {
  const hourlyBtnElement = document.querySelector("[data-js-hourly-button]");
  const hourlyDropdownElement = document.querySelector("[data-js-weather-dropdown]");
  const daysListElement = document.querySelector("[data-js-weather-dropdown-list]");

  if (!hourlyBtnElement || !hourlyDropdownElement) {
    console.warn('Header units button elements not found');
    return;
  }

  // Открытие и закрытие dropdown по клику на кнопку
  hourlyBtnElement.addEventListener('click', function(e) {
    e.stopPropagation();
    hourlyDropdownElement.classList.toggle('dropdown-visible');
  });

  // Закрытие dropdown по клику в любое место документа вне dropdown
  document.addEventListener('click', function(e) {
    // Закрываем только если клик был вне dropdown и не по кнопке
    if (!e.target.classList.contains('dropdown')) {
      hourlyDropdownElement.classList.remove('dropdown-visible');
    }
  });

  // Закрытие dropdown по клавише escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && hourlyDropdownElement.classList.contains('dropdown-visible')) {
      hourlyDropdownElement.classList.remove('dropdown-visible');
    }
  });

  // Обработка клика по дню недели из списка
  daysListElement.addEventListener('click', (e) => {
    if (!e.target.classList.contains('weather__hourly-day-item')) {
      return;
    }
    hourlyBtnElement.firstElementChild.textContent = e.target.textContent;
    e.target.classList.add('selected');

    let listElements = daysListElement.querySelectorAll('.weather__hourly-day-item')
    listElements.forEach(day => {
      if (day.textContent !== e.target.textContent) {
        day.classList.remove('selected');
      }
    })
  })
}