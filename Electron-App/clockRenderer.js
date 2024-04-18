const electron = require('electron');
const { ipcRenderer } = electron;

let clockPosition = { top: 20, right: 20 };
let clockFontSize = '120px';

function renderClock() {
  const clockDiv = document.getElementById('clock');
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  clockDiv.textContent = timeString;
}

function updateClockStyle() {
  const clockDiv = document.getElementById('clock');
  clockDiv.style.position = 'absolute';
  clockDiv.style.top = `${clockPosition.top}px`;
  clockDiv.style.right = `${clockPosition.right}px`;
  clockDiv.style.fontSize = clockFontSize;
  clockDiv.style.marginTop = '50px';
}

// Render the clock initially
renderClock();
updateClockStyle();

// Update the clock every second
setInterval(renderClock, 1000);

// Listen for clock style updates from the main process
ipcRenderer.on('update-clock-style', (event, { position, fontSize }) => {
  clockPosition = position;
  clockFontSize = fontSize;
  updateClockStyle();
});
