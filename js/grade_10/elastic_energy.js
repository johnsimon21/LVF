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
  const springConst = parseInt(document.querySelector("#springConst").value);
  const manWhoPushes = document.querySelector(".man-who-pushes");
  
  // Show the man image
  manWhoPushes.style.display = "block";

  // Calculate final deformation
  const finalDeformation = springConst === 0 ? 0 : springWidth - force / springConst;
  const currentDeformation = parseInt(spring[0].style.left) || springWidth;
  
  // Animate spring compression
  const animationDuration = 2000; // 1 second
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);
    
    const currentPos = springWidth - (springWidth - finalDeformation) * progress;
    
    for (let i = 0; i < spring.length; i++) {
      spring[i].style.left = `${currentPos >= 0 ? currentPos : 0}px`;
    }

    // Update measurements and arrows
    updateMeasurements();

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  function updateMeasurements() {
    const stick1 = document.querySelector(".springStick").getBoundingClientRect().left;
    const stick2 = document.querySelector(".fixedStick").getBoundingClientRect().left;
    const distance = stick2 - stick1;
    
    deformationStick.style.width = `${distance}px`;
    deformationStick.style.right = "1px";
    
    let valueOfDeformation = parseInt(((distance - (distance * 70) / 100)).toFixed(0));
    deformationValue.innerHTML = `Posição da deformação X = ${valueOfDeformation}cm`;
    
    energy = `Energia Potencial Elástica E(elas) = ${parseInt(
      ((valueOfDeformation * valueOfDeformation * springConst) / 2).toFixed(1)
    )} J`;

    deformationStick.style.color = distance >= 15 ? "black" : "transparent";
    document.querySelector(".arrow").style.transform = "rotateZ(180deg)";
  }

  if (force !== 0 && springConst >= 0) {
    requestAnimationFrame(animate);
  }
}


function leftSpring() {
  const manWhoPushes = document.querySelector(".man-who-pushes");
  manWhoPushes.style.display = "none";
  
  for (let i = 0; i < spring.length; i++) {
    spring[i].style.left = `${springWidth}px`;
  }

  deformationStick.style.color = "transparent";
  deformationStick.style.width = "0";
  document.querySelector(".arrow").style.transform = "rotateZ(0)";
  springEnergyValue.innerHTML = energy;
}

function restartSimulation() {
  const manWhoPushes = document.querySelector(".man-who-pushes");
  manWhoPushes.style.display = "none";
  
  for (let i = 0; i < spring.length; i++) {
    spring[i].style.left = `${springWidth}px`;
  }

  document.querySelector(".arrow").style.transform = "rotateZ(0)";
  deformationStick.style.width = "0";

  deformationValue.innerHTML = "Posição da deformação X = 0 m";
  springEnergyValue.innerHTML = "Energia Potencial Elástica E(elas) = 0 J";
}
