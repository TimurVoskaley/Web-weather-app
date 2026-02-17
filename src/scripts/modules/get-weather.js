export async function getWeather(lat, lon, units = 'metric') {
  // Параметры для API
  const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
  const windUnit = units === 'metric' ? 'kmh' : units === 'imperial' ? 'mph' : 'kmh';
  const precipUnit = units === 'metric' ? 'mm' : 'inch';

  // Формируем URL с параметрами единицр
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=apparent_temperature,temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // ✅ response доступна здесь
    const weatherData = await response.json();
    return weatherData;

  } catch (error) {
    console.error('Ошибка получения погоды:', error);
    console.log('error');
    // Бросаем ошибку дальше, чтобы вызывающий код знал об ошибке
    throw error;
  }
}
