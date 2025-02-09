var orbit = document.querySelector(".orbit");
var trajectory = document.querySelector(".trajectory");
var angularVelocity = document.querySelector("#angularVelocity");
var sattelite = document.querySelector("#sattelite");
var frequency = document.querySelector("#frequency");
var timeElement = document.querySelector("#time");
var btnStart = document.querySelector("#btnStart");
var btnPause = document.querySelector("#btnPause");
var btnRestart = document.querySelector("#btnRestart");
var angularVelocityStick = document.querySelector(
  ".angular-velocity-stick"
);
var acelerationStick = document.querySelector(".aceleration-letter");
// let initialPositionValue = parseInt(
//   document.querySelector("#initialPositionValue").value
// );

var orbitRadius = orbit.offsetWidth / 2;
var angle = 0;
var animationId;
var completedTurns = 0;
var frames = 0;
var time = 0;
var position = 0;
var animationInterval = null;


function startAnimation() {
  let initialVelocity = document.querySelector("#initialVelocityValue");
  let acelerationValue = parseInt(
    document.querySelector("#acelerationValue").value
  );

  btnStart.disabled = true;
  if (btnPause.disabled) {
    btnPause.disabled = false;
  }

  var initialVelocityValue = parseInt(initialVelocity.value)
    ? parseInt(initialVelocity.value)
    : 0;

  const finalPosition =
    initialVelocityValue * time + (acelerationValue * time * time) / 2;
  position = finalPosition * 0.5;

  const angularVelocityValue =
    (initialVelocityValue + acelerationValue) / orbitRadius;
  var speed = angularVelocityValue;
  if (speed < 0) {
    sattelite.style.transform = "rotateX(-180deg) rotate(-312deg)";
    acelerationStick.classList.add("velocity-letter-rotate");
    angularVelocityStick.classList.add("angular-velocity-letter-rotate");
  } else {
    sattelite.style.transform = "rotate(230deg)";
    angularVelocityStick.classList.remove(
      "angular-velocity-letter-rotate"
    );
  }
  const angleValue = (angle * 180) / Math.PI;
  trajectory.style.transform = "rotate(" + angleValue + "deg)";
  frames = 0;
  frames++;

  // Verificar se uma volta completa foi feita
  if (angle >= 2 * Math.PI) {
    // Incrementar o contador de voltas completas
    completedTurns++;
    // Reduzir o ângulo para garantir que ele permaneça dentro do intervalo de 0 a 2*pi
    angle -= 2 * Math.PI;
  }

  // Calcular o tempo decorrido em segundos
  var elapsedTime = frames / 60; // Assumindo 60 FPS

  // Calcular a frequência (número de voltas completas por segundo)
  var frequencyValue = completedTurns / elapsedTime;

  // Atualizar o texto com a frequência
  frequency.innerHTML = `(Frequência): f = ${
    Math.floor(frequencyValue * 100) / 100
  } Hz`;
  angularVelocity.innerHTML = `(velocidade Angular) ω = ${angularVelocityValue.toFixed(
    2
  )} (rad/s)`;
  timeElement.innerHTML = `(Tempo) t = ${time++} (s)`;

  angle += speed;

  return animationId;
}

function startSimulation() {
  animationInterval = setInterval(startAnimation, 100); // Executar a animação a cada 1 segundo
}

function pauseSimulation() {
  btnPause.disabled = true;
  btnStart.disabled = false;
  clearInterval(animationInterval); // Limpar o intervalo de animação
}

function restartSimulation() {
  btnStart.disabled = false;
  btnPause.disabled = false;
  angle = 0;
  completedTurns = 0;
  time = 0;

  if (animationInterval) {
    clearInterval(animationInterval); // Limpar o intervalo de animação, se existir
  }

  startSimulation();
}