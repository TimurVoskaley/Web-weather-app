const unitsBtnElement = document.querySelector("[data-js-units-button]");
const headerDropdownElement = document.querySelector("[data-js-header-dropdown]");

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