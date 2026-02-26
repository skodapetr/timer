
(function mount(element: HTMLElement) {
  const { seconds } = readUrlQuery();
  if (isNaN(seconds) || seconds <= 0) {
    renderInvalidInput(element);
    return;
  }
  //
  let remaining = seconds;
  const display = document.createElement('div');
  display.className = 'timer';
  element.appendChild(display);
  updateTimerElement(display, remaining);

  // Timer to update
  const interval = setInterval(() => {
    remaining -= 1;
    updateTimerElement(display, remaining);
    if (remaining === 0) {
      clearInterval(interval);
    }
  }, 1000);

})(document.getElementById("app")!);

function readUrlQuery() {
  const params = new URLSearchParams(window.location.search);
  const seconds = parseInt(params.get('t') ?? '', 10);
  return {
    seconds,
  };
}

function renderInvalidInput(element: HTMLElement) {
  element.innerHTML = '<p class="error">Pass a countdown duration via <code>?t=seconds</code></p>';
}

function updateTimerElement(display: HTMLElement, value: number) {
  display.textContent = formatAsTime(value);
  if (value === 0) {
    display.classList.add('done');
  }
}

function formatAsTime(value: number): string {
  const h = Math.floor(value / 3600);
  const m = Math.floor((value % 3600) / 60);
  const sec = value % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
