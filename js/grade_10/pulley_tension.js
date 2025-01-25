const box = document.querySelector("#box");
const box1 = document.querySelector("#box1");
const line = document.querySelector("#line");

time = parseInt(document.querySelector("#massValue2").value);
let interval = null; // Variable to store interval

function startSimulation() {
  let position = parseInt(window.getComputedStyle(box).marginLeft);
  let position1 = parseInt(window.getComputedStyle(box1).marginBottom);
  let horizontalLine = parseInt(window.getComputedStyle(line).width);
  let verticalLine = parseInt(window.getComputedStyle(line).height);
  let lastResize = true;

  interval = setInterval(() => {
    let mass = parseInt(document.querySelector("#massValue").value);
    let mass1 = parseInt(document.querySelector("#massValue2").value);
    let auxPosition, auxPosition1;

    let tensionForce =
      mass1 * 10 > mass ? (mass1 * 10) / (mass + mass1) : 0;

    document.querySelector("#acelerationValue").innerHTML =
      mass !== 0 && mass1 !== 0
        ? `Aceleração: ${tensionForce.toFixed(1)} m/s²`
        : "Aceleração: 0 m/s²";

    const mainWidth = document.querySelector(".base").offsetWidth - 25;
    const boxWidth = box.offsetWidth;

    auxPosition = position + tensionForce;
    auxPosition1 = position1;
    auxPosition += tensionForce;

    if (auxPosition + boxWidth > mainWidth && lastResize) {
      // console.log(position);
      position = 225;
      position1 = -21;

      horizontalLine = 175;
      verticalLine = 365;

      console.log(position1);
      lastResize = false;
    } else {
      position += tensionForce;
      position1 -= tensionForce;

      horizontalLine -= tensionForce;
      verticalLine += tensionForce;
    }

    if (
      (position + boxWidth > mainWidth && !lastResize) ||
      mass <= 0 ||
      mass1 <= 0 ||
      position <= 0
    ) {
      clearInterval(interval);
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
}

function restartSimulation() {
  clearInterval(interval);
  box.style.marginLeft = "0";
  box1.style.marginBottom = "200px";
  line.style.width = "400px";
  line.style.height = "140px";
}