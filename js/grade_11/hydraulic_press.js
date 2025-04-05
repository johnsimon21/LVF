document.addEventListener('DOMContentLoaded', function () {
    const massInputA = document.getElementById('mass-input-a');
    const massValueA = document.getElementById('mass-value-a');
    const vaseLeftMiddle = document.getElementById('vase-left-middle');
    const vaseRightMiddle = document.getElementById('vase-right-middle');
    const startSimulation = document.getElementById('start-simulation');
    const resetSimulation = document.getElementById('reset-simulation');
    const pressureTube = document.querySelector('.pressure');

    let interval = null;
    let bubbleInterval = null;
    let initialMass = 5;
    let currentMass = initialMass;
    let previousMass = initialMass;
    let flowDirection = 'ltr'; // Default flow direction (left to right)

    // Setup mass input range
    massInputA.min = 1;
    massInputA.max = 10;
    massInputA.value = initialMass;
    massInputA.step = 1;

    // Set initial heights
    vaseLeftMiddle.style.height = `50%`;
    vaseRightMiddle.style.height = `50%`;

    // Handle mass input change
    massInputA.addEventListener('input', function () {
        const massValue = parseFloat(this.value).toFixed(2);
        massValueA.textContent = `${massValue} kg`;
        previousMass = currentMass;
        currentMass = parseFloat(massValue);

        // Determine flow direction based on mass change
        flowDirection = currentMass < previousMass ? 'rtl' : 'ltr';
        
        updateHydraulicPressCalculations();
    });

    // Function to create bubbles with direction
    function createBubbles() {
        if (!bubbleInterval) {
            bubbleInterval = setInterval(() => {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                
                // Random size between 3-8px
                const size = Math.random() * 5 + 3;
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                
                // Position based on flow direction
                if (flowDirection === 'ltr') {
                    // Left to right flow (default)
                    bubble.style.left = '10%';
                    bubble.style.animation = 'bubbleFloatLTR 3s linear infinite';
                } else {
                    // Right to left flow
                    bubble.style.right = '10%';
                    bubble.style.animation = 'bubbleFloatRTL 3s linear infinite';
                }
                
                bubble.style.bottom = '0';
                pressureTube.appendChild(bubble);
                
                // Remove bubble after animation completes
                setTimeout(() => {
                    if (bubble && bubble.parentNode) {
                        bubble.parentNode.removeChild(bubble);
                    }
                }, 3000);
            }, 300);
        }
    }

    // Function to stop bubbles
    function stopBubbles() {
        if (bubbleInterval) {
            clearInterval(bubbleInterval);
            bubbleInterval = null;
            
            // Remove any remaining bubbles
            const bubbles = document.querySelectorAll('.bubble');
            bubbles.forEach(bubble => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                }
            });
        }
    }

    // Start Simulation
    startSimulation.addEventListener('click', function () {
        if (interval) {
            clearInterval(interval);
            interval = null;
            startSimulation.textContent = 'Começar';
            startSimulation.disabled = false;
            pressureTube.classList.remove('active-ltr');
            pressureTube.classList.remove('active-rtl');
            stopBubbles();
            return;
        }
        console.log(currentMass + "--" + initialMass);

        let currentLeftHeight = parseFloat(getComputedStyle(vaseLeftMiddle).height) / vaseLeftMiddle.parentElement.clientHeight * 100;
        let currentRightHeight = parseFloat(getComputedStyle(vaseRightMiddle).height) / vaseRightMiddle.parentElement.clientHeight * 100;

        // Reversed logic: higher mass makes left vase go down (lower height percentage)
        // and right vase go up (higher height percentage)
        let targetLeftHeight = 100 - (currentMass / 10) * 100;
        let targetRightHeight = (currentMass / 10) * 100;

        startSimulation.textContent = 'Simulando...';
        startSimulation.disabled = true;

        targetLeftHeight = targetLeftHeight === 90 ? 100 : targetLeftHeight;
        targetRightHeight = targetRightHeight === 10 ? 0 : targetRightHeight;

        // Determine if left vase is moving up or down
        flowDirection = currentLeftHeight < targetLeftHeight ? 'rtl' : 'ltr';

        // Activate water pressure effect with direction
        pressureTube.classList.remove('active-ltr');
        pressureTube.classList.remove('active-rtl');
        pressureTube.classList.add(`active-${flowDirection}`);
        createBubbles();

        interval = setInterval(() => {
            let done = true;

            if (currentLeftHeight < targetLeftHeight) {
                currentLeftHeight += 1;
                done = false;
            } else if (currentLeftHeight > targetLeftHeight) {
                currentLeftHeight -= 1;
                done = false;
            }

            if (currentRightHeight < targetRightHeight) {
                currentRightHeight += 1;
                done = false;
            } else if (currentRightHeight > targetRightHeight) {
                currentRightHeight -= 1;
                done = false;
            }
            
            vaseLeftMiddle.style.height = `${Math.min(100, Math.max(0, currentLeftHeight))}%`;
            vaseRightMiddle.style.height = `${Math.min(100, Math.max(0, currentRightHeight))}%`;

            if (done) {
                clearInterval(interval);
                interval = null;
                startSimulation.disabled = false;
                startSimulation.textContent = 'Continuar';
                pressureTube.classList.remove('active-ltr');
                pressureTube.classList.remove('active-rtl');
                stopBubbles();
            }
        }, 200);
    });

    // Reset Simulation
    resetSimulation.addEventListener('click', function () {
        clearInterval(interval);
        interval = null;
        previousMass = initialMass;
        currentMass = initialMass;

        massInputA.value = initialMass;
        massValueA.textContent = `${initialMass.toFixed(2)} kg`;

        vaseLeftMiddle.style.height = `50%`;
        vaseRightMiddle.style.height = `50%`;

        startSimulation.textContent = 'Começar';
        startSimulation.disabled = false;
        
        // Deactivate water pressure effect
        pressureTube.classList.remove('active-ltr');
        pressureTube.classList.remove('active-rtl');
        stopBubbles();

        console.log("Reset complete.");
    });

    function updateHydraulicPressCalculations() {
        // You can optionally add formula updates here
        console.log(`Mass changed from ${previousMass} to ${currentMass} kg`);
        console.log(`Flow direction: ${flowDirection}`);
    }
});
