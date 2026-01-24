const unitsBtnElement = document.querySelector("[data-js-units-button]");
const headerDropdownElement = document.querySelector("[data-js-header-dropdown]");
const inputElement = document.querySelector("[data-js-search-input]");
const autocompleteDropdownElement = document.querySelector("[data-js-search-autocomplete-dropdown]");
const autocompleteListElement = document.querySelector("[data-js-autocomplete-list]");


//header-dropdown
//открытие и закрытие dropdown по клику на кноку
unitsBtnElement.addEventListener('click', function(e) {
  e.stopPropagation();
  headerDropdownElement.classList.toggle('dropdown-visible');
});


//закрытие dropdown по клику в любое место документа вне dropdown
document.addEventListener('click', function(e) {
  if (!e.target.classList.contains('dropdown')) {
    headerDropdownElement.classList.remove('dropdown-visible');
  }
})

//закрытие dropdown по клавише escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' || headerDropdownElement.classList.contains('dropdown-visible')) {
    headerDropdownElement.classList.remove('dropdown-visible');
  }
})

//search input dropdown
//показ списка городов автозаполнения
inputElement.addEventListener('focus', function() {
  autocompleteDropdownElement.classList.add('dropdown-visible');
})

//скрытие списка городов автозаполнения
inputElement.addEventListener('blur', function() {
  autocompleteDropdownElement.classList.remove('dropdown-visible');
})

autocompleteListElement.addEventListener('mousedown', function(e) {
  if(e.target.matches('.search__autocomplete-item')) {
    e.preventDefault(); // Предотвращаем blur на инпуте
  }
});


autocompleteListElement.addEventListener('click', function(e) {
  if(e.target.matches('.search__autocomplete-item')) {
    e.stopPropagation();
    inputElement.value = e.target.textContent;
    autocompleteDropdownElement.classList.remove('dropdown-visible');
    inputElement.blur();
  }
})
