let ball = document.querySelector(".ball");
let timeElement = document.querySelector(".timeValue");
let finalVelocityElement = document.querySelector(".finalVelocityValue");
let potentialEnergyElement = document.querySelector(
  ".potentialEnergyValue"
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
console.log(heightValue)
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
          finalVelocityElement.innerHTML = `Velocidade = ${finalVelocityElement} (m/s)`;
          const potentialEnergyResult = parseInt(mass.value) * 9.8 * 0;
          potentialEnergyElement.innerHTML = `Energia Potencial Ep = ${potentialEnergyResult.toFixed(
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
  time = 0;
  timeValue = 0;
  newHeight = updateBallHeight();
  updateBallHeight();
  intervalStarted = false;
}


// Draggable ruler
function draggableGraphic() {
  var draggableElement = document.getElementById("ruler");

  draggableElement.onmousedown = function (event) {

    // Previne o comportamento padrão do navegador
    event.preventDefault();

    // Obtém a posição inicial do cursor
    let shiftX = event.clientX - draggableElement.getBoundingClientRect().left;
    let shiftY = event.clientY - draggableElement.getBoundingClientRect().top;

    // Mova o elemento para as novas coordenadas do cursor
    function moveAt(pageX, pageY) {
      draggableElement.style.left = pageX - shiftX + 'px';
      draggableElement.style.top = pageY - shiftY + 'px';
    }

    // Movemos o elemento para a posição inicial do cursor
    moveAt(event.pageX, event.pageY);

    // Move o elemento quando o mouse se move
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // Adiciona o ouvinte de eventos de movimento do mouse
    document.addEventListener('mousemove', onMouseMove);

    // Solta o elemento quando o botão do mouse é liberado
    draggableElement.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      draggableElement.onmouseup = null;
    };
  };

  // Previne a ação padrão do arrastar e soltar do navegador
  draggableElement.ondragstart = function () {
    return false;
  };
}

draggableGraphic();

function generateMarkings() {
  const markingsContainer = document.getElementById("markings");
  for (let i = 0; i < 60; i++) {
      let mark = document.createElement("div");
      mark.classList.add("mark");
      markingsContainer.appendChild(mark);
  }
}
generateMarkings();

function draggableRuler() {
  const ruler = document.getElementById("ruler");
  const container = document.querySelector(".simulation-content");
  const base = document.querySelector(".base");
  let isDragging = false;
  let startX, startY;
  let startLeft, startTop;

  ruler.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = ruler.offsetLeft;
    startTop = ruler.offsetTop;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    
    let newLeft = startLeft + (e.clientX - startX);
    let newTop = startTop + (e.clientY - startY);
    
    // Get container boundaries
    let maxLeft = container.clientWidth - ruler.clientWidth;
    let maxTop = container.clientHeight - ruler.clientHeight - base.clientHeight;
    
    // Apply constraints
    ruler.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
    ruler.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}

draggableRuler()