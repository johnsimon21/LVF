let animacaoId;
let pausado = false;
let alturaGlobal;
let velocidadeGlobal;
let tempoAnimacao = 0;
let tempoTotal, distanciaTotal, escala;
let cannonBase = document.querySelector(".cannon-base");

function resizeCannonBase(baseHeightValue) {
  cannonBase.style.height = parseInt(baseHeightValue) + "px";
}

document
  .getElementById("startSimulation")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    alturaGlobal = parseFloat(document.getElementById("altura").value);
    velocidadeGlobal = parseFloat(
      document.getElementById("velocidade").value
    );

    iniciarSimulacao(alturaGlobal, velocidadeGlobal);
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
    iniciarSimulacao(alturaGlobal, velocidadeGlobal);
  });

async function movePlane(velocidade) {
  let position = -130;
  let leftObject = false;
  let interval = setInterval(() => {
    if (position <= 300) {
      console.log(position);
      let plane = document.querySelector(".plane");
      position += velocidade;
      plane.style.left = position + "px";
    } else {
      clearInterval(interval);
    }

    if (position >= 130) {
    }
  }, 100);
}

function iniciarSimulacao(altura, velocidade) {
  console.log("Java Simon")
  const container = document.getElementById("animationContainer");
  container.innerHTML = ""; // Limpar a simulação anterior
  const g = 9.8; // Aceleração da gravidade (m/s²)
  tempoTotal = Math.sqrt((2 * altura) / g);
  distanciaTotal = velocidade * tempoTotal;

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Calcula a escala para ajustar ao tamanho do contêiner
  const escalaX = containerWidth / (distanciaTotal + 2); // 2 pixels adicionais para margem
  const escalaY = containerHeight / (altura + 2); // 2 pixels adicionais para margem
  escala = Math.min(escalaX, escalaY) * 0.8; // Ajuste de escala para manter proporções e margem

  // Desenhar a linha horizontal que mostra a distância final
  const linha = document.createElement("div");
  linha.className = "linha";
  linha.style.width = `${distanciaTotal * escala}px`;
  const baseHeightValue = altura * escala + 50;
  linha.style.top = `${baseHeightValue}px`;
  container.appendChild(linha);

  resizeCannonBase(baseHeightValue - 79);

  // Desenhar o objeto inicial
  const objeto = document.createElement("div");
  objeto.className = "object";
  objeto.style.transform = `translate(0px, 0px)`;
  container.appendChild(objeto);

  atualizarSimulacao();
}

function atualizarSimulacao() {
  if (pausado) return;

  const container = document.getElementById("animationContainer");
  const objeto = container.querySelector(".object");
  const g = 9.8; // Aceleração da gravidade (m/s²)
  const intervalo = 0.02; // Intervalo de tempo para atualização (em segundos)

  const x = velocidadeGlobal * tempoAnimacao;
  const y = (g * Math.pow(tempoAnimacao, 2)) / 2;

  // Desenhar ponto da trajetória
  const ponto = document.createElement("div");
  ponto.className = "ponto";
  ponto.style.transform = `translate(${x * escala}px, ${y * escala}px)`;
  container.appendChild(ponto);

  // Atualizar posição do objeto
  objeto.style.transform = `translate(${x * escala}px, ${y * escala}px)`;

  // Atualizar valores de tempo e movimento
  document.getElementById("tempo").textContent = tempoAnimacao.toFixed(2);
  document.getElementById("movimentoHorizontal").textContent =
    x.toFixed(2);
  document.getElementById("movimentoVertical").textContent = y.toFixed(2);

  tempoAnimacao += intervalo;
  if (tempoAnimacao <= tempoTotal) {
    animacaoId = requestAnimationFrame(atualizarSimulacao);
  } else {
    // Garantir que o objeto pare na posição final
    objeto.style.transform = `translate(${distanciaTotal * escala}px, ${
      alturaGlobal * escala
    }px)`;
  }
}