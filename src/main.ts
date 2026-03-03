
const SUN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

(function mount(element: HTMLElement) {
  setupThemeToggle();

  const { seconds } = readUrlQuery();
  if (isNaN(seconds) || seconds <= 0) {
    renderInvalidInput(element);
    return;
  }

  const display = document.createElement('div');
  display.className = 'timer';
  element.appendChild(display);

  const resetButton = document.createElement('button');
  resetButton.className = 'reset-button';
  resetButton.textContent = 'Restart';
  resetButton.hidden = true;
  element.appendChild(resetButton);

  let intervalId: ReturnType<typeof setInterval>;

  function startCountdown() {
    let remaining = seconds;
    display.classList.remove('done');
    resetButton.hidden = true;
    updateTimerElement(display, remaining);

    intervalId = setInterval(() => {
      remaining -= 1;
      updateTimerElement(display, remaining);
      if (remaining === 0) {
        clearInterval(intervalId);
        resetButton.hidden = false;
      }
    }, 1000);
  }

  resetButton.addEventListener('click', () => {
    startCountdown();
  });

  startCountdown();

})(document.getElementById("app")!);

function setupThemeToggle() {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = saved ?? (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = current;

  const button = document.createElement('button');
  button.className = 'theme-toggle';
  updateToggleButton(button, current);

  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    updateToggleButton(button, next);
  });

  document.body.appendChild(button);
}

function updateToggleButton(button: HTMLButtonElement, theme: string) {
  if (theme === 'dark') {
    button.innerHTML = SUN_ICON;
    button.setAttribute('aria-label', 'Switch to light mode');
  } else {
    button.innerHTML = MOON_ICON;
    button.setAttribute('aria-label', 'Switch to dark mode');
  }
}

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
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const sec = value % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
