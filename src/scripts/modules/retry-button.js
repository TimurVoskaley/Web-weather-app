export const initRetryButton = () => {
  const retryButton = document.querySelector('.api-error__button');
  retryButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (!navigator.onLine) {
      alert('Нет подключения к интернету. Проверьте соединение.');
      return;
    }

    retryButton.classList.add('loading');
    retryButton.disabled = true;

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  })
}