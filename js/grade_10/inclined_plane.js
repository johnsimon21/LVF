let box = document.querySelector(".box");
var btnStart = document.querySelector("#btnStart");
var btnPause = document.querySelector("#btnPause");
var btnRestart = document.querySelector("#btnRestart");

let selectedAngle = parseInt(document.getElementById("angle").value);
document.getElementById("angle").addEventListener("change", function (e) {
  e.preventDefault();
  restartSimulation();
  selectedAngle = parseInt(this.value);
  const plane = document.querySelector(".plane");
  const planeBase = document.querySelector(".plane-base");
  if (selectedAngle === 30) {
    plane.classList.remove("plane-45deg");
    planeBase.classList.remove("plane-base-45deg");
    plane.classList.remove("plane-60deg");
    planeBase.classList.remove("plane-base-60deg");
    plane.classList.add("plane-30deg");
    planeBase.classList.add("plane-base-30deg");
  }
  if (selectedAngle === 45) {
    plane.classList.remove("plane-30deg");
    planeBase.classList.remove("plane-base-30deg");
    plane.classList.remove("plane-60deg");
    planeBase.classList.remove("plane-base-60deg");
    plane.classList.add("plane-45deg");
    planeBase.classList.add("plane-base-45deg");
  }
  if (selectedAngle === 60) {
    plane.classList.remove("plane-30deg");
    planeBase.classList.remove("plane-base-30deg");
    plane.classList.remove("plane-45deg");
    planeBase.classList.remove("plane-base-45deg");
    plane.classList.add("plane-60deg");
    planeBase.classList.add("plane-base-60deg");
  }
});

let interval = null;
let intervalStarted = false;
let position = 0;
let boxPosition = 0;

function startSimulation() {
  btnStart.disabled = true;
  if (btnPause.disabled) {
    btnPause.disabled = false;
  }

  if (!intervalStarted) {
    interval = setInterval(() => {
      let frictionalForceValue = parseInt(
        document.querySelector("#frictionalForce").value
      );
      // Calculate the acceleration based on the angle
      let gravity = 9.8;
      let angleInRadians = selectedAngle * (Math.PI / 180);
      let acceleration = gravity * Math.sin(angleInRadians);

      // Adjust the increment based on acceleration and friction
      const incrementer = acceleration - frictionalForceValue;
      boxPosition += incrementer;
      position = boxPosition;

      // Determine the maximum position based on the selected angle
      let maxPosition = 0;
      if (selectedAngle === 30) {
        position += 1;
        maxPosition = 425;
      } else if (selectedAngle === 45) {
        position += 4;
        maxPosition = 445;
      } else if (selectedAngle === 60) {
        position += 6;
        maxPosition = 478;
      } 

      if (position >= 0 && incrementer > 0) {
        if (position > maxPosition) {
          box.style.left = `${maxPosition}px`;
          clearInterval(interval);
        } else {
          box.style.left = `${position}px`;
        }
      } else {
        clearInterval(interval);
      }
    }, 100);
  }
}

function pauseSimulation() {
  clearInterval(interval);
  btnPause.disabled = true;
  btnStart.disabled = false;
  intervalStarted = false;
}

function restartSimulation() {
  clearInterval(interval);
  box.style.left = "0px";
  console.log("Java Simon Script");

  position = 0;
  boxPosition = 0;

  btnStart.disabled = false;
  btnPause.disabled = true;
  intervalStarted = false;
}