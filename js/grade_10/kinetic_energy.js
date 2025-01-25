let car = document.querySelector(".car");
let forward_arrow = document.querySelector(".forward-car");
let forward_letter = document.querySelector(".forward-letter");

forward_arrow.classList.add("go");
forward_letter.classList.add("go");
let interval = null; // Variável para armazenar o intervalo
let intervalStarted = false;

function startSimulation() {
  let position = parseInt(window.getComputedStyle(car).marginLeft);
  document.querySelector("#btnPause");
  let time = 0;
  let velocityValue = parseInt(
    document.querySelector("#velocityValue").value
  );
  let massValue = parseInt(document.querySelector("#massValue").value);

  if (!intervalStarted) {
    interval = setInterval(() => {
      time++;
      position += velocityValue * massValue;

      if (velocityValue < 0) {
        car.style.transform = "rotateY(180deg)";
        forward_letter.classList.add("back");
        // forward_arrow.classList.remove("go");
        // forward_arrow.classList.add("back");
      } else {
        // forward_arrow.classList.remove("back");
        // forward_arrow.classList.add("go");
        forward_letter.classList.add("go");
        car.style.transform = "rotateY(0deg)";
      }

      const mainWidth = document.querySelector("main").offsetWidth;
      const carWidth = car.offsetWidth;

      if (position + carWidth >= mainWidth || position <= 0) {
        if (velocityValue > 0) {
          const lastPosition = position + carWidth - mainWidth;

          if (lastPosition >= 0) {
            car.style.marginLeft = `${mainWidth - carWidth}px`;
            clearInterval(interval);
          } else {
            clearInterval(interval);
          }
        } else {
          car.style.marginLeft = `${0}px`;
          clearInterval(interval);
        }
      } else {
        car.style.marginLeft = `${position}px`;
        if (position + carWidth === mainWidth) {
          clearInterval(interval);
        }
      }
      if (massValue >= 0) {
        const kineticEnergy =
          (velocityValue * velocityValue * massValue) / 2;
        intervalStarted = true;

        document.querySelector(
          "#kineticEnergyValue"
        ).textContent = `Energia Cinética = ${kineticEnergy} (J)`;
      }
      intervalStarted = true;
    }, 100);
  }
}

function pauseSimulation() {
  clearInterval(interval);
  intervalStarted = false;
}

function restartSimulation() {
  clearInterval(interval);
  car.style.marginLeft = "0px";

  document.querySelector(
    "#kineticEnergyValue"
  ).textContent = `Energia Cinética = 0 (m²/s)`;

  forward_arrow.classList.remove("back");
  forward_arrow.classList.add("go");
  forward_letter.classList.add("go");
  car.style.transform = "rotateY(0deg)";
  intervalStarted = false;
}