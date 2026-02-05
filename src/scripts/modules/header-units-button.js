export const initHeaderUnitsButton = () => {
  const unitsBtnElement = document.querySelector("[data-js-units-button]");
  const headerDropdownElement = document.querySelector("[data-js-header-dropdown]");

  if (!unitsBtnElement || !headerDropdownElement) {
    console.warn('Header units button elements not found');
    return;
  }

  // Открытие и закрытие dropdown по клику на кнопку
  unitsBtnElement.addEventListener('click', function(e) {
    e.stopPropagation();
    headerDropdownElement.classList.toggle('dropdown-visible');
  });

  // Закрытие dropdown по клику в любое место документа вне dropdown
  document.addEventListener('click', function(e) {
    // Закрываем только если клик был вне dropdown и не по кнопке
    // if (!headerDropdownElement.contains(e.target) && e.target !== unitsBtnElement) {
    if (!e.target.classList.contains('dropdown')) {
      headerDropdownElement.classList.remove('dropdown-visible');
    }
  });

  // Закрытие dropdown по клавише escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && headerDropdownElement.classList.contains('dropdown-visible')) {
      headerDropdownElement.classList.remove('dropdown-visible');
    }
  });
};