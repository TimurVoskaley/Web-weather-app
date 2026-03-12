export const initSearchCityInput = () => {
  const inputElement = document.querySelector("[data-js-search-input]");
  const autocompleteDropdownElement = document.querySelector("[data-js-search-autocomplete-dropdown]");
  const autocompleteListElement = document.querySelector("[data-js-autocomplete-list]");

  if (!inputElement || !autocompleteDropdownElement || !autocompleteListElement) {
    console.warn('Search city input elements not found');
    return;
  }

  // Показ списка городов автозаполнения
  inputElement.addEventListener('focus', function() {
    autocompleteListElement.innerHTML = '';

    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (cities.length > 0) {

      cities.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("search__autocomplete-item");
        li.textContent = item;
        autocompleteListElement.appendChild(li);
      })


      autocompleteDropdownElement.classList.add('dropdown-visible');
    }
  });

  // Скрытие списка городов автозаполнения
  inputElement.addEventListener('blur', function() {
      autocompleteDropdownElement.classList.remove('dropdown-visible');
  });

  // Предотвращаем срабатывание blur при клике на элемент списка
  autocompleteListElement.addEventListener('mousedown', function(e) {
    if(e.target.matches('.search__autocomplete-item')) {
      e.preventDefault();
    }
  });

  // Обработка выбора города из списка
  autocompleteListElement.addEventListener('click', function(e) {
    if(e.target.matches('.search__autocomplete-item')) {
      inputElement.value = e.target.textContent;
      autocompleteDropdownElement.classList.remove('dropdown-visible');
    }
  });
};