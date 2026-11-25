const phone = document.querySelector('.phone');
const tile = phone.querySelector('.sound-tile');
const shade = phone.querySelector('.shade');
const screen = phone.querySelector('.app-screen');
const done = phone.querySelector('.done');
const openButton = document.querySelector('.open-panel');
const modes = [...phone.querySelectorAll('.modes button')];
let selected = 0;
let holdTimer;
let pointer;

function selectMode(index) {
  selected = index;
  phone.dataset.mode = String(index);
  tile.querySelector('.tile-mode').textContent = modes[index].getAttribute('aria-label');
  tile.querySelector('.tile-icon').replaceChildren(modes[index].querySelector('svg').cloneNode(true));
  modes.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
}

function showPanel(open) {
  shade.hidden = open;
  screen.hidden = !open;
  openButton.hidden = open;
  document.querySelector('#gesture').textContent = open ? panelHint : tileHint;
  (open ? done : tile).focus({preventScroll:true});
}
const tileHint = document.querySelector('#gesture').textContent;
const panelHint = document.documentElement.lang === 'en'
  ? 'Choose a mode or drag a volume slider. Tap ✓ to return.'
  : '选择模式或拖动音量滑杆，点按 ✓ 返回磁贴。';

function cancelHold() {
  clearTimeout(holdTimer);
  tile.classList.remove('holding');
  pointer = null;
}
tile.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  pointer = {id:event.pointerId, x:event.clientX, y:event.clientY};
  tile.setPointerCapture(event.pointerId);
  tile.classList.add('holding');
  holdTimer = setTimeout(() => {
    cancelHold();
    showPanel(true);
  }, 520);
});
tile.addEventListener('pointermove', event => {
  if (pointer?.id === event.pointerId && Math.hypot(event.clientX-pointer.x, event.clientY-pointer.y) > 10) cancelHold();
});
tile.addEventListener('pointerup', event => {
  if (pointer?.id === event.pointerId) selectMode((selected + 1) % modes.length);
  cancelHold();
});
for (const type of ['pointercancel', 'lostpointercapture']) tile.addEventListener(type, cancelHold);
window.addEventListener('blur', cancelHold);
tile.addEventListener('contextmenu', event => event.preventDefault());
tile.addEventListener('click', event => {
  if (!event.detail && !shade.hidden) selectMode((selected + 1) % modes.length);
});
modes.forEach((button, i) => button.addEventListener('click', () => selectMode(i)));
openButton.addEventListener('click', () => showPanel(true));
done.addEventListener('click', () => showPanel(false));
phone.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !screen.hidden) showPanel(false);
});

phone.querySelectorAll('.channel input').forEach((slider, index) => {
  const fill = phone.querySelectorAll('.monitor-meter i')[index];
  const sync = () => { fill.style.width = (100 * slider.value / slider.max) + '%'; };
  slider.addEventListener('input', sync);
  sync();
});
