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
  // Get input values correctly
  const initialPositionValue = parseInt(document.querySelector("#initialPositionValue").value) || 0;
  const initialVelocityValue = parseInt(document.querySelector("#initialVelocityValue").value) || 0;
  const accelerationValue = parseInt(document.querySelector("#acelerationValue").value) || 0;
  const totalTime = parseInt(document.querySelector("#timeInput").value) || 0;

  let position = initialPositionValue;
  let time = 0;

  if (!intervalStarted && totalTime > 0) {
    interval = setInterval(() => {
      time += 0.1;

      // Calculate position with proper values
      const finalPosition = initialPositionValue + 
                          (initialVelocityValue * time) + 
                          (0.5 * accelerationValue * time * time);
      
      position = finalPosition;
      
      // Update velocity
      const velocityValue = initialVelocityValue + (accelerationValue * time);

      // Update displays
      car.style.marginLeft = `${position}px`;
      document.querySelector("#timeValue").textContent = `${time.toFixed(1)}`;
      document.querySelector("#currentPosition").textContent = `x = ${position.toFixed(1)} m`;
      document.querySelector("#velocityInfo").textContent = `Velocidade final = ${velocityValue.toFixed(1)} (m/s)`;

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