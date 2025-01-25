let lever = document.querySelector(".lever");
let appliedForceArrow = document.querySelector(".appliedForce-arrow");
let appliedForce = document.querySelector("#force");
let resultForce = document.querySelector(".resultForce");
let resultForceValue = parseInt(
  document.querySelector("#resultForceValue").value
);
let distanceAF = document.querySelector("#distanceAF");
let distanceRF = document.querySelector("#distanceRF");
let actualDistanceAF = parseInt(distanceAF.value);
let actualDistanceRF = parseInt(distanceRF.value);
let normalRotation = 19.5;
var distanceValueAF = 0;
var distanceValueRF = 0;

function updateAppliedForcePosition(distanceElement) {
  distanceValueAF = parseInt(distanceElement.value);
  const distanceNewValue = 299 - distanceValueAF;

  actualDistanceAF = distanceNewValue;
  if (distanceNewValue >= 299) {
    actualDistanceAF = 299;
  }
  if (distanceNewValue < 0) {
    actualDistanceAF = 0;
  }
  a = actualDistanceAF;
  appliedForceArrow.style.left = actualDistanceAF + "px";
}

function updateResultForcePosition(distanceElement) {
  distanceValueRF = parseInt(distanceElement.value);
  const distanceNewValue = 250 - distanceValueRF;
  actualDistanceRF = distanceNewValue;
  if (distanceNewValue >= 250) {
    actualDistanceRF = 250;
  }
  if (distanceNewValue < 0) {
    actualDistanceRF = 0;
  }
  resultForce.style.right = actualDistanceRF + "px";
}

function applyForce() {
  updateAppliedForcePosition(distanceAF);
  updateResultForcePosition(distanceRF);

  let appliedForceValue = parseInt(
    document.querySelector("#force").value
  );
  const dp = (distanceValueAF * -20) / 299;
  const dr = (distanceValueRF * -20) / 250;

  let torque = -(appliedForceValue - resultForceValue);

  if (torque < -normalRotation) {
    torque = -normalRotation;
  } else if (torque > normalRotation) {
    torque = normalRotation;
  }
  lever.style.transform = `rotateZ(${torque}deg)`;
}

distanceAF.addEventListener("change", () => {
  updateAppliedForcePosition(distanceAF);
  applyForce();
});

distanceRF.addEventListener("change", () => {
  updateResultForcePosition(distanceRF);
  applyForce();
});

appliedForce.addEventListener("change", () => applyForce());

function restartSimulation() {
  document.querySelector("#force").value = 0;
  applyForce();
}

lever.style.transform = `rotateZ(${normalRotation}deg)`;