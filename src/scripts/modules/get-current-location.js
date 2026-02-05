import {getWeather} from './get-weather.js'

export async function initGeolocation() {
  if ("geolocation" in navigator) {
    let result = confirm("Разрешаете доступ к геопозиции для отображения корректной погоды?");
    console.log(result);

    if (result) {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {

            const weather = await getWeather(latitude, longitude);
            console.log("Данные погоды:", weather);

            // Можно использовать данные
            // displayWeather(weather);

          } catch (error) {
            console.error("Ошибка получения погоды:", error);
          }
        });
      } catch (error) {
        console.error("Ошибка геолокации:", error);
      }
    }
  }
}