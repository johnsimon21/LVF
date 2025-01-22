var orbit = document.querySelector(".orbit");
      var trajectory = document.querySelector(".trajectory");
      var angularVelocity = document.querySelector("#angularVelocity");
      var frequency = document.querySelector("#frequency");
      var sattelite = document.querySelector("#sattelite");
      var btnStart = document.querySelector("#btnStart");
      var btnPause = document.querySelector("#btnPause");
      var btnRestart = document.querySelector("#btnRestart");
      var angularVelocityStick = document.querySelector(
        ".angular-velocity-stick"
      );
      var velocityStick = document.querySelector(".velocity-letter");

      var orbitRadius = orbit.offsetWidth / 2;
      var angle = 0;
      var completedTurns = 0;
      var frames = 0;
      var animationInterval = null;

      trajectory.style.top = "170px";

      let velocity = document.querySelector("#velocityValue");

      function startAnimation() {
        btnStart.disabled = true;
        if (btnPause.disabled) {
          btnPause.disabled = false;
        }
        // velocity.disabled = true;

        var velocityValue = parseInt(velocity.value)
          ? parseInt(velocity.value)
          : 0;
        const angularVelocityValue = velocityValue / orbitRadius;
        var speed = angularVelocityValue; // Velocidade de rotação em radianos por segundo
        if (speed < 0) {
          sattelite.style.transform = "rotateX(-180deg) rotate(-312deg)";
          velocityStick.classList.add("velocity-letter-rotate");
          angularVelocityStick.classList.add("angular-velocity-letter-rotate");
        } else {
          sattelite.style.transform = "rotate(230deg)";
          angularVelocityStick.classList.remove(
            "angular-velocity-letter-rotate"
          );
        }
        trajectory.style.left = "170px";
        const angleValue = (angle * 180) / Math.PI;
        trajectory.style.transform = "rotate(" + angleValue + "deg)";

        frames = 0;

        // Incrementar o contador de frames
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

        angle += speed;
      }

      function startSimulation() {
        if (animationInterval === null)
          animationInterval = setInterval(startAnimation, 100);
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

        if (animationInterval) {
          clearInterval(animationInterval); // Limpar o intervalo de animação, se existir
        }
      }