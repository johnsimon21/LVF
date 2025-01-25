let ball = document.querySelector(".ball");
let timeElement = document.querySelector(".timeValue");
let finalVelocityElement = document.querySelector(".finalVelocityValue");
let potentialEnergyElement = document.querySelector(
  ".potentialEnergyValue"
);
let kineticEnergyElement = document.querySelector(".kineticEnergyValue");
let mechanicEnergyElement = document.querySelector(
  ".mechanicEnergyValue"
);
let base = document.querySelector(".base");
let mass = document.querySelector("#ball-weight");
let ballHeight = document.querySelector("#ball-height");
let heightStick = document.querySelector(".height-stick");

let time = 0;
let timeValue = 0;
let interval = null;
let intervalStarted = false;

function updateBallHeight() {
  let heightValue = parseInt(
    document.querySelector("#ball-height").value
  );
  const maxHeight = 350;

  if (heightValue < 20) {
    heightValue = 20;
  } else if (heightValue - 20 >= maxHeight) {
    heightValue = maxHeight;
  }

  ball.style.bottom = `${heightValue}px`;
  getBallHeight();

  return heightValue;
}

ballHeight.addEventListener("input", () => {
  restartSimulation();
  updateBallHeight();
  updatePotencialEnergy();
});

function getBallHeight() {
  let ballRect = ball.getBoundingClientRect();
  let baseRect = base.getBoundingClientRect();

  // Altura da bola em relação ao topo da janela
  let ballTop = ballRect.top + ballRect.height / 2;
  // Altura da base em relação ao topo da janela
  let baseTop = baseRect.top + baseRect.height;

  // Altura da bola em relação à base
  let ballHeightToBase = baseTop - ballTop;

  heightStick.style.height = ballHeightToBase - 20 + "px";

  return ballHeightToBase;
}

getBallHeight();

let newHeightLess =
  parseInt(document.querySelector("#ball-weight").value) * 2;
let newHeight = updateBallHeight();

mass.addEventListener("input", () => {
  newHeightLess =
    parseInt(document.querySelector("#ball-weight").value) * 2;
  restartSimulation();

  updatePotencialEnergy();
});

function updatePotencialEnergy() {
  let potentialEnergyResult =
    parseInt(mass.value) * 9.8 * parseInt(ballHeight.value);

  if (newHeight === 20) {
    potentialEnergyResult = 0;
  }

  potentialEnergyElement.innerHTML = `Energia Potencial Ep = ${potentialEnergyResult.toFixed(
    1
  )} (J)`;
}

updatePotencialEnergy();

function startSimulation() {
  time = newHeightLess;
  let actualHeight = 0;
  if (!intervalStarted) {
    interval = setInterval(() => {
      time += 1;

      if (parseInt(mass.value) === 0) {
        clearInterval(interval);
        ball.classList.remove("dropping");
      }

      if (newHeight > 20) {
        newHeight -= time;
        if (newHeight < 20) {
          newHeight = 20;
          const finalVelocityResult = Math.pow(
            2 * 9.8 * (actualHeight += time),
            0.5
          ).toFixed(1);
          finalVelocityElement.innerHTML = `Velocidade = ${finalVelocityResult} (m/s)`;
          const potentialEnergyResult = parseInt(mass.value) * 9.8 * 0;
          potentialEnergyElement.innerHTML = `Energia Potencial Ep = ${potentialEnergyResult.toFixed(
            1
          )} (J)`;

          const kineicEnergyResult =
            (finalVelocityResult *
              finalVelocityResult *
              parseInt(mass.value)) /
            2;
          kineticEnergyElement.innerHTML = `Energia Cinética Ec = ${kineicEnergyResult.toFixed(
            1
          )} (J)`;

          const mechanicEnergyResult =
            potentialEnergyResult + kineicEnergyResult;
          mechanicEnergyElement.innerHTML = `Energia Mecânica Ec = ${mechanicEnergyResult.toFixed(
            1
          )} (J)`;
        }

        if (timeValue > 5) {
          ball.classList.add("dropping");
        }

        const finalVelocityResult = Math.pow(
          2 * 9.8 * (actualHeight += time),
          0.5
        ).toFixed(1);
        finalVelocityElement.innerHTML = `Velocidade = ${finalVelocityResult} (m/s)`;
        let potentialEnergyResult =
          parseInt(mass.value) * 9.8 * newHeight;

        if (newHeight === 20) {
          potentialEnergyResult = 0;
        }

        potentialEnergyElement.innerHTML = `Energia Potencial Ep = ${potentialEnergyResult.toFixed(
          1
        )} (J)`;

        const kineicEnergyResult =
          (finalVelocityResult *
            finalVelocityResult *
            parseInt(mass.value)) /
          2;
        kineticEnergyElement.innerHTML = `Energia Cinética Ec = ${kineicEnergyResult.toFixed(
          1
        )} (J)`;

        const mechanicEnergyResult =
          potentialEnergyResult + kineicEnergyResult;
        mechanicEnergyElement.innerHTML = `Energia Mecânica Ec = ${mechanicEnergyResult.toFixed(
          1
        )} (J)`;

        timeElement.innerHTML = `Tempo = ${timeValue++} (s)`;
        ball.style.bottom = `${newHeight}px`;
      } else {
        clearInterval(interval);
        ball.classList.remove("dropping");
      }

      intervalStarted = true;
    }, 100);
  }
}

function pauseSimulation() {
  clearInterval(interval);
  ball.classList.remove("dropping");
  intervalStarted = false;
}

function restartSimulation() {
  clearInterval(interval);
  ball.classList.remove("dropping");
  timeElement.innerHTML = `Tempo = 0 (s)`;
  finalVelocityElement.innerHTML = `Velocidade = 0 (m/s)`;
  potentialEnergyElement.innerHTML = `Energia Potencial = 0 (J)`;
  kineticEnergyElement.innerHTML = `Energia Cinética Ec = 0 (J)`;
  mechanicEnergyElement.innerHTML = `Energia Mecânica Em = 0 (J)`;
  time = 0;
  timeValue = 0;
  newHeight = updateBallHeight();
  updateBallHeight();
  intervalStarted = false;
}