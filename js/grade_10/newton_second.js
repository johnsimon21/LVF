const box = document.querySelector(".box");
const personGostraight = document.querySelector("#personGostraight");
const personGoBack = document.querySelector("#personGoBack");
let direction = document.querySelector(".direction");
let forceLine = document.querySelector(".forceDiretion");
let force = document.querySelector(".force");
let forceArrow = document.querySelector(".forceArrow");
forceLine.style.display = "none";
let frictionalForceLine = document.querySelector(".frictionalForceLine");

let interval = null; // Variável para armazenar o intervalo

function startSimulation() {
  let position = parseInt(window.getComputedStyle(box).marginLeft);
  document.querySelector("#btnPause");

  interval = setInterval(() => {
    let direction = document.querySelector(".direction");
    let forceLine = document.querySelector(".forceDiretion");
    let force = document.querySelector(".force");
    let forceArrow = document.querySelector(".forceArrow");

    const frictionalForceDirection = document.querySelector(
      ".frictionForceDirection"
    );

    let frictionalForce = parseInt(
      document.querySelector("#frictionalForceValue").value
    );
    let tensionForceValue = parseInt(
      document.querySelector("#tensionValue").value
    );
    let frictionalForceLine = document.querySelector(
      ".frictionalForceLine"
    );
    let mass = parseInt(document.querySelector("#massValue").value);
    let calculatingForce =
      parseInt(document.querySelector("#tensionValue").value) / mass;

    let tensionForce = calculatingForce - frictionalForce;

    document.querySelector("#acelerationValue").innerHTML =
      mass !== 0
        ? `Aceleração: ${tensionForce.toFixed(1)} m/s²`
        : "Aceleração: 0 m/s²";

    position += tensionForce;
    const mainWidth = document.querySelector("main").offsetWidth;
    const boxWidth = box.offsetWidth;
    if (position + boxWidth >= mainWidth || mass <= 0 || position <= 0) {
      clearInterval(interval);
    } else {
      forceLine.style.display = "block";

      if (frictionalForce === 0)
        frictionalForceLine.classList.add("d-none");

      if (tensionForceValue < 0) {
        personGostraight.style.display = "none";
        personGoBack.style.display = "block";

        direction.classList.add("goBackForce");
        forceLine.classList.add("goBackForceLine");
        force.classList.add("goBackForceLetter");
        forceArrow.classList.add("goBackForceArrow");

        if (frictionalForce !== 0) {
          frictionalForceDirection.classList.add(
            "backfrictionForceDirection"
          );
          frictionalForceLine.classList.remove("d-none");
          frictionalForceLine.classList.add("goBackLineFrictional");
        }
      } else {
        if (tensionForceValue > 0) {
          personGoBack.style.display = "none";
          personGostraight.style.display = "block";

          direction.classList.remove("goBackForce");
          forceLine.classList.remove("goBackForceLine");
          forceArrow.classList.remove("goBackForceArrow");
          force.classList.remove("goBackForceLetter");

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
        }
      }

      box.style.marginLeft = `${position}px`;
    }
  }, 100);
}

function pauseSimulation() {
  clearInterval(interval);
}

function restartSimulation() {
  clearInterval(interval);
  box.style.marginLeft = "0px";
  forceLine.style.display = "none";
  personGostraight.style.display = "none";
  personGoBack.style.display = "none";
  frictionalForceLine.classList.add("d-none");
}