document.addEventListener('DOMContentLoaded', function() {
    // Get the draggable objects
    const objectA = document.querySelector('.object-a');
    const objectB = document.querySelector('.object-b');
    const simulationContent = document.querySelector('.simulation-content');
    const objectBase = document.querySelector('.object-base');
    const aquarium = document.querySelector('.aquarium');
    const water = document.querySelector('.water');
    
    // Get input elements
    const objectInputA = document.getElementById('object-input-a');
    const objectInputB = document.getElementById('object-input-b');
    const massInputA = document.getElementById('mass-input-a');
    const massInputB = document.getElementById('mass-input-b');
    const volumeInputA = document.getElementById('volume-input-a');
    const volumeInputB = document.getElementById('volume-input-b');
    
    // Get display elements
    const massValueA = document.getElementById('mass-value-a');
    const massValueB = document.getElementById('mass-value-b');
    const volumeValueA = document.getElementById('volume-value-a');
    const volumeValueB = document.getElementById('volume-value-b');
    const densityResultA = document.getElementById('density-result-a');
    const densityResultB = document.getElementById('density-result-b');
    
    // Set initial values for inputs
    massInputA.min = 1;
    massInputA.max = 10;
    massInputA.value = 2;
    massInputA.step = 0.1;
    
    massInputB.min = 1;
    massInputB.max = 20;
    massInputB.value = 10;
    massInputB.step = 0.1;
    
    volumeInputA.min = 1;
    volumeInputA.max = 10;
    volumeInputA.value = 2;
    volumeInputA.step = 0.1;
    
    volumeInputB.min = 1;
    volumeInputB.max = 10;
    volumeInputB.value = 5;
    volumeInputB.step = 0.1;
    
    // Material densities (kg/m³)
    const densities = {
        wood: 700,
        alum: 2700,
        iron: 7800
    };
    
    // Store initial object dimensions
    let initialSizes = {
        objectA: {
            width: parseInt(window.getComputedStyle(objectA).width),
            height: parseInt(window.getComputedStyle(objectA).height)
        },
        objectB: {
            width: parseInt(window.getComputedStyle(objectB).width),
            height: parseInt(window.getComputedStyle(objectB).height)
        }
    };
    
    // Variables to track dragging state
    let isDragging = false;
    let currentObject = null;
    let offsetX, offsetY;
    
    // Physics variables
    const gravity = 0.5; // Gravity acceleration
    const fallingObjects = new Set();
    let animationFrameId = null;
    
    // Handle window resize to maintain responsivity
    window.addEventListener('resize', function() {
        // Reset objects to their initial positions
        resetObjects();
        
        // Update initial sizes based on current viewport
        initialSizes = {
            objectA: {
                width: parseInt(window.getComputedStyle(objectA).width),
                height: parseInt(window.getComputedStyle(objectA).height)
            },
            objectB: {
                width: parseInt(window.getComputedStyle(objectB).width),
                height: parseInt(window.getComputedStyle(objectB).height)
            }
        };
        
        // Update object properties to apply new sizes
        updateObjectProperties();
    });
    
    // Update object properties based on inputs
    function updateObjectProperties() {
        // Update object A
        const massA = parseFloat(massInputA.value);
        const volumeA = parseFloat(volumeInputA.value);
        const materialA = objectInputA.value;
        const densityA = massA / volumeA;
        
        // Update object B
        const massB = parseFloat(massInputB.value);
        const volumeB = parseFloat(volumeInputB.value);
        const materialB = objectInputB.value;
        const densityB = massB / volumeB;
        
        // Update mass display
        objectA.querySelector('.mass-value').textContent = massA.toFixed(2) + ' kg';
        objectB.querySelector('.mass-value').textContent = massB.toFixed(2) + ' kg';
        
        // Update range value displays
        massValueA.textContent = massA.toFixed(2) + ' kg';
        massValueB.textContent = massB.toFixed(2) + ' kg';
        volumeValueA.textContent = volumeA.toFixed(2) + ' m³';
        volumeValueB.textContent = volumeB.toFixed(2) + ' m³';
        
        // Update density results
        densityResultA.textContent = densityA.toFixed(2) + ' kg/m³';
        densityResultB.textContent = densityB.toFixed(2) + ' kg/m³';
        
        // Update object appearance based on material
        updateObjectAppearance(objectA, materialA);
        updateObjectAppearance(objectB, materialB);
        
        // Store density for physics calculations
        objectA.density = densityA;
        objectB.density = densityB;
        
        // Store material type for floating behavior
        objectA.material = materialA;
        objectB.material = materialB;
        
        // Scale object size based on volume while maintaining aspect ratio
        // We'll scale relative to the initial size, but with a dampened effect to avoid extremes
        const scaleFactorA = Math.pow(volumeA / 2, 0.3); // Dampened scaling
        const scaleFactorB = Math.pow(volumeB / 5, 0.3); // Dampened scaling
        
        objectA.style.width = (initialSizes.objectA.width * scaleFactorA) + 'px';
        objectA.style.height = (initialSizes.objectA.height * scaleFactorA) + 'px';
        
        objectB.style.width = (initialSizes.objectB.width * scaleFactorB) + 'px';
        objectB.style.height = (initialSizes.objectB.height * scaleFactorB) + 'px';
    }
    
    // Update object appearance based on material
    function updateObjectAppearance(obj, material) {
        // Remove any existing material classes
        obj.classList.remove('material-wood', 'material-alum', 'material-iron');
        
        // Add appropriate material class
        obj.classList.add('material-' + material);
    }
    
    // Add event listeners to inputs
    objectInputA.addEventListener('change', updateObjectProperties);
    objectInputB.addEventListener('change', updateObjectProperties);
    massInputA.addEventListener('input', updateObjectProperties);
    massInputB.addEventListener('input', updateObjectProperties);
    volumeInputA.addEventListener('input', updateObjectProperties);
    volumeInputB.addEventListener('input', updateObjectProperties);
    
    // Add event listeners to both objects
    [objectA, objectB].forEach(obj => {
        // When mouse button is pressed on an object
        obj.addEventListener('mousedown', function(e) {
            isDragging = true;
            currentObject = obj;
            
            // Stop falling if it was falling
            fallingObjects.delete(obj);
            
            // Calculate the offset from the mouse position to the object's top-left corner
            const rect = obj.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Change cursor style
            obj.style.cursor = 'grabbing';
            
            // Move the object to be a direct child of simulation-content for unrestricted movement
            if (obj.parentElement !== simulationContent) {
                // Store original position before moving
                const originalRect = obj.getBoundingClientRect();
                const contentRect = simulationContent.getBoundingClientRect();
                
                // Append to simulation-content
                simulationContent.appendChild(obj);
                
                // Adjust position to maintain visual position after parent change
                obj.style.position = 'absolute';
                obj.style.left = (originalRect.left - contentRect.left) + 'px';
                obj.style.top = (originalRect.top - contentRect.top) + 'px';
                obj.style.bottom = 'auto'; // Remove bottom positioning
                obj.style.right = 'auto'; // Remove right positioning
                obj.style.zIndex = '10'; // Ensure dragged object is on top
            }
            
            // Prevent default behavior to avoid text selection during drag
            e.preventDefault();
        });
        
        // Store velocity for each object
        obj.velocity = 0;
    });
    
    // Add touch event support for mobile devices
    [objectA, objectB].forEach(obj => {
        obj.addEventListener('touchstart', function(e) {
            isDragging = true;
            currentObject = obj;
            
            // Stop falling if it was falling
            fallingObjects.delete(obj);
            
            // Calculate the offset from the touch position to the object's top-left corner
            const rect = obj.getBoundingClientRect();
            const touch = e.touches[0];
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
            
            // Move the object to be a direct child of simulation-content for unrestricted movement
            if (obj.parentElement !== simulationContent) {
                // Store original position before moving
                const originalRect = obj.getBoundingClientRect();
                const contentRect = simulationContent.getBoundingClientRect();
                
                // Append to simulation-content
                simulationContent.appendChild(obj);
                
                // Adjust position to maintain visual position after parent change
                obj.style.position = 'absolute';
                obj.style.left = (originalRect.left - contentRect.left) + 'px';
                obj.style.top = (originalRect.top - contentRect.top) + 'px';
                obj.style.bottom = 'auto'; // Remove bottom positioning
                obj.style.right = 'auto'; // Remove right positioning
                obj.style.zIndex = '10'; // Ensure dragged object is on top
            }
            
            // Prevent default behavior to avoid scrolling
            e.preventDefault();
        }, { passive: false });
    });
    
    // When mouse moves while dragging
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !currentObject) return;
        
        // Calculate new position relative to the simulation-content
        const contentRect = simulationContent.getBoundingClientRect();
        let newX = e.clientX - contentRect.left - offsetX;
        let newY = e.clientY - contentRect.top - offsetY;
        
        // Update position without constraints
        currentObject.style.left = newX + 'px';
        currentObject.style.top = newY + 'px';
    });
    
    // Touch move event for mobile devices
    document.addEventListener('touchmove', function(e) {
        if (!isDragging || !currentObject) return;
        
        // Calculate new position relative to the simulation-content
        const contentRect = simulationContent.getBoundingClientRect();
        const touch = e.touches[0];
        let newX = touch.clientX - contentRect.left - offsetX;
        let newY = touch.clientY - contentRect.top - offsetY;
        
        // Update position without constraints
        currentObject.style.left = newX + 'px';
        currentObject.style.top = newY + 'px';
        
        // Prevent default behavior to avoid scrolling
        e.preventDefault();
    }, { passive: false });
    
    // When mouse button is released
    document.addEventListener('mouseup', function() {
        if (isDragging && currentObject) {
            currentObject.style.cursor = 'grab';
            isDragging = false;
            
            // Start physics simulation for this object
            currentObject.velocity = 0;
            fallingObjects.add(currentObject);
            
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updatePhysics);
            }
            
            currentObject = null;
        }
    });
    
    // Touch end event for mobile devices
    document.addEventListener('touchend', function() {
        if (isDragging && currentObject) {
            isDragging = false;
            
            // Start physics simulation for this object
            currentObject.velocity = 0;
            fallingObjects.add(currentObject);
            
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updatePhysics);
            }
            
            currentObject = null;
        }
    });
    
    // When mouse leaves the window
    document.addEventListener('mouseleave', function() {
        if (isDragging && currentObject) {
            currentObject.style.cursor = 'grab';
            isDragging = false;
            
            // Start physics simulation for this object
            currentObject.velocity = 0;
            fallingObjects.add(currentObject);
            
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updatePhysics);
            }
            
            currentObject = null;
        }
    });
    
    // Check if an object is supported by another object
    function isObjectSupported(obj, allObjects) {
        const objRect = obj.getBoundingClientRect();
        const tolerance = 5; // Tolerance in pixels for collision detection
        
        for (const otherObj of allObjects) {
            if (otherObj === obj) continue; // Skip self
            
            const otherRect = otherObj.getBoundingClientRect();
            
            // Check if obj is on top of otherObj
            if (Math.abs((objRect.bottom) - otherRect.top) < tolerance && 
                objRect.right > otherRect.left && 
                objRect.left < otherRect.right) {
                return {
                    supported: true,
                    supportLevel: otherRect.top
                };
            }
        }
        
        return { supported: false };
    }
    
    // Physics update function
    function updatePhysics() {
        const contentRect = simulationContent.getBoundingClientRect();
        const baseRect = objectBase.getBoundingClientRect();
        const waterRect = water.getBoundingClientRect();
        const allObjects = document.querySelectorAll('.object');

    
        // Water density is 1000 kg/m³
        const waterDensity = 1000;
    
        let stillFalling = false;

    
        fallingObjects.forEach(obj => {
            const objRect = obj.getBoundingClientRect();

        
            // Convert to relative position within simulation-content
            const objTop = objRect.top - contentRect.top;
            const objLeft = objRect.left - contentRect.left;
            const objBottom = objTop + objRect.height;

        
            // Get current mass and volume values for this object
            let mass, volume, density;
            if (obj.classList.contains('object-a')) {
                mass = parseFloat(massInputA.value);
                volume = parseFloat(volumeInputA.value);
            } else {
                mass = parseFloat(massInputB.value);
                volume = parseFloat(volumeInputB.value);
            }

        
            // Calculate density in real-time
            density = mass / volume;




        
            // Determine if object should float based on real-time density
            const shouldFloat = density < waterDensity;









        
            // Check if object is in water
            const inWater = (
                objRect.right > waterRect.left &&
                objRect.left < waterRect.right &&
                objRect.top < waterRect.bottom &&
                objRect.bottom > waterRect.top
            );

        
            // Check if object is supported by another object
            const objectSupport = isObjectSupported(obj, allObjects);

        
            // Determine floor level based on support conditions


            let floorLevel;
        
            // 1. Check if supported by another object
            if (objectSupport.supported) {
                floorLevel = objectSupport.supportLevel - contentRect.top - objRect.height;
            } 
            // 2. Check if floating on water (based on real-time density)
            else if (inWater && shouldFloat) {
                // Calculate how much of the object should be submerged based on density ratio
                // Archimedes' principle: percentage submerged = object density / fluid density
                const submersionRatio = Math.min(density / waterDensity, 0.95); // Cap at 95% to keep it visible
                floorLevel = waterRect.top - contentRect.top - objRect.height * (1 - submersionRatio);
            } 
            // 3. Default to object-base
            else {
                floorLevel = baseRect.top - contentRect.top - objRect.height;
            }

        
            // Apply gravity if not at floor level
            if (objBottom < floorLevel - 1) { // -1 for tolerance
                // Apply gravity
                obj.velocity += gravity;

            
                // Apply water resistance and buoyancy if in water
                if (inWater) {

                    if (shouldFloat) {
                        // Calculate buoyancy force based on submerged volume

                        const submergedRatio = Math.min(
                            (waterRect.bottom - objRect.top) / objRect.height,
                            1.0
                        );

                    
                        // Apply upward force proportional to submerged volume
                        const buoyancyForce = gravity * 1.2 * submergedRatio;
                        obj.velocity -= buoyancyForce;

                    
                        // Apply water resistance
                        obj.velocity *= 0.9;
                    } else {


                        // For sinking objects, apply less buoyancy but still some water resistance
                        obj.velocity *= 0.95; // Slower falling in water
                    }
                }

            
                // Update position
                const newTop = objTop + obj.velocity;
                obj.style.top = newTop + 'px';

            
                stillFalling = true;
            } else {
                // Object has reached the floor or support
                obj.style.top = floorLevel + 'px';
                obj.velocity = 0;

            
                // If the object is in water and should sink, keep it in fallingObjects
                // so it continues to sink to the bottom
                if (inWater && !shouldFloat && objBottom < baseRect.top - contentRect.top - 1) {
                    stillFalling = true;
                } else {
                    fallingObjects.delete(obj);
                }
            }
        });

    
        // Continue animation if objects are still falling
        if (stillFalling) {
            animationFrameId = requestAnimationFrame(updatePhysics);
        } else {
            animationFrameId = null;
        }
    }
    
    // Tolerance for collision detection
    const tolerance = 5;
    
    // Add a reset button functionality
    function resetObjects() {
        // Reset object A
        objectA.style.position = 'absolute';
        objectA.style.top = '-70px';
        objectA.style.left = '20px';
        objectA.style.width = initialSizes.objectA.width + 'px';
        objectA.style.height = initialSizes.objectA.height + 'px';
        
        // Reset object B
        objectB.style.position = 'absolute';
        objectB.style.top = '-70px';
        objectB.style.right = '40%';
        objectB.style.width = initialSizes.objectB.width + 'px';
        objectB.style.height = initialSizes.objectB.height + 'px';
        
        // Move objects back to the base if they're not there
        if (objectA.parentElement !== objectBase) {
            objectBase.appendChild(objectA);
        }
        
        if (objectB.parentElement !== objectBase) {
            objectBase.appendChild(objectB);
        }
        
        // Reset inputs to initial values
        massInputA.value = 2;
        volumeInputA.value = 2;
        massInputB.value = 10;
        volumeInputB.value = 5;
        
        // Update properties
        updateObjectProperties();
    }
    
    // Add a reset button to the simulation
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reiniciar';
    resetButton.className = 'reset-button';
    resetButton.addEventListener('click', resetObjects);
    simulationContent.appendChild(resetButton);
    
    // Add some styles for the reset button
    const style = document.createElement('style');
    style.textContent = `
        .reset-button {
            position: absolute;
            bottom: 20px;
            left: 20px;
            padding: 8px 16px;
            background-color: #3F80CE;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            z-index: 100;
        }
        .reset-button:hover {
            background-color: #2c5c9c;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize object properties
    updateObjectProperties();
});