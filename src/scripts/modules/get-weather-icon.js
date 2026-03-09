const weatherIcons = {
  // Ясно
  0: 'icon-sunny.webp',
  1: 'icon-sunny.webp',

  // Облачно
  2: 'icon-overcast.webp',
  3: 'icon-overcast.webp',

  // Туман
  45: 'icon-fog.webp',
  48: 'icon-fog.webp',

  // Морось (легкий дождь)
  51: 'icon-drizzle.webp',
  53: 'icon-drizzle.webp',
  55: 'icon-drizzle.webp',
  56: 'icon-drizzle.webp',
  57: 'icon-drizzle.webp',

  // Дождь
  61: 'icon-rain.webp',
  63: 'icon-rain.webp',
  65: 'icon-rain.webp',
  66: 'icon-rain.webp',
  67: 'icon-rain.webp',
  80: 'icon-rain.webp',
  81: 'icon-rain.webp',
  82: 'icon-rain.webp',

  // Снег
  71: 'icon-snow.webp',
  73: 'icon-snow.webp',
  75: 'icon-snow.webp',
  77: 'icon-snow.webp',
  85: 'icon-snow.webp',
  86: 'icon-snow.webp',

  // Гроза
  95: 'icon-storm.webp',
  96: 'icon-storm.webp',
  99: 'icon-storm.webp',
};

export const getWeatherIcon = (weatherCode) => {
  return weatherIcons[weatherCode] ;
}