let car = document.querySelector(".car");
let initialPosition = parseInt(window.getComputedStyle(car).marginLeft);
let forward_arrow = document.querySelector(".forward-car");
let forward_letter = document.querySelector(".forward-letter");

forward_arrow.classList.add("go");
forward_letter.classList.add("go");

let interval = null;
let intervalStarted = false;

// Configuração inicial do gráfico
const ctxPosition = document.getElementById("positionChart").getContext("2d");
const ctxVelocity = document.getElementById("velocityChart").getContext("2d");
const ctxAcceleration = document.getElementById("accelerationChart").getContext("2d");

const positionChart = new Chart(ctxPosition, {
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
    animation: {
      duration: 0, // Disable animation for smoother updates
    },
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
const velocityChart = new Chart(ctxVelocity, {
  type: "line",
  data: {
    labels: [], // Labels do eixo x (tempo)
    datasets: [
      {
        label: "Velocidade (m/s)",
        data: [], // Dados do eixo y (posição)
        borderColor: "black",
        borderWidth: 1,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
     animation: {
      duration: 0, // Disable animation for smoother updates
    },
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
          text: "Velocidade (m/s)",
        },
      },
    },
  },
});
const accelerationChart = new Chart(ctxAcceleration, {
  type: "line",
  data: {
    labels: [], // Labels do eixo x (tempo)
    datasets: [
      {
        label: "Aceleração (m/s²)",
        data: [], // Dados do eixo y (posição)
        borderColor: "black",
        borderWidth: 1,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
     animation: {
      duration: 0, // Disable animation for smoother updates
    },
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
          text: "Aceleração (m/s²)",
        },
      },
    },
  },
});

function updateChart(time, position, velocity, acceleration) {
  positionChart.data.labels.push(time);
  positionChart.data.datasets[0].data.push(position);
  positionChart.update();

  velocityChart.data.labels.push(time);
  velocityChart.data.datasets[0].data.push(velocity);
  velocityChart.update();

  accelerationChart.data.labels.push(time);
  accelerationChart.data.datasets[0].data.push(acceleration);
  accelerationChart.update();
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
  const car = document.querySelector(".car");
  const mainContainer = document.querySelector(".main");

  const mainWidth = mainContainer.getBoundingClientRect().width;
  const carWidth = car.getBoundingClientRect().width;
  const maxPosition = mainWidth - carWidth; // Maximum position before stopping

  const initialPositionValue = parseInt(document.querySelector("#initialPositionValue").value) || 0;
  const initialVelocityValue = parseInt(document.querySelector("#initialVelocityValue").value) || 0;
  const accelerationValue = parseInt(document.querySelector("#acelerationValue").value) || 0;
  const totalTime = parseInt(document.querySelector("#timeInput").value) || 0;


  if (!intervalStarted && totalTime > 0) {
    interval = setInterval(() => {
      time += 0.1;

      const finalPosition = initialPositionValue +
        (initialVelocityValue * time) +
        (0.5 * accelerationValue * time * time);

      position = finalPosition;

      // Stop if the car reaches the limit
      if (position >= maxPosition) {
        position = maxPosition; // Set position to limit
        clearInterval(interval); // Stop movement
        intervalStarted = false;
      }

      // Update UI elements
      car.style.marginLeft = `${position}px`;
      document.querySelector(".timeValue").textContent = `${time.toFixed(1)}`;
      document.querySelector(".timeValue2").textContent = `${time.toFixed(1)}`;
      document.querySelector("#accelerationValue").textContent = `${accelerationValue.toFixed(1)}`;
      document.querySelector("#currentPosition").textContent = `x = ${position.toFixed(1)} m`;
      document.querySelector("#initialPositionDisplay").textContent = `${initialPositionValue.toFixed(1)}`;
      document.querySelector("#initialVelocityDisplay").textContent = `${initialVelocityValue.toFixed(1)} (m/s)`;

      updateChart(time.toFixed(1), position.toFixed(1), initialVelocityValue, accelerationValue.toFixed(1));

      if (time >= totalTime) {
        clearInterval(interval);
        intervalStarted = false;
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
  document.querySelector(".timeValue").innerHTML = 't';
  document.querySelector(".timeValue2").innerHTML = 't';
  document.querySelector("#accelerationValue").innerHTML = 'a';
  document.querySelector("#currentPosition").innerHTML = 'x = 0 m';
  document.querySelector("#initialPositionDisplay").innerHTML = 'x<sub>o</sub>';
  document.querySelector("#initialVelocityDisplay").innerHTML = 'v<sub>o</sub>';

  time = 0;
  position = 0

  car.style.transform = "rotateY(0deg)";
  intervalStarted = false;

  // Resetar o gráfico
  positionChart.data.labels = [];
  positionChart.data.datasets[0].data = [];
  positionChart.update();

  velocityChart.data.labels = [];
  velocityChart.data.datasets[0].data = [];
  velocityChart.update();
  
  accelerationChart.data.labels = [];
  accelerationChart.data.datasets[0].data = [];
  accelerationChart.update();
}