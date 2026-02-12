export async function getCoordinatesByCity(cityName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=ru`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('Город не найден');
    }

    const city = data.results[0];

    return city;

    // return {
    //   lat: city.latitude,
    //   lon: city.longitude,
    //   name: city.name,
    //   country: city.country,
    //   countryCode: city.country_code,
    //   admin1: city.admin1 // регион/область
    // };

  } catch (error) {
    console.error('Ошибка геокодинга:', error);
    throw error;
  }
}