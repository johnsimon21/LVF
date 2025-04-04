// Get DOM elements
const angleInput = document.getElementById('angle-input');
const distanceInput = document.getElementById('distance-input');
const flashlightContainer = document.querySelector('.flashlight-container');
const reflectedRay = document.querySelector('.reflected-ray');

// Set initial values and ranges
angleInput.min = 0;
angleInput.max = 90;
angleInput.value = 45; // Default angle

// Set distance input range
distanceInput.min = 100;
distanceInput.max = 300;
distanceInput.value = 150; // Default distance

// Function to update the simulation based on angle and distance
function updateSimulation() {
    const angle = parseInt(angleInput.value);
    const distance = parseInt(distanceInput.value);
    
    // Update CSS variables for flashlight rotation and distance
    document.documentElement.style.setProperty('--flashlight-rotate', `${angle}deg`);
    document.documentElement.style.setProperty('--flashlight-container-top', `-${distance}px`);
    
    // Update reflected ray angle (law of reflection: angle of incidence = angle of reflection)
    reflectedRay.style.transformOrigin = "left center";
    
    // The reflected ray should mirror the incident ray angle
    reflectedRay.style.transform = `rotate(${-angle}deg)`;
    
    // Update angle display
    document.querySelector('.insident-info').textContent = `Raio Incidente (${angle}°)`;
    document.querySelector('.reflected-ray-info').textContent = `Raio Refletido (${angle}°)`;
    
    // Update or create angle indicator
    updateAngleIndicator(angle);
}

// Function to create and update the angle indicator
function updateAngleIndicator(angle) {
    // Get or create angle indicator elements
    let incidentAngleArc = document.querySelector('.incident-angle-arc');
    let reflectedAngleArc = document.querySelector('.reflected-angle-arc');
    let totalAngleArc = document.querySelector('.total-angle-arc');
    
    // Create elements if they don't exist
    if (!incidentAngleArc) {
        incidentAngleArc = document.createElement('div');
        incidentAngleArc.className = 'incident-angle-arc angle-arc';
        document.querySelector('.mirror').appendChild(incidentAngleArc);
    }
    
    if (!reflectedAngleArc) {
        reflectedAngleArc = document.createElement('div');
        reflectedAngleArc.className = 'reflected-angle-arc angle-arc';
        document.querySelector('.mirror').appendChild(reflectedAngleArc);
    }
    
    if (!totalAngleArc) {
        totalAngleArc = document.createElement('div');
        totalAngleArc.className = 'total-angle-arc';
        document.querySelector('.mirror').appendChild(totalAngleArc);
    }
    
    // Update the angle indicators
    incidentAngleArc.style.transform = `rotate(${90-angle}deg)`;
    reflectedAngleArc.style.transform = `rotate(${-90+angle}deg)`;
    
    // Update the total angle display
    const totalAngle = 2 * angle;
    totalAngleArc.textContent = `${totalAngle}°`;
    totalAngleArc.style.top = `-${distance/4}px`;
}

// Add event listeners to inputs
angleInput.addEventListener('input', updateSimulation);
distanceInput.addEventListener('input', updateSimulation);

// Initialize the simulation
window.addEventListener('load', updateSimulation);
