document.addEventListener('DOMContentLoaded', () => {
    const displayInitialVolume = document.getElementById('initial-volume');
    const temp = document.getElementById('temp');
    const fire = document.getElementById('fire');
    const objectContainer = document.querySelector('.object-container');
    const objectFirstPlane = document.getElementById('object-first-plane');

    const totalVolumeValue = document.getElementById('total-volume-value');
    const initialVolume = objectFirstPlane.computedStyleMap().get('width').value;
    
    // Thermometer elements
    const thermometerInVertical = document.querySelector('.thermometer-in-vertical');
    const thermometerValue = document.querySelector('.thermometer-value');

    const γ = 69 * Math.pow(10, -6);
    const initialTemp = parseInt(temp.value); // °C
    let ΔV = initialVolume * γ * initialTemp;
    let initialFireSize = fire.computedStyleMap().get("width").value;

    let animationInterval = null;
    let isAnimating = false;
    let waterDrops = [];

    // Initialize thermometer
    updateThermometer(initialTemp);

    totalVolumeValue.textContent = ΔV + " cm";
    displayInitialVolume.textContent = initialVolume + " cm";

    temp.addEventListener('change', () => {
        const newTemp = parseInt(temp.value);
        const newΔV = (initialVolume * γ * newTemp).toFixed(4);
        ΔV = newΔV;
        
        // Update display values
        totalVolumeValue.textContent = ΔV + " cm";
        
        // Update fire size based on temperature
        const newFireSize = initialFireSize + (newTemp - initialTemp) * 0.2;
        fire.style.width = newFireSize + "px";
        
        // Update thermometer display immediately
        updateThermometer(newTemp);
    });
    
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        // If animation is already running, stop it
        if (isAnimating) {
            clearInterval(animationInterval);
            isAnimating = false;
            startButton.textContent = "Começar";
            
            // Remove all water drops
            removeAllWaterDrops();
            return;
        }
        
        startButton.textContent = "Parar";
        isAnimating = true;
        
        // Get current temperature
        const currentTemp = parseInt(temp.value);
        
        // Only show water leaking if temperature is above initial
        if (currentTemp > initialTemp) {
            // Calculate drop frequency based on temperature
            // Higher temperature = more frequent drops
            const dropFrequency = Math.max(1, Math.floor(currentTemp / 20));
            let dropCounter = 0;
            
            // Get the dimensions for positioning
            const containerRect = objectFirstPlane.getBoundingClientRect();
            const containerBottom = containerRect.height + 20; // Add offset for the bottom of container
            
            animationInterval = setInterval(() => {
                dropCounter++;
                
                // Create new drops based on frequency
                if (dropCounter % (10 / dropFrequency) === 0) {
                    createWaterDrop(containerRect, containerBottom);
                }
                
                // Animate existing drops
                animateWaterDrops(containerBottom);
                
            }, 100); // 50ms interval for animation
        } else {
            // No expansion at initial temperature
            isAnimating = false;
            startButton.textContent = "Começar";
        }
    });

    // Reset button
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
        // Stop any running animation
        if (isAnimating) {
            clearInterval(animationInterval);
            isAnimating = false;
            startButton.textContent = "Começar";
        }
        
        temp.value = initialTemp;
        ΔV = initialVolume * γ * initialTemp;
        
        // Remove all water drops
        removeAllWaterDrops();

        fire.style.width = initialFireSize + "px";
        totalVolumeValue.textContent = ΔV + " cm";
        
        // Reset thermometer
        updateThermometer(initialTemp);
    });
    
    // Function to create a new water drop
    function createWaterDrop(containerRect, containerBottom) {
        const drop = document.createElement('div');
        drop.className = 'water-falling';
        drop.style.top = '15px';
        drop.style.right = '-30px';
        drop.style.opacity = '1';
        
        objectContainer.appendChild(drop);
        waterDrops.push({
            element: drop,
            position: 15,
            speed: 2 + (parseInt(temp.value) / 25)
        });
    }
    
    // Function to animate all water drops
    function animateWaterDrops(containerBottom) {
        for (let i = waterDrops.length - 1; i >= 0; i--) {
            const drop = waterDrops[i];
            drop.position += drop.speed;
            drop.element.style.top = drop.position + 'px';
            
            // Remove drops that reach the bottom
            if (drop.position >= containerBottom) {
                drop.element.remove();
                waterDrops.splice(i, 1);
            }
        }
    }
    
    // Function to remove all water drops
    function removeAllWaterDrops() {
        waterDrops.forEach(drop => {
            drop.element.remove();
        });
        waterDrops = [];
    }
    
    // Function to update thermometer display
    function updateThermometer(temperature) {
        // Calculate height percentage based on temperature (0-100°C)
        const maxTemp = 100;
        const heightPercentage = Math.min(temperature / maxTemp * 100, 100);
        
        // Animate thermometer liquid height
        animateThermometerHeight(heightPercentage);
        
        // Update temperature text
        thermometerValue.textContent = temperature + " °C";
    }
    
    // Function to animate thermometer height
    function animateThermometerHeight(targetHeightPercentage) {
        const thermometerHeight = 94; // Maximum height in pixels
        const targetHeight = (thermometerHeight * targetHeightPercentage) / 100;
        
        // Get current height
        const currentHeight = parseInt(thermometerInVertical.style.height || "0");
        
        // Clear any existing animation
        if (window.thermometerAnimation) {
            clearInterval(window.thermometerAnimation);
        }
        
        // Set up animation
        const totalSteps = 30;
        const stepSize = (targetHeight - currentHeight) / totalSteps;
        let currentStep = 0;
        
        window.thermometerAnimation = setInterval(() => {
            if (currentStep >= totalSteps) {
                clearInterval(window.thermometerAnimation);
                return;
            }
            
            currentStep++;
            const newHeight = currentHeight + stepSize * currentStep;
            thermometerInVertical.style.height = newHeight + "px";
            
        }, 20);
    }
});
