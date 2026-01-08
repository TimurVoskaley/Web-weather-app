const unitsBtn = document.querySelector("[data-js-units-button]");
const headerDropdown = document.querySelector("[data-js-header-dropdown]");

//открытие и закрытие dropdown по клику на кноку
unitsBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  headerDropdown.classList.toggle('dropdown-visible');
});


//закрытие dropdown по клику в любое место документа вне dropdown
document.addEventListener('click', function(e) {
  if (!e.target.classList.contains('dropdown')) {
    headerDropdown.classList.remove('dropdown-visible');
  }
})

//закрытие dropdown по клавише escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' || headerDropdown.classList.contains('dropdown-visible')) {
    headerDropdown.classList.remove('dropdown-visible');
  }
})