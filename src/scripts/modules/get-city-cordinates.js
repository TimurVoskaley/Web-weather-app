async function tryOpenMeteo(cityName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=ru&format=json`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const city = data.results[0];
      return {
        ...city,
        source: 'open-meteo'
      };
    }
  } catch (error) {
    console.warn('Open-Meteo error:', error.message);
  }
  return null;
}

async function tryNominatim(cityName) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&addressdetails=1&accept-language=ru`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Web-weather-app/1.0 (timur.fumoff@gmail.com)'
      }
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (!data || data.length === 0) return null;

    const result = data[0];
    const address = result.address || {};

    const cityName_russian = address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      result.display_name.split(',')[0];

    return {
      name: cityName_russian,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      country: address.country || '',
      country_code: address.country_code ? address.country_code.toUpperCase() : '',
      admin1: address.state || address.region || '',
      display_name: result.display_name,
      source: 'nominatim'
    };

  } catch (error) {
    console.warn('Nominatim error:', error.message);
  }
  return null;
}

export async function getCoordinatesByCity(cityName) {
  // Сначала пробуем Open-Meteo
  const openMeteoResult = await tryOpenMeteo(cityName);
  if (openMeteoResult) {
    console.log('✅ Open-Meteo успешно:', openMeteoResult.name);
    return openMeteoResult;
  }

  // Затем Nominatim
  const nominatimResult = await tryNominatim(cityName);
  if (nominatimResult) {
    console.log('✅ Nominatim успешно:', nominatimResult.name);
    return nominatimResult;
  }

  // Если оба не нашли
  throw new Error(`Город "${cityName}" не найден`);
}
