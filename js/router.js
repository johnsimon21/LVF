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
    "/simulations/grade_10/mru": "/pages/simulations/grade_10/mru.html",
    "/simulations/grade_10/mruv": "/pages/simulations/grade_10/mruv.html",
    "/simulations/grade_11/mcu": "/pages/simulations/grade_11/mcu.html",
    "/simulations/grade_11/mcuv": "/pages/simulations/grade_11/mcuv.html",
    "/simulations/grade_12/mhs": "/pages/simulations/grade_12/mhs.html"
};
const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
