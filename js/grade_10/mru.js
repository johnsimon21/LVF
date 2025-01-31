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

let verifier = 0;

function startSimulation() {
  const initialPosition = parseInt(document.querySelector("#initialPositionInput").value);
  const finalPosition = parseInt(document.querySelector("#finalPositionInput").value);
  const totalTime = parseInt(document.querySelector("#timeInput").value);

  // Calculate velocity
  const velocityValue = (finalPosition - initialPosition) / totalTime;

  let position = initialPosition;
  let time = 0;

  if (!intervalStarted && totalTime > 0) {
    interval = setInterval(() => {
      time += 0.1; // Smaller time steps for smoother animation

      position = initialPosition + (velocityValue * time);

      // Update car position and UI elements
      car.style.marginLeft = `${position}px`;

      // Update display values
      document.querySelector("#positionValue").textContent = `${position.toFixed(1)} m`;
      document.querySelector("#initialPositionValue").textContent = ` ${initialPosition} m`;
      document.querySelector("#velocityValue").textContent = `v = ${velocityValue.toFixed(1)} m/s`;
      document.querySelector("#timeValue").textContent = `${time.toFixed(1)} s`;

      updateChart(time.toFixed(1), position.toFixed(1));

      if (time >= totalTime) {
        clearInterval(interval);
      }
    }, 100);

    intervalStarted = true;
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
  document.querySelector(
    "#initialPositionValue"
  ).textContent = `Posição Inicial = ${initialPosition} (m)`;
  document.querySelector(
    "#finalPositionValue"
  ).textContent = `Posição Final = ${0} (m)`;
  document.querySelector("#velocityInfo").textContent =
    "v = 0 (velocidade nula)";

  forward_arrow.classList.remove("back");
  forward_letter.classList.add("go");
  car.style.transform = "rotateY(0deg)";
  forward_arrow.classList.add("go");
  intervalStarted = false;

  // Resetar o gráfico
  positionChart.data.labels = [];
  positionChart.data.datasets[0].data = [];
  positionChart.update();
}