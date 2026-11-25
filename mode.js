const panel = document.querySelector('.instrument');
for (const button of panel.querySelectorAll('button')) {
  button.addEventListener('click', () => {
    panel.dataset.mode = button.dataset.mode;
    for (const option of panel.querySelectorAll('button')) option.setAttribute('aria-pressed', String(option === button));
  });
}
