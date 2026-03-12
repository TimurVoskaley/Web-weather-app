import { getWeatherIcon } from './get-weather-icon.js'

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

export function renderHourlyWeather(weather) {
  const hourlyButtonElement = document.querySelector('[data-js-hourly-button] > span');
  const weekDayElements = document.querySelectorAll('[data-js-hourly-weekday]');

  if (!weather?.hourly || weekDayElements.length === 0) return;

  const { temperature_2m, time, weather_code } = weather.hourly;

  const currentDate = getCurrentDate(weather.current.time);
  if (currentDate && hourlyButtonElement) {
    hourlyButtonElement.textContent = currentDate;
  }

  // функция возвращает и даты, и названия дней
  const daysData = getDaysData(time);

  // Сохраняем данные для использования в обработчиках
  const hourlyData = { time, temperature_2m, weather_code };

  weekDayElements.forEach((element, index) => {
    if (index < daysData.length) {
      const dayData = daysData[index];

      // Устанавливаем название дня
      element.textContent = dayData.dayName;

      // Сохраняем дату в data-атрибут
      element.dataset.date = dayData.date;

      // Если это текущий день, выделяем и показываем его погоду
      if (dayData.dayName === currentDate) {
        element.classList.add('selected');
        displayHourlyForDate(hourlyData, dayData.date);
      }

      // Добавляем обработчик клика
      element.addEventListener('click', () => {
        weekDayElements.forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        displayHourlyForDate(hourlyData, element.dataset.date);
      });
    }
  });
}


function getDaysData(timeArray) {
  const uniqueDates = [...new Set(timeArray.map(t => t.split('T')[0]))];

  return uniqueDates.map(dateStr => {
    const date = new Date(dateStr);
    return {
      date: dateStr, // "2026-02-25"
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }) // "Wednesday"
    };
  });
}

// Остальные функции без изменений
function displayHourlyForDate(hourlyData, dateStr) {
  if (!hourlyData || !dateStr) return;

  const { time, temperature_2m, weather_code } = hourlyData;
  const hourlyWeatherListElement = document.querySelector('[data-js-hourly-weather-list]');
  hourlyWeatherListElement.innerHTML = '';

  time.forEach((timestamp, index) => {
    if (timestamp.startsWith(dateStr)) {
      const date = new Date(timestamp);
      const temp = Math.round(temperature_2m[index]);
      const weatherCode = weather_code?.[index];
      // Получаем иконку для погоды
      const iconName = getWeatherIcon(weatherCode);
      // Форматируем время с помощью toLocaleString
      const formattedTime = date.toLocaleString('en-US', {
        hour: 'numeric',
        hour12: true
      });



      const hourlyWeatherItemElement = document.createElement('li')
      hourlyWeatherItemElement.classList.add('weather__hourly-item');

      hourlyWeatherItemElement.innerHTML = `
         <img
              class="weather__hourly-image"
              src="../../../assets/images/${iconName}"
              alt="weather icon"
              width="40"
              height="40"
            />
            <p class="weather__hourly-time" data-js-hourly-time>${formattedTime}</p>
            <p class="weather__hourly-temperature" data-js-hourly-temp><span>${temp}</span> &deg;</p>
      `;
      hourlyWeatherListElement.appendChild(hourlyWeatherItemElement);
    }
  });

}

function getCurrentDate(date) {
  const currentDate = new Date(date);
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  return formattedDate;
}
