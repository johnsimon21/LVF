const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/pages/404.html",
    "/": "/pages/index.html",
    "/about": "/pages/about.html",
    "/lorem": "/pages/lorem.html",
    
    // Grade 10 routes
    // Kinematics
    "/simulations/grade_10/kinematics/uniform_motion": "/scenes/uniform_motion_scene.html",
    "/simulations/grade_10/kinematics/accelerated_motion": "/scenes/accelerated_motion_scene.html",

    "/simulations/grade_10/kinematics/circular_motion": "/pages/simulations/grade_10/kinematics/circular_motion.html",
    "/simulations/grade_10/kinematics/accelerated_circular": "/pages/simulations/grade_10/kinematics/accelerated_circular.html",
    "/simulations/grade_10/kinematics/horizontal_launch": "/pages/simulations/grade_10/kinematics/horizontal_launch.html",
    "/simulations/grade_10/kinematics/oblique_launch": "/pages/simulations/grade_10/kinematics/oblique_launch.html",
    
    // Dynamics
    "/simulations/grade_10/dynamics/rope_tension": "/pages/simulations/grade_10/dynamics/rope_tension.html",
    "/simulations/grade_10/dynamics/inclined_plane": "/pages/simulations/grade_10/dynamics/inclined_plane.html",
    "/simulations/grade_10/dynamics/newton_second": "/pages/simulations/grade_10/dynamics/newton_second.html",
    "/simulations/grade_10/dynamics/newton_third": "/pages/simulations/grade_10/dynamics/newton_third.html",
    "/simulations/grade_10/dynamics/pulley_tension": "/pages/simulations/grade_10/dynamics/pulley_tension.html",
    
    // Energy
    "/simulations/grade_10/energy/kinetic_energy": "/pages/simulations/grade_10/energy/kinetic_energy.html",
    "/simulations/grade_10/energy/potential_energy": "/pages/simulations/grade_10/energy/potential_energy.html",
    "/simulations/grade_10/energy/mechanical_energy": "/pages/simulations/grade_10/energy/mechanical_energy.html",
    "/simulations/grade_10/energy/elastic_energy": "/pages/simulations/grade_10/energy/elastic_energy.html",
    
    // Statics
    "/simulations/grade_10/statics/simple_machines": "/pages/simulations/grade_10/statics/simple_machines.html",

    // Grade 11 routes
    // Thermology
    "/simulations/grade_11/thermology/linear_expansion": "/pages/simulations/grade_11/thermology/linear_expansion.html",
    "/simulations/grade_11/thermology/surface_expansion": "/pages/simulations/grade_11/thermology/surface_expansion.html",
    "/simulations/grade_11/thermology/volume_expansion": "/pages/simulations/grade_11/thermology/volume_expansion.html",
    
    // Fluid Mechanics
    "/simulations/grade_11/fluid_mechanics/density": "/pages/simulations/grade_11/fluid_mechanics/density.html",
    "/simulations/grade_11/fluid_mechanics/hydraulic_press": "/pages/simulations/grade_11/fluid_mechanics/hydraulic_press.html",
    
    // Optics
    "/simulations/grade_11/optics/flat_mirrors": "/pages/simulations/grade_11/optics/flat_mirrors.html",

    // Grade 12 routes
    // Waves
    "/simulations/grade_12/waves/simple_harmonic": "/pages/simulations/grade_12/waves/simple_harmonic.html",
    "/simulations/grade_12/waves/waves": "/pages/simulations/grade_12/waves/waves.html",
    
    // Advanced Dynamics
    "/simulations/grade_12/advanced_dynamics/collisions": "/pages/simulations/grade_12/advanced_dynamics/collisions.html",
    "/simulations/grade_12/advanced_dynamics/gravitation": "/pages/simulations/grade_12/advanced_dynamics/gravitation.html",
    
    // Energy Conservation
    "/simulations/grade_12/energy_conservation/conservation": "/pages/simulations/grade_12/energy_conservation/conservation.html",
    "/simulations/grade_12/energy_conservation/dissipation": "/pages/simulations/grade_12/energy_conservation/dissipation.html",
    
    // Fluid Mechanics
    "/simulations/grade_12/fluid_mechanics/elasticity": "/pages/simulations/grade_12/fluid_mechanics/elasticity.html",
    "/simulations/grade_12/fluid_mechanics/fluids": "/pages/simulations/grade_12/fluid_mechanics/fluids.html"
};


const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path];
    
    if (route && route.includes('/scenes/')) {
        // Load scene into iframe
        document.getElementById('simulation-frame').src = route;
    } else {
        // Handle regular page loads
        const html = await fetch(route || routes[404]).then((data) => data.text());
        document.getElementById("main-page").innerHTML = html;
    }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
