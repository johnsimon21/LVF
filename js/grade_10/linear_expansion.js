document.addEventListener('DOMContentLoaded', () => {
    const displayInitialLinear = document.getElementById('initial-linear');
    const temp = document.getElementById('temp');
    const object = document.getElementById('object');
    const fire = document.getElementById('fire');

    const linearValue = document.getElementById('linear-value');
    const totalLinearValue = document.getElementById('total-linear-value');
    
    // Get initial width in a responsive way
    let initialLinear;
    if (window.getComputedStyle) {
        initialLinear = parseFloat(window.getComputedStyle(object).width);
    } else {
        initialLinear = object.offsetWidth;
    }
    
    // Adjust for mobile screens
    const isMobile = window.innerWidth <= 768;
    const scaleFactor = isMobile ? 0.8 : 1;
    initialLinear = initialLinear * scaleFactor;
    
    // Thermometer elements
    const thermometerInVertical = document.querySelector('.thermometer-in-vertical');
    const thermometerValue = document.querySelector('.thermometer-value');

    const α = 1.2 * Math.pow(10, -5);
    const initialTemp = parseInt(temp.value); // °C
    let ΔL = initialLinear * α * initialTemp;
    
    // Get fire size in a responsive way
    let initialFireSize;
    if (window.getComputedStyle) {
        initialFireSize = parseFloat(window.getComputedStyle(fire).width);
    } else {
        initialFireSize = fire.offsetWidth;
    }

    let animationInterval = null;
    let isAnimating = false;

    // Initialize thermometer
    updateThermometer(initialTemp);

    // Update display values
    linearValue.textContent = (ΔL + initialLinear).toFixed(2) + " mm";
    totalLinearValue.textContent = ΔL.toFixed(4) + " mm";
    displayInitialLinear.textContent = initialLinear.toFixed(2) + " mm";

    // Handle window resize
    window.addEventListener('resize', () => {
        // Only update if not currently animating
        if (!isAnimating) {
            // Recalculate based on new screen size
            const newIsMobile = window.innerWidth <= 768;
            const newScaleFactor = newIsMobile ? 0.8 : 1;
            
            // Reset object to initial size adjusted for screen
            if (window.getComputedStyle) {
                const currentWidth = parseFloat(window.getComputedStyle(object).width);
                if (Math.abs(currentWidth - initialLinear) > 5) {
                    object.style.width = (initialLinear * newScaleFactor) + "px";
                }
            }
        }
    });

    temp.addEventListener('change', () => {
        const newTemp = parseInt(temp.value);
        const newΔL = (initialLinear * α * (newTemp - initialTemp)).toFixed(4);
        ΔL = newΔL > ΔL ? newΔL : ΔL;
        
        // Update display values but don't change width yet
        linearValue.textContent = (initialLinear + parseFloat(ΔL)).toFixed(2) + " mm";
        totalLinearValue.textContent = ΔL + " mm";
        displayInitialLinear.textContent = initialLinear.toFixed(2) + " mm";
        
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
        const targetΔL = parseFloat(ΔL);
        const targetWidth = initialLinear + targetΔL * 100;
        
        // Get current width
        let currentWidth;
        if (object.style.width) {
            currentWidth = parseFloat(object.style.width);
        } else if (window.getComputedStyle) {
            currentWidth = parseFloat(window.getComputedStyle(object).width);
        } else {
            currentWidth = initialLinear;
        }
        
        // Calculate steps for smooth animation
        const totalSteps = 100;
        const stepSize = (targetWidth - currentWidth) / totalSteps;
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
            const newWidth = currentWidth + stepSize * currentStep;
            object.style.width = newWidth + "px";
            
            // Update display values during animation
            const currentΔL = (newWidth - initialLinear) / 100;
            linearValue.textContent = (initialLinear + currentΔL).toFixed(2) + " mm";
            totalLinearValue.textContent = currentΔL.toFixed(4) + " mm";
            
        }, 30); // 30ms interval for smooth animation
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
        ΔL = initialLinear * α * initialTemp;

        fire.style.width = initialFireSize + "px";
        object.style.width = initialLinear + "px";
        linearValue.textContent = (ΔL + initialLinear).toFixed(2) + " mm";
        totalLinearValue.textContent = ΔL.toFixed(4) + " mm";
        displayInitialLinear.textContent = initialLinear.toFixed(2) + " mm";
        
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
