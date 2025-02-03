const box = document.querySelector("#box");
const box1 = document.querySelector("#box1");
const line = document.querySelector("#line");

let time = parseInt(document.querySelector("#massValue2").value);
let interval = null; // Variable to store interval
let stopwatchInterval = null; // Variable to store stopwatch interval

function startSimulation() {
  console.log("startSimulation");
  document.querySelector("#btnStart").disabled = true;
  document.querySelector("#massValue").disabled = true;
  document.querySelector("#massValue2").disabled = true;
  document.querySelector("#tensionValue").disabled = true;

  let position = parseInt(window.getComputedStyle(box).marginLeft);
  let position1 = parseInt(window.getComputedStyle(box1).marginBottom);
  let horizontalLine = parseInt(window.getComputedStyle(line).width);
  let verticalLine = parseInt(window.getComputedStyle(line).height);
  let lastResize = true;

  let startTime = Date.now();

  stopwatchInterval = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    let minutes = Math.floor(elapsedTime / 60000);
    let seconds = Math.floor((elapsedTime % 60000) / 1000);
    let milliseconds = elapsedTime % 1000;

    document.querySelector("#stopwatch").innerHTML = 
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
  }, 10);

  interval = setInterval(() => {
    let mass = parseInt(document.querySelector("#massValue").value);
    let mass1 = parseInt(document.querySelector("#massValue2").value);
    let tension = parseInt(document.querySelector("#tensionValue").value);
    let auxPosition, auxPosition1;

    let tensionForce = mass1 * 10 > mass ? (mass1 * 10 + tension) / (mass + mass1) : 0;

    document.querySelector("#acelerationValue").innerHTML =
      mass !== 0 && mass1 !== 0
        ? `Aceleração: ${tensionForce.toFixed(1)} m/s²`
        : "Aceleração: 0 m/s²";

    const basePulleyLimit = document.querySelector(".limit").offsetLeft;
    const boxWidth = box.offsetWidth;

    auxPosition = position + tensionForce;
    auxPosition1 = position1;
    auxPosition += tensionForce;

    if (auxPosition + boxWidth > basePulleyLimit && lastResize) {
      position = basePulleyLimit - boxWidth;
      position1 = -21;

      horizontalLine = 175;
      verticalLine = 365;

      lastResize = false;
    } else {
      position += tensionForce;
      position1 -= tensionForce;

      horizontalLine -= tensionForce;
      verticalLine += tensionForce;
    }

    if (
      (position + boxWidth > basePulleyLimit && !lastResize) ||
      mass <= 0 ||
      mass1 <= 0 ||
      position <= 0
    ) {
      clearInterval(interval);
      clearInterval(stopwatchInterval);
      document.querySelector("#btnStart").disabled = false;
      document.querySelector("#massValue").disabled = false;
      document.querySelector("#massValue2").disabled = false;
      document.querySelector("#tensionValue").disabled = false;
    } else {
      box.style.marginLeft = `${position}px`;
      box1.style.marginBottom = `${position1}px`;
      line.style.width = `${horizontalLine}px`;
      line.style.height = `${verticalLine}px`;
    }
  }, 100 - time / 10);
}

function pauseSimulation() {
  clearInterval(interval);
  clearInterval(stopwatchInterval);
  document.querySelector("#btnStart").disabled = false;
  document.querySelector("#massValue").disabled = false;
  document.querySelector("#massValue2").disabled = false;
  document.querySelector("#tensionValue").disabled = false;
}

function restartSimulation() {
  clearInterval(interval);
  clearInterval(stopwatchInterval);
  box.style.marginLeft = "0";
  box1.style.marginBottom = "200px";
  line.style.width = "400px";
  line.style.height = "140px";
  document.querySelector("#stopwatch").innerHTML = "00:00:00";
  document.querySelector("#btnStart").disabled = false;
  document.querySelector("#massValue").disabled = false;
  document.querySelector("#massValue2").disabled = false;
  document.querySelector("#tensionValue").disabled = false;
}