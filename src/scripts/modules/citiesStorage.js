let cities = JSON.parse(localStorage.getItem('cities')) || [];

export function getCities() {
  return [...cities]; // Возвращаем копию массива
}

export function saveCity(cityName) {
  const normalizedCityName = cityName.trim();

  if (!cities.includes(normalizedCityName)) {
    if (cities.length >= 4) {
      cities.pop();
    }
    cities.unshift(normalizedCityName);
    localStorage.setItem('cities', JSON.stringify(cities));
    return true;
  }
  return false;
}