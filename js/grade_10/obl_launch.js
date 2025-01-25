let animacaoId;
let pausado = false;
let alturaGlobal;
let velocidadeGlobal;
let anguloGlobal;
let tempoAnimacao = 0;
let alturaMaxima = 0;
let maxHightDisplayed;
let transformValueMAxHight;
let maxHightValue = 0;
let lastPositionY = 0;
let selectedAngle = parseInt(document.getElementById("angle").value);
document.getElementById("angle").addEventListener("change", function (e) {
  e.preventDefault();
  selectedAngle = parseInt(this.value);
  const cannon = document.querySelector(".cannon");
  if (selectedAngle === 30) {
    cannon.classList.remove("cannon-45deg");
    cannon.classList.remove("cannon-60deg");
    cannon.classList.remove("cannon-90deg");
    cannon.classList.add("cannon-30deg");
  }

  if (selectedAngle === 45) {
    cannon.classList.remove("cannon-30deg");
    cannon.classList.remove("cannon-60deg");
    cannon.classList.remove("cannon-90deg");
    cannon.classList.add("cannon-45deg");
  }
  if (selectedAngle === 60) {
    cannon.classList.remove("cannon-30deg");
    cannon.classList.remove("cannon-45deg");
    cannon.classList.remove("cannon-90deg");
    cannon.classList.add("cannon-60deg");
  }
});

let tempoTotal, distanciaTotal, escala;
const g = 9.8; // Aceleração da gravidade (m/s²)

document
  .getElementById("startSimulation")
  .addEventListener("click", function (event) {
    event.preventDefault();
    alturaGlobal = parseFloat(document.getElementById("altura").value);
    velocidadeGlobal = parseFloat(
      document.getElementById("velocidade").value
    );
    anguloGlobal = selectedAngle * (Math.PI / 180); // Converter para radianos
    iniciarSimulacao(alturaGlobal, velocidadeGlobal, anguloGlobal);
    document.getElementById("pauseButton").disabled = false;
    document.getElementById("restartButton").disabled = false;
  });

document
  .getElementById("pauseButton")
  .addEventListener("click", function () {
    pausado = !pausado;
    if (pausado) {
      this.textContent = "Continuar";
      cancelAnimationFrame(animacaoId);
    } else {
      this.textContent = "Pausar";
      atualizarSimulacao();
    }
  });

document
  .getElementById("restartButton")
  .addEventListener("click", function () {
    pausado = false;
    tempoAnimacao = 0;
    document.getElementById("pauseButton").textContent = "Pausar";
    iniciarSimulacao(alturaGlobal, velocidadeGlobal, anguloGlobal);
  });

function displayMaxHightLine() {
  const linhaVertical = document.createElement("div");
  linhaVertical.className = "linhaVertical";
  linhaVertical.style.height = `${maxHightValue}px`;
  linhaVertical.style.transform = transformValueMAxHight;
  const container = document.getElementById("animationContainer");

  container.appendChild(linhaVertical);
}

function iniciarSimulacao(altura, velocidade, angulo) {
  const container = document.getElementById("animationContainer");
  container.innerHTML = ""; // Limpar a simulação anterior
  const v0x = velocidade * Math.cos(angulo);
  const v0y = velocidade * Math.sin(angulo);
  maxHightDisplayed = false;

  tempoTotal = (v0y + Math.sqrt(v0y * v0y + 2 * g * altura)) / g;
  distanciaTotal = v0x * tempoTotal;

  // Altura máxima atingida
  alturaMaxima = altura + (v0y * v0y) / (2 * g);

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Calcula a escala para ajustar ao tamanho do contêiner
  const escalaX = containerWidth / (distanciaTotal + 2); // 2 pixels adicionais para margem
  const escalaY = containerHeight / (alturaMaxima + 2); // 2 pixels adicionais para margem
  escala = Math.min(escalaX, escalaY) * 0.8; // Ajuste de escala para manter proporções e margem

  // Desenhar a linha horizontal que mostra a distância final
  const linha = document.createElement("div");
  linha.className = "linha";
  linha.style.width = `${distanciaTotal * escala}px`;
  linha.style.top = `${containerHeight - 2}px`; // Linha no final do contêiner
  container.appendChild(linha);

  // Desenhar o objeto inicial
  const objeto = document.createElement("div");
  objeto.className = "object";
  objeto.style.transform = `translate(0px, ${containerHeight - altura * escala
    }px)`;
  container.appendChild(objeto);

  tempoAnimacao = 0;
  atualizarSimulacao();
}

const container = document.getElementById("animationContainer");
function atualizarSimulacao() {
  if (pausado) return;

  const objeto = container.querySelector(".object");
  const intervalo = 0.02; // Intervalo de tempo para atualização (em segundos)

  const v0x = velocidadeGlobal * Math.cos(anguloGlobal);
  const v0y = velocidadeGlobal * Math.sin(anguloGlobal);

  const x = v0x * tempoAnimacao;
  const y =
    alturaGlobal +
    v0y * tempoAnimacao -
    0.5 * g * Math.pow(tempoAnimacao, 2);

  // Parar no ponto final
  if (tempoAnimacao > tempoTotal) {
    objeto.style.transform = `translate(${distanciaTotal * escala - 10
      }px, ${container.clientHeight - 15}px)`;
    document.getElementById("tempo").textContent = tempoTotal.toFixed(2);
    document.getElementById("movimentoHorizontal").textContent =
      distanciaTotal.toFixed(2);
    document.getElementById(
      "alturaMaxima"
    ).textContent = `${alturaMaxima.toFixed(2)} m`;
    document.getElementById("movimentoVertical").textContent = "0.00";
    displayMaxHightLine();
    return;
  }

  // Desenhar ponto da trajetória
  const ponto = document.createElement("div");
  ponto.className = "ponto";
  ponto.style.transform = `translate(${x * escala}px, ${container.clientHeight - y * escala
    }px)`;
  container.appendChild(ponto);

  if (y.toFixed(2) === alturaMaxima.toFixed(2) && !maxHightDisplayed) {
    transformValueMAxHight = `translate(${x * escala}px, ${container.clientHeight - y * escala
      }px)`;
    maxHightValue = alturaMaxima * escala;

    maxHightDisplayed = true;
  } else {
    if (y > lastPositionY) {
      lastPositionY = y;

      transformValueMAxHight = `translate(${x * escala}px, ${container.clientHeight - y * escala
        }px)`;
      maxHightValue = alturaMaxima * escala;
    }
  }

  // Atualizar posição do objeto
  objeto.style.transform = `translate(${x * escala}px, ${container.clientHeight - y * escala
    }px)`;

  // Atualizar valores de tempo e movimento
  document.getElementById("tempo").textContent = tempoAnimacao.toFixed(2);
  document.getElementById("movimentoHorizontal").textContent =
    x.toFixed(2);
  document.getElementById(
    "alturaMaxima"
  ).textContent = `${alturaMaxima.toFixed(2)} m`;
  document.getElementById("movimentoVertical").textContent = y.toFixed(2);

  tempoAnimacao += intervalo;
  animacaoId = requestAnimationFrame(atualizarSimulacao);
}