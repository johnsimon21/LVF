const spring = document.querySelectorAll(".circle-shild");
const deformationStick = document.querySelector(".deformationStick");
let deformationValue = document.querySelector(".deformationValue");
let springEnergyValue = document.querySelector(".springEnergyValue");
let energy;
const springWidth = 40;

function applyForce() {
  let springEnergyValue = document.querySelector(".springEnergyValue");

  let deformationValue = document.querySelector(".deformationValue");
  const force = parseInt(document.querySelector("#force").value);
  const springConst = parseInt(
    document.querySelector("#springConst").value
  );

  const fixedStick = document.querySelector(".fixedStick");
  const springStick = document.querySelector(".springStick");
  const fixedStickMargin = parseInt(
    window.getComputedStyle(fixedStick).left
  );
  const springStickMargin = parseInt(
    window.getComputedStyle(springStick).position
  );

  if (force > 0 && springConst >= 0) {
    const deformation =
      springConst === 0 ? 0 : springWidth - force / springConst;

    for (let i = 0; i < spring.length; i++) {
      spring[i].style.left = `${deformation >= 0 ? deformation : 0}px`;
    }

    document.querySelector(".arrow").style.transform = "rotateZ(180deg)";

    const stick1 = springStick.getBoundingClientRect().left;
    const stick2 = fixedStick.getBoundingClientRect().left;

    const distance = stick2 - stick1;
    deformationStick.style.width = `${distance}px`;
    deformationStick.style.right = `1px`;
    let valueOfDeformation = parseInt(
      ((distance - (distance * 70) / 100)).toFixed(0)
    );

    deformationValue.innerHTML = `Posição da deformação X = ${valueOfDeformation}cm`;
    energy = `Energia Potencial Elástica E(elas) = ${parseInt(
      (
        (valueOfDeformation * valueOfDeformation * springConst) /
        2
      ).toFixed(1)
    )} J`;

    if (distance >= 15) {
      deformationStick.style.color = "black";
    } else {
      deformationStick.style.color = "transparent";
    }
  } else if (force < 0) {
    const deformation =
      springConst === 0 ? 0 : springWidth - force / springConst;
    if (deformation > 70) {
      for (let i = 0; i < spring.length; i++) {
        spring[i].style.left = `70px`;
      }
    } else {
      for (let i = 0; i < spring.length; i++) {
        spring[i].style.left = `${deformation >= 0 ? deformation : 0}px`;
      }
    }

    document.querySelector(".arrow").style.transform = "rotateZ(180deg)";

    const stick1 = springStick.getBoundingClientRect().left;
    const stick2 = fixedStick.getBoundingClientRect().left;

    const distance = stick2 - stick1;
    deformationStick.style.width = `${distance}px`;
    deformationStick.style.right = `1px`;
    let valueOfDeformation = (distance - (distance * 70) / 100).toFixed(
      0
    );

    deformationValue.innerHTML = `Posição da deformação X = ${valueOfDeformation}cm`;
    energy = `Energia Potencial Elástica E(elas) = ${(
      (valueOfDeformation * valueOfDeformation * springConst) /
      2
    ).toFixed(1)} J`;

    if (distance >= 15) {
      deformationStick.style.color = "black";
    } else {
      deformationStick.style.color = "transparent";
    }
  }
}

function leftSpring() {
  for (let i = 0; i < spring.length; i++) {
    spring[i].style.left = `${springWidth}px`;
  }

  deformationStick.style.color = "transparent";
  deformationStick.style.width = "0";
  document.querySelector(".arrow").style.transform = "rotateZ(0)";
  springEnergyValue.innerHTML = energy;
}

function restartSimulation() {
  for (let i = 0; i < spring.length; i++) {
    spring[i].style.left = `${springWidth}px`;
  }

  document.querySelector(".arrow").style.transform = "rotateZ(0)";
  deformationStick.style.width = "0";

  deformationValue.innerHTML = "Posição da deformação X = 0 m";
  springEnergyValue.innerHTML =
    " Energia Potencial Elástica E(elas) = 0 J";
}