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
        let position = parseInt(window.getComputedStyle(car).marginLeft);
        let positionValue = parseInt(
          document.querySelector("#positionInput").value
        );
        let time = 0;
        let velocityValue = parseInt(
          document.querySelector("#velocityValue").value
        );

        if (!intervalStarted && velocityValue !== 0) {
          interval = setInterval(() => {
            time += 1;

            // if (position % positionValue === 0) {
            //   let timerDelay = 0;
            //   let delayInterval = setInterval(() => {
            //     timerDelay++;
            //     if (timerDelay === 10) {
            //       console.log(position % positionValue === 0);
            //       clearInterval(delayInterval);
            //       position += velocityValue;
            //     }
            //   }, 1000);
            // } else {
            // }
            position += velocityValue;

            if (position >= positionValue) {
              if (position > positionValue) {
                car.style.transfrom = `${positionValue}px`;
              } else {
                car.style.transfrom = `${position}px`;
              }
              clearInterval(interval);
            }

            if (velocityValue < 0) {
              // if (position >= 40) {
              //   position += (30 * 100) / position;
              // }

              car.style.transform = "rotateY(180deg)";
              forward_letter.classList.add("back");
            } else {
              forward_letter.classList.add("go");
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

            const finalPositionValue = velocityValue * time;

            document.querySelector(
              "#timeValue"
            ).textContent = `Tempo = ${time.toFixed(1)} (s)`;
            document.querySelector(
              "#initialPositionValue"
            ).textContent = `Posição Inicial = ${initialPosition} (m)`;
            document.querySelector(
              "#finalPositionValue"
            ).textContent = `Posição Final = ${finalPositionValue.toFixed(
              1
            )} (m)`;
            document.querySelector("#velocityInfo").textContent =
              velocityValue > 0
                ? "v > 0 (movimento progressivo)"
                : "v < 0 (movimento retrógrado)";

            updateChart(time.toFixed(1), finalPositionValue.toFixed(1)); // Atualiza o gráfico

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