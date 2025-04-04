document.addEventListener('DOMContentLoaded', () => {
    const objectTypes = {
        "aluminum": 46 * Math.pow(10, -6),
        "copper": 33.6 * Math.pow(10, -6),
        "iron": 24 * Math.pow(10, -6),
        "brass": 24 * Math.pow(10, -6)
    }
    const objectTypesLabel = {
        "aluminum": "46 x 10⁻⁶",
        "copper": "33.6 × 10⁻⁶",
        "iron": "24 × 10⁻⁶",
        "brass": "24 × 10⁻⁶"
    }

    const displayInitialSurface = document.getElementById('initial-surface');
    const displayFinalSurface = document.getElementById('final-surface');
    const displayObjectType = document.getElementById('object-type-label');
    const temp = document.getElementById('temp');
    const displayTotalTemp = document.getElementById('total-temp');
    const objectType = document.getElementById('object-type');
    const objectFirstPlane = document.getElementById('object-first-plane');
    const object = document.getElementById('object');
    const fire = document.getElementById('fire');
    const initialSurfacePadding = parseInt(window.getComputedStyle(objectFirstPlane).padding);

    const totalSurfaceValue = document.getElementById('total-surface-value');
    const initialSurface = object.computedStyleMap().get('width').value;
    
    // Thermometer elements
    const thermometerInVertical = document.querySelector('.thermometer-in-vertical');
    const thermometerValue = document.querySelector('.thermometer-value');
    let β = objectTypes[objectType.value];
    const initialTemp = parseInt(temp.value); // °C
    let ΔS = initialSurface * β * initialTemp;
    let initialFireSize = fire.computedStyleMap().get("width").value;

    let animationInterval = null;
    let isAnimating = false;

    // Initialize thermometer
    updateThermometer(initialTemp);

    displayObjectType.textContent = objectTypesLabel[objectType.value];
    totalSurfaceValue.textContent = ΔS;
    displayInitialSurface.textContent = initialSurface;
    displayTotalTemp.textContent = initialTemp;
    displayFinalSurface.textContent = initialSurface;

    temp.addEventListener('change', () => {
        β = objectTypes[objectType.value];
        const newTemp = parseInt(temp.value);
        const newΔS = (initialSurface * β * (newTemp - initialTemp)).toFixed(4);
        ΔS = newΔS > ΔS ? newΔS : ΔS;

        // Update display values but don't change width yet
        displayObjectType.textContent = objectTypesLabel[objectType.value];
        displayTotalTemp.textContent = newTemp - initialTemp
        totalSurfaceValue.textContent = ΔS;

        displayInitialSurface.textContent = initialSurface;

        // Update fire size based on temperature
        const newFireSize = initialFireSize + (newTemp - initialTemp) * 0.2;
        fire.style.width = newFireSize + "px";

        console.log(initialFireSize)

        // Update thermometer display immediately
        updateThermometer(newTemp);
    });

    objectType.addEventListener('change', () => {
        β = objectTypes[objectType.value];
        const newTemp = parseInt(temp.value);
        const newΔS = (initialSurface * β * (newTemp - initialTemp)).toFixed(4);
        ΔS = newΔS > ΔS ? newΔS : ΔS;

        // Update display values but don't change width yet
        displayObjectType.textContent = objectTypesLabel[objectType.value];
        displayTotalTemp.textContent = newTemp - initialTemp
        totalSurfaceValue.textContent = ΔS;

        displayInitialSurface.textContent = initialSurface;

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
            return;
        }

        // Get target width based on current temperature
        const targetΔS = parseFloat(ΔS);
        const targetWidth = initialSurface + targetΔS * 50;

        // Get current width
        const currentSurfaceWidth = parseFloat(objectFirstPlane.value
            || initialSurface);

        const currentPadding = parseFloat(parseInt(window.getComputedStyle(objectFirstPlane).padding)
            || initialSurfacePadding);

        // Calculate steps for smooth animation
        const totalSteps = 100;
        const stepSize = (targetWidth - currentSurfaceWidth) / totalSteps;
        let currentStep = 0;

        startButton.textContent = "Parar";
        isAnimating = true;

        // Start animation
        animationInterval = setInterval(() => {
            if (currentStep >= totalSteps) {
                clearInterval(animationInterval);
                isAnimating = false;
                startButton.textContent = "Começar";
                return;
            }

            currentStep++;
            const newWidth = currentSurfaceWidth + stepSize * currentStep;
            const newPadding = currentPadding + stepSize * currentStep;
            displayFinalSurface.textContent = newWidth.toFixed(4);
            objectFirstPlane.style.padding = newPadding + "px";

            // Update display values during animation
            const currentΔS = (newWidth - initialSurface) / 100;
            totalSurfaceValue.textContent = currentΔS.toFixed(4);

        }, 100); // 30ms interval for smooth animation
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
        ΔS = initialSurface * β * initialTemp;

        objectType.value = "aluminum";
        fire.style.width = initialFireSize + "px";
        object.style.width = initialSurface + "px";
        totalSurfaceValue.textContent = ΔS;
        displayObjectType.textContent = objectTypesLabel["aluminum"];
        displayInitialSurface.textContent = initialSurface;
        displayFinalSurface.textContent = initialSurface;
        objectFirstPlane.style.padding =  "0px";

        displayTotalTemp.textContent = newTemp - initialTemp

        fire.style.width = "0px";


        // Reset thermometer
        updateThermometer(initialTemp);
    });

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
