const angleInput = document.getElementById("angleRange");
const angleValue = document.getElementById("angleValue");
const massInput = document.getElementById("massRange");
const massValue = document.getElementById("massValue");
const frictionInput = document.getElementById("frictionRange");
const frictionValue = document.getElementById("frictionValue");
const stick = document.getElementById("stick");
const verticalStick = document.getElementById("verticalStick");
const togglePotrator = document.getElementById("toggle-potrator");
const potrator = document.getElementById("potrator");

const stopwatchDisplay = document.querySelector(".stopwatch");
let stopwatchInterval;
let elapsedTime = 0;

togglePotrator.addEventListener("click", () => {
  if (potrator.style.display === "none") {
    potrator.style.display = "block";
  } else {
    potrator.style.display = "none";
  }
});

const stickLength = 400; // Length of the inclined stick (horizontal stick)

massInput.addEventListener("input", () => {
  const mass = massInput.value;
  massValue.textContent = `${mass}kg`;
});

angleInput.addEventListener("input", () => {
  const angle = angleInput.value;
  angleValue.textContent = `${angle}°`;

  // Update the rotation of the inclined stick
  stick.style.transform = `rotate(-${angle}deg)`;

  const weightForce = document.querySelector('.weight-force');
  weightForce.style.transform = `rotate(${angle}deg)`;

  // Calculate the height of the vertical stick based on the angle
  const radians = (angle * Math.PI) / 180; // Convert angle to radians
  const height = stickLength * Math.sin(radians); // Calculate the vertical height
  verticalStick.style.height = `${height}px`;

  // Calculate the horizontal position of the top of the inclined stick
  const topX = stickLength * Math.cos(radians); // Horizontal position of the top

  verticalStick.style.left = `${300 + topX - 2}px`; // Move vertical stick along the horizontal axis
});

const box = document.getElementById("box-inclined-plane");
const frictionForce = document.querySelector(".friction-force");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const g = 9.81; // Gravidade (m/s^2)
let angle = 0;
let friction = 0;
let mass = 20;
let animationFrame;

frictionInput.addEventListener("input", () => {
  const frictionText = frictionInput.value;
  frictionValue.textContent = `${frictionText}`;
  friction = parseFloat(frictionInput.value);
  stick.style.borderTop = `${friction + 1.5}px dashed red`;

  if (friction > 0) {
    frictionForce.style.display = "block"
  } else {
    frictionForce.style.display = "none"
  }
});

angleInput.addEventListener("input", () => {
  angle = parseInt(angleInput.value);
  angleValue.textContent = `${angle}°`;
  stick.style.transform = `rotate(-${angle}deg)`;
});

massInput.addEventListener("input", () => {
  mass = parseInt(massInput.value);
  massValue.textContent = `${mass}kg`;
});

startButton.addEventListener("click", () => {
  cancelAnimationFrame(animationFrame);
  animateBox();
  resetStopwatch();
  startStopwatch();
});

restartButton.addEventListener("click", () => {
  cancelAnimationFrame(animationFrame);
  box.style.transform = "translateX(0px)";
  resetStopwatch();
  enableInputs();
});

function enableInputs() {
  startButton.disabled = false;
  angleInput.disabled = false;
  frictionInput.disabled = false;
  massInput.disabled = false;
}
function disableInputs() {
  startButton.disabled = true;
  angleInput.disabled = true;
  frictionInput.disabled = true;
  massInput.disabled = true;
}

function animateBox() {
  let time = 0;
  let position = 0;
  const length = 360; // Comprimento do plano inclinado

  let acceleration = g * angle * 0.2; // Aceleração correta

  disableInputs();

  if (angle === 90) {
    acceleration = g * angle;
  } else {
    if (friction > 0) {
      acceleration -= (friction + 2);
      frictionForce.style.display = "block"
    } else {
      frictionForce.style.display = "none"
    }
  }

  if (acceleration < 0) {
    acceleration = 1;
  }

  function step() {
    time += 0.05; // Simulação de incremento de tempo (50ms por frame)
    position = 0.5 * acceleration * time * time; // Equação corrigida

    if (position >= length) {
      position = length;
      clearInterval(stopwatchInterval); // Parar o cronômetro
      enableInputs();
    }

    box.style.transform = `translateX(${-position}px)`;

    if (position < length) {
      animationFrame = requestAnimationFrame(step);
    }
  }

  step();
}

function formatTime(ms) {
  let minutes = Math.floor(ms / 60000);
  let seconds = Math.floor((ms % 60000) / 1000);
  let milliseconds = Math.floor((ms % 1000) / 10);
  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    ":" +
    String(milliseconds).padStart(2, "0")
  );
}

function startStopwatch() {
  clearInterval(stopwatchInterval);
  const startTime = Date.now() - elapsedTime;
  stopwatchInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    stopwatchDisplay.textContent = formatTime(elapsedTime);
  }, 10);
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  elapsedTime = 0;
  stopwatchDisplay.textContent = "00:00:00";
}