document.addEventListener('DOMContentLoaded', function() {
    // Get the draggable objects
    const objectA = document.querySelector('.object-a');
    const objectB = document.querySelector('.object-b');
    const simulationContent = document.querySelector('.simulation-content');
    const objectBase = document.querySelector('.object-base');
    const aquarium = document.querySelector('.aquarium');
    const water = document.querySelector('.water');
    
    // Variables to track dragging state
    let isDragging = false;
    let currentObject = null;
    let offsetX, offsetY;
    
    // Physics variables
    const gravity = 0.5; // Gravity acceleration
    const fallingObjects = new Set();
    let animationFrameId = null;
    
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
        
        let stillFalling = false;
        
        fallingObjects.forEach(obj => {
            const objRect = obj.getBoundingClientRect();
            
            // Convert to relative position within simulation-content
            const objTop = objRect.top - contentRect.top;
            const objLeft = objRect.left - contentRect.left;
            const objBottom = objTop + objRect.height;
            
            // Get object type to determine if it floats
            const objectType = obj.classList.contains('object-a') ? 
                document.querySelector('.object-type-a + select').value : 
                document.querySelector('.object-type-b + select').value;
            
            // Check if object is above water
            const aboveWater = (
                objRect.right > waterRect.left &&
                objRect.left < waterRect.right &&
                objRect.bottom > waterRect.top - tolerance &&
                objRect.bottom < waterRect.top + tolerance
            );
            
            // Check if object is supported by another object
            const objectSupport = isObjectSupported(obj, allObjects);
            
            // Determine floor level based on support conditions
            let floorLevel = null;
            
            // 1. Check if supported by another object
            if (objectSupport.supported) {
                floorLevel = objectSupport.supportLevel - contentRect.top - objRect.height;
            } 
            // 2. Check if floating on water (only wood floats)
            else if (aboveWater && objectType === 'wood') {
                floorLevel = waterRect.top - contentRect.top - objRect.height;
            } 
            // 3. Default to object-base
            else {
                floorLevel = baseRect.top - contentRect.top - objRect.height;
            }
            
            // Apply gravity if not at floor level
            if (objBottom < floorLevel - 1) { // -1 for tolerance
                // Apply gravity
                obj.velocity += gravity;
                
                // Apply water resistance if in water
                if (objRect.top > waterRect.top) {
                    obj.velocity *= 0.9; // Stronger damping in water
                }
                
                // Update position
                const newTop = objTop + obj.velocity;
                obj.style.top = newTop + 'px';
                
                stillFalling = true;
            } else {
                // Object has reached the floor or support
                obj.style.top = floorLevel + 'px';
                obj.velocity = 0;
                fallingObjects.delete(obj);
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
});
