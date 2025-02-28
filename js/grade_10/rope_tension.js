const box = document.querySelector(".box");

let interval = null; // Variável para armazenar o intervalo

function startSimulation() {
  let position = parseInt(window.getComputedStyle(box).marginLeft);
  document.querySelector("#btnPause");

  interval = setInterval(() => {
    const frictionalForceDirection = document.querySelector(
      ".frictionForceDirection"
    );
    let mass = parseInt(document.querySelector("#massValue").value);
    let frictionalForceLine = document.querySelector(
      ".frictionalForceLine"
    );
    let frictionalForce = parseInt(
      document.querySelector("#frictionalForceValue").value
    );
    let tensionForceValue = parseInt(
      document.querySelector("#tensionValue").value
    );
    let calculatingForce = tensionForceValue / mass;

    if (calculatingForce > frictionalForce) {
      let tensionForce = calculatingForce - frictionalForce;

      // document.querySelector("#acelerationValue").innerHTML =
      //   mass !== 0
      //     ? `Aceleração: ${tensionForce.toFixed(1)} m/s²`
      //     : "Aceleração: 0 m/s²";

      position += tensionForce;
      const mainWidth = document.querySelector("main").offsetWidth;
      const boxWidth = box.offsetWidth;
      if (position + boxWidth >= mainWidth || mass <= 0 || position <= 0) {
        clearInterval(interval);
      } else {
        if (frictionalForce === 0)
          frictionalForceLine.classList.add("d-none");

        if (
          tensionForce > 0 &&
          tensionForceValue > 0 &&
          frictionalForce > 0
        ) {
          if (frictionalForce !== 0) {
            frictionalForceDirection.classList.remove(
              "backfrictionForceDirection"
            );
            frictionalForceDirection.classList.add(
              "frictionForceDirection"
            );
            frictionalForceLine.classList.remove("d-none");
            frictionalForceLine.classList.remove("goBackLineFrictional");
          }
        } else {
          if (tensionForceValue < 0) {

            if (frictionalForce !== 0) {
              frictionalForceDirection.classList.add(
                "backfrictionForceDirection"
              );
              frictionalForceLine.classList.remove("d-none");
              frictionalForceLine.classList.add("goBackLineFrictional");
            }
          }
        }

        box.style.marginLeft = `${position}px`;
      }
    }
  }, 100);
}

function pauseSimulation() {
  clearInterval(interval); // Pausa o setInterval
}

function restartSimulation() {
  clearInterval(interval);
  box.style.marginLeft = "0px";
  box.classList.add("margin-left-0");
}