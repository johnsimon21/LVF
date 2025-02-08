let car = document.querySelector(".car");
let initialPosition = parseInt(window.getComputedStyle(car).marginLeft);
let forward_arrow = document.querySelector(".forward-car");
let forward_letter = document.querySelector(".forward-letter");

forward_arrow.classList.add("go");
forward_letter.classList.add("go");

let interval = null;
let intervalStarted = false;
let currentPosition = 0;
let currentTime = 0;

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

  const mainContainer = document.querySelector(".main");
  const mainWidth = mainContainer.getBoundingClientRect().width;
  const carWidth = car.getBoundingClientRect().width;
  const maxPosition = mainWidth - carWidth; // Maximum position before stopping
  // Calculate velocity
  const velocityValue = (finalPosition - initialPosition) / totalTime;

  if (!intervalStarted && totalTime > 0) {
    interval = setInterval(() => {
      currentTime += 0.1; // Smaller time steps for smoother animation

      currentPosition = initialPosition + (velocityValue * currentTime);

      // Stop if the car reaches the limit
      if (currentPosition >= finalPosition) {
        currentPosition = finalPosition; // Set position to limit
        clearInterval(interval); // Stop movement
        intervalStarted = false;
        
      }

      // Update car position and UI elements
      car.style.marginLeft = `${currentPosition}px`;

      // Update display values
      document.querySelector("#positionValue").textContent = `${currentPosition.toFixed(1)} m`;
      document.querySelector("#initialPositionValue").textContent = ` ${initialPosition} m`;
      document.querySelector("#velocityValue").textContent = `v = ${velocityValue.toFixed(1)} m/s`;
      document.querySelector("#timeValue").textContent = `${totalTime.toFixed(1)} s`;

      updateChart(currentTime.toFixed(1), currentPosition.toFixed(1));

      if (currentTime >= totalTime) {
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
  document.querySelector("#timeValue").textContent = "Δt";
  document.querySelector("#initialPositionValue").innerHTML = "S<sub>o</sub>";
  document.querySelector("#positionValue").innerHTML = "S<sub>f</sub>";

  forward_arrow.classList.remove("back");
  forward_letter.classList.add("go");
  car.style.transform = "rotateY(0deg)";
  forward_arrow.classList.add("go");
  intervalStarted = false;

  // Resetar o gráfico
  positionChart.data.labels = [];
  positionChart.data.datasets[0].data = [];
  positionChart.update();

  // Reset current position and time
  currentPosition = 0;
  currentTime = 0;

}
