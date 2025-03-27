document.addEventListener('DOMContentLoaded', function () {
    // Get elements for heat slider
    const heatSlider = document.getElementById('heat-slider');
    const decreaseBtn = document.getElementById('decrease');
    const increaseBtn = document.getElementById('increase');
    const simulationContent = document.querySelector('.simulation-content');

    // Get elements for mass slider
    const massSlider = document.getElementById('mass-slider');
    const massDecreaseBtn = document.getElementById('mass-decrease');
    const massIncreaseBtn = document.getElementById('mass-increase');
    const currentMassDisplay = document.querySelector('.current-mass');
    const iceImage = document.querySelector('.ice');
    const latentHeatValue = document.getElementById('latent-heat-value');

    // Variables for melting animation
    let melting = false;
    const minMass = parseFloat(massSlider.min);
    const maxMass = parseFloat(massSlider.max);
    let size = 100; // Initial size percentage
    let mass = parseFloat(massSlider.value);

    // Function to update background based on slider value
    function updateBackground(value) {
        // Calculate color based on value (0-100)
        // Cold (blue) to hot (red) gradient
        const coldColor = [211, 237, 253]; // #D3EDFD - starting blue color
        const hotColor = [253, 211, 211];  // #FDD3D3 - ending reddish color

        // Calculate the interpolated color
        const r = Math.round(coldColor[0] + (hotColor[0] - coldColor[0]) * (value / 100));
        const g = Math.round(coldColor[1] + (hotColor[1] - coldColor[1]) * (value / 100));
        const b = Math.round(coldColor[2] + (hotColor[2] - coldColor[2]) * (value / 100));

        // Apply the background color
        simulationContent.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        // Update thermometer height based on slider value
        const thermometerIn = document.querySelector('.thermometer-in-vertical');
        thermometerIn.style.height = `${value}px`;

        // Update temperature display
        const tempValue = document.querySelector('.thermometer-value');
        // Convert slider value to temperature range (e.g., 0-100 to -10 to 110°C)
        const temperature = Math.round(-10 + (value * 1.2));
        tempValue.textContent = `${temperature} °C`;

        // Calculate and update latent heat
        calculateLatentHeat();
    }

    // Function to create water effects
    function createWaterEffects() {
        // Create water puddle if it doesn't exist
        if (!document.querySelector('.water-puddle')) {
            const waterPuddle = document.createElement('div');
            waterPuddle.className = 'water-puddle';
            document.querySelector('.iron-base').appendChild(waterPuddle);
        }

        // Create water drops container if it doesn't exist
        if (!document.querySelector('.water-drops-container')) {
            const waterDropsContainer = document.createElement('div');
            waterDropsContainer.className = 'water-drops-container';
            waterDropsContainer.style.position = 'absolute';
            waterDropsContainer.style.bottom = '0';
            waterDropsContainer.style.left = '50%';
            waterDropsContainer.style.transform = 'translateX(-50%)';
            document.querySelector('.water-on-foot').appendChild(waterDropsContainer);

            // Create initial water drops
            for (let i = 0; i < 5; i++) {
                const waterDrop = document.createElement('div');
                waterDrop.className = 'water-drop';
                waterDrop.style.left = `${Math.random() * 100 - 50}px`;
                waterDrop.style.animationDelay = `${Math.random() * 2}s`;
                waterDropsContainer.appendChild(waterDrop);
            }
        }
    }

    let simulationSpeed = 1; // Default speed multiplier
    let startTime = null;
    let elapsedTime = 0;
    let timerInterval = null;

    // Create a function to update the timer display
    function updateTimer() {
        if (!startTime) return;

        const currentTime = new Date().getTime();
        elapsedTime = Math.floor((currentTime - startTime) / 1000);

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    let meltingInterval = null;
    const meltingRate = 0.002; // Very small base melting rate

    // Replace the meltIce function with this version using setInterval
    function meltIce() {
        // Clear any existing interval
        if (meltingInterval) {
            clearInterval(meltingInterval);
            meltingInterval = null;
        }

        // Get current temperature
        const heat = parseInt(heatSlider.value);
        const temperature = Math.round(-10 + (heat * 1.2));

        // Only melt if temperature is above 0°C
        if (temperature <= 0) {
            melting = false;
            startButton.textContent = 'Start';
            return;
        }

        // Create water effects
        createWaterEffects();
        const waterPuddle = document.querySelector('.water-puddle');
        const waterDrops = document.querySelectorAll('.water-drop');

        // Show water drops
        waterDrops.forEach(drop => {
            drop.style.display = 'block';
        });

        // Calculate interval based on simulation speed (slower speed = longer interval)
        const updateInterval = Math.max(100, 500 / simulationSpeed);

        // Start the melting interval
        meltingInterval = setInterval(() => {
            // Get current heat value (in case it changed)
            const currentHeat = parseInt(heatSlider.value);
            const currentTemp = Math.round(-10 + (currentHeat * 1.2));

            // Stop melting if temperature drops below freezing
            if (currentTemp <= 0) {
                clearInterval(meltingInterval);
                meltingInterval = null;
                melting = false;
                startButton.textContent = 'Start';
                return;
            }

            // Calculate melt rate based on temperature (higher temp = faster melting)
            const meltRate = meltingRate * (currentTemp / 10) * simulationSpeed;

            // If there's still ice to melt
            if (mass > minMass) {
                // Reduce mass
                mass = Math.max(minMass, mass - meltRate);

                // Update mass slider and display
                massSlider.value = mass;
                currentMassDisplay.textContent = `${mass.toFixed(2)} kg`;

                // Update ice size
                const scalePercentage = 50 + (mass / 10) * 100;
                iceImage.style.transform = `scale(${scalePercentage / 100})`;


                // Update water puddle size
                const meltedPercentage = 1 - ((mass - minMass) / (maxMass - minMass));
                waterPuddle.style.width = `${meltedPercentage * 200}px`;
                waterPuddle.style.height = `${meltedPercentage * 20}px`;
                waterPuddle.style.opacity = meltedPercentage;

                // Calculate and update latent heat
                calculateLatentHeat();
            } else {
                // Melting complete
                clearInterval(meltingInterval);
                meltingInterval = null;
                melting = false;
                startButton.textContent = 'Start';

                // Ensure ice is completely hidden by setting scale to 0
                iceImage.style.transform = 'scale(0)';

                // Ensure ice is completely hidden and puddle is fully visible
                waterPuddle.style.width = '200px';
                waterPuddle.style.height = '20px';
            }
        }, updateInterval);
    }


    // Function to update ice mass
    function updateMass(value) {
        // Update mass variable
        mass = value;

        // Update mass display with 2 decimal places
        currentMassDisplay.textContent = `${mass.toFixed(2)} kg`;

        // Scale the ice image based on mass
        const scalePercentage = (mass / maxMass) * 100;
        iceImage.style.transform = `scale(${scalePercentage / 100})`;

        // Calculate and update latent heat
        calculateLatentHeat();
    }

    // Function to calculate latent heat (L = Q/m)
    function calculateLatentHeat() {
        const heatValue = parseInt(heatSlider.value);
        const massValue = parseFloat(massSlider.value);

        // Simple calculation for demonstration purposes
        // Assuming heat slider (0-100) represents heat in kJ (0-100 kJ)
        // L = Q/m (kJ/kg)
        const latentHeat = massValue > minMass ? Math.round(heatValue / massValue) : 0;

        // Update the latent heat display
        latentHeatValue.textContent = latentHeat * 1000; // Convert to J/kg
    }

    // Function to reset the simulation
    function resetSimulation() {
        // Reset mass to default
        mass = 4;
        massSlider.value = mass;
        updateMass(mass);

        // Stop melting
        if (meltingInterval) {
            clearInterval(meltingInterval);
            meltingInterval = null;
        }

        startTime = null;
        elapsedTime = 0;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timerDisplay.textContent = '00:00';

        // Reset water puddle
        const waterPuddle = document.querySelector('.water-puddle');
        if (waterPuddle) {
            waterPuddle.style.width = '0';
            waterPuddle.style.height = '0';
            waterPuddle.style.opacity = '0';
        }

        // Hide water drops
        const waterDrops = document.querySelectorAll('.water-drop');
        waterDrops.forEach(drop => {
            drop.style.display = 'none';
        });

        // Restore ice visibility
        const scalePercentage = (mass / maxMass) * 100;
        iceImage.style.transform = `scale(${scalePercentage / 100})`;
    }

    // Create the speed control and timer elements
    const speedControlContainer = document.createElement('div');
    speedControlContainer.className = 'speed-control-container';
    speedControlContainer.innerHTML = `
    <label for="speed-control">Simulation Speed:</label>
    <select id="speed-control">
        <option value="0.1">Very Slow</option>
        <option value="0.25">Slow</option>
        <option value="0.5" selected>Normal</option>
        <option value="1">Fast</option>
        <option value="2">Very Fast</option>
    </select>
`;

    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';
    timerContainer.innerHTML = `
    <label>Elapsed Time:</label>
    <span id="timer-display">00:00</span>
`;

    // Get the timer display element
    const timerDisplay = document.getElementById('timer-display') || timerContainer.querySelector('#timer-display');

    // Add event listener for speed control
    const speedControl = speedControlContainer.querySelector('#speed-control');
    speedControl.addEventListener('change', function () {
        simulationSpeed = parseFloat(this.value);
    });

    // Add the new elements to the controllers
    document.querySelector('.controllers .results .datas').appendChild(speedControlContainer);
    document.querySelector('.controllers .results .datas').appendChild(timerContainer);

    // Add a start button to the HTML
    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.className = 'start-button';
    startButton.addEventListener('click', function () {
        if (!melting) {
            melting = true;
            startButton.textContent = 'Melting...';

            // Start the timer
            if (!startTime) {
                startTime = new Date().getTime();
                timerInterval = setInterval(updateTimer, 1000);
            }

            meltIce();
        } else {
            melting = false;
            startButton.textContent = 'Start';

            // Stop the melting animation
            if (meltingInterval) {
                clearInterval(meltingInterval);
                meltingInterval = null;
            }

            // Pause the timer
            clearInterval(timerInterval);
            timerInterval = null;
        }
    });

    // Add the start button to the controllers
    document.querySelector('.controllers .results .datas').appendChild(startButton);

    // Add a reset button to the HTML if it doesn't exist
    if (!document.querySelector('.reset-button')) {
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.className = 'reset-button';
        resetButton.addEventListener('click', resetSimulation);

        // Add the reset button to the controllers
        document.querySelector('.controllers .results .datas').appendChild(resetButton);
    }

    // Initialize with default values
    updateBackground(heatSlider.value);
    updateMass(parseFloat(massSlider.value));

    // Add event listeners for heat slider
    heatSlider.addEventListener('input', function () {
        updateBackground(this.value);
    });

    decreaseBtn.addEventListener('click', function () {
        if (heatSlider.value > heatSlider.min) {
            heatSlider.value = parseInt(heatSlider.value) - 5;
            updateBackground(heatSlider.value);
        }
    });

    increaseBtn.addEventListener('click', function () {
        if (heatSlider.value < heatSlider.max) {
            heatSlider.value = parseInt(heatSlider.value) + 5;
            updateBackground(heatSlider.value);
        }
    });

    // Add event listeners for mass slider
    massSlider.addEventListener('input', function () {
        updateMass(parseFloat(this.value));

        // If manually changing mass, stop melting
        melting = false;
        startButton.textContent = 'Start';
    });

    massDecreaseBtn.addEventListener('click', function () {
        if (massSlider.value > massSlider.min) {
            massSlider.value = parseFloat(massSlider.value) - parseFloat(massSlider.step);
            updateMass(parseFloat(massSlider.value));

            // If manually changing mass, stop melting
            melting = false;
            startButton.textContent = 'Start';
        }
    });

    massIncreaseBtn.addEventListener('click', function () {
        if (massSlider.value < massSlider.max) {
            massSlider.value = parseFloat(massSlider.value) + parseFloat(massSlider.step);
            updateMass(parseFloat(massSlider.value));

            // If manually changing mass, stop melting
            melting = false;
            startButton.textContent = 'Start';
        }
    });
});
