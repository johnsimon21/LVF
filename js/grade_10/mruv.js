let car = document.querySelector(".car");
let initialPosition = parseInt(window.getComputedStyle(car).marginLeft);
let forward_arrow = document.querySelector(".forward-car");
let forward_letter = document.querySelector(".forward-letter");

forward_arrow.classList.add("go");
forward_letter.classList.add("go");

let interval = null;
let intervalStarted = false;

// Configuração inicial do gráfico
const ctx = document.getElementById("positionChart").getContext("2d");
const positionChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // Labels do eixo x (tempo)
    datasets: [
      {
        label: "Posição (m)",
        data: [], // Dados do eixo y (posição)
        borderColor: "black",
        borderWidth: 1,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Tempo (s)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Posição (m)",
        },
      },
    },
  },
});

function updateChart(time, position) {
  positionChart.data.labels.push(time);
  positionChart.data.datasets[0].data.push(position);
  positionChart.update();
}
let initialVelocityValue = parseInt(
  document.querySelector("#initialVelocityValue").value
);
let initialPositionValue = parseInt(
  document.querySelector("#initialPositionValue").value
);

let position = parseInt(window.getComputedStyle(car).marginLeft);
let time = 0;
function startSimulation() {
  if (!intervalStarted) {
    interval = setInterval(() => {
      let acelerationValue = parseInt(
        document.querySelector("#acelerationValue").value
      );
      time++;
      const finalPosition =
        initialPosition +
        initialVelocityValue * time +
        (acelerationValue * time * time) / 2;
      position += finalPosition * 0.5;
      const velocityValue =
        initialVelocityValue + acelerationValue * time;

      if (velocityValue < 0) {
        // forward_arrow.classList.remove("go");
        // forward_arrow.classList.add("back");
        car.style.transform = "rotateY(180deg)";
      } else {
        // forward_arrow.classList.remove("back");
        // forward_arrow.classList.add("go");
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

      document.querySelector(
        "#timeValue"
      ).textContent = `Tempo = ${time} (s)`;
      intervalStarted = true;

      document.querySelector(
        "#finalPositionValue"
      ).textContent = `Posição Final = ${position} (m)`;

      document.querySelector(
        "#velocityInfo"
      ).textContent = `Velocidade final = ${velocityValue} (m/s)`;

      updateChart(time, finalPosition.toFixed(1)); // Atualiza o gráfico

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
  document.querySelector("#timeValue").textContent = `Tempo = ${0} (s)`;
  position = parseInt(window.getComputedStyle(car).marginLeft);
  initialPositionValue = parseInt(
    document.querySelector("#initialPositionValue").value
  );
  document.querySelector(
    "#finalPositionValue"
  ).textContent = `Posição Final = ${0} (m)`;
  document.querySelector(
    "#velocityInfo"
  ).textContent = `Velocidade final = 0 (m/s)`;

  time = 0;

  car.style.transform = "rotateY(0deg)";
  intervalStarted = false;

  // Resetar o gráfico
  positionChart.data.labels = [];
  positionChart.data.datasets[0].data = [];
  positionChart.update();
}