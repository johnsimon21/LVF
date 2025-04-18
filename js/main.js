function handleToggleDropdown(selector) {
  const dropdown = document.querySelector(selector);

  if (dropdown) {
    dropdown.classList.toggle('is-active');
    console.log(`Toggled dropdown for: ${selector}`);
  } else {
    alert(`Dropdown with selector "${selector}" not found.`);
  }
}
function handleScreenChange() {
  const dropdown = document.querySelector('.dropdown');
  if (window.matchMedia('(min-width: 948px)').matches) {
    dropdown.classList.remove('is-active'); // Hide dropdown
    console.log('Dropdown hidden due to screen size.');
  }
}

function draggableGraphic() {
  var draggableElement = document.getElementById("draggable");

  draggableElement.onmousedown = function (event) {

    // Previne o comportamento padrão do navegador
    event.preventDefault();

    // Obtém a posição inicial do cursor
    let shiftX = event.clientX - draggableElement.getBoundingClientRect().left;
    let shiftY = event.clientY - draggableElement.getBoundingClientRect().top;

    // Mova o elemento para as novas coordenadas do cursor
    function moveAt(pageX, pageY) {
      draggableElement.style.left = pageX - shiftX + 'px';
      draggableElement.style.top = pageY - shiftY + 'px';
    }

    // Movemos o elemento para a posição inicial do cursor
    moveAt(event.pageX, event.pageY);

    // Move o elemento quando o mouse se move
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    // Adiciona o ouvinte de eventos de movimento do mouse
    document.addEventListener('mousemove', onMouseMove);

    // Solta o elemento quando o botão do mouse é liberado
    draggableElement.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      draggableElement.onmouseup = null;
    };
  };

  // Previne a ação padrão do arrastar e soltar do navegador
  draggableElement.ondragstart = function () {
    return false;
  };
}

function resizeAnimationCene() {
  document.getElementById('toggleFullscreen').addEventListener('click', function () {
    // const mainElement = document.querySelector('main');
    // const headerElement = document.getElementById('nav');
    // const sidebarElement = document.querySelector('.fixed-left');
    // const graphicElement = document.getElementById('draggable');
    // const controllersElement = document.getElementById('full-controllers');
    // const isFullscreen = mainElement.classList.toggle('fullscreen');

    //   if (isFullscreen) {
    //     this.textContent = 'Voltar ao Normal';
    //     headerElement.style.display = 'none';
    //     sidebarElement.style.display = 'none';
    //     controllersElement.classList.add("full-controllers")
    //     if (graphicElement !== null) {
    //       graphicElement.style.left = "10px";
    //       graphicElement.style.top = '90px';
    //     }
    //   } else {
    //     this.textContent = 'Tela Cheia';
    //     if (graphicElement !== null) {
    //       graphicElement.classList.add("draggable")
    //       graphicElement.style.left = "290px";
    //       graphicElement.style.top = '165px';
    //     }
    //     controllersElement.classList.remove("full-controllers")
    //     headerElement.style.display = 'flex';
    //     sidebarElement.style.display = 'block';
    //   }
  });

}

function sliderange() {
  const slider = document.getElementById('slider');
  const decreaseBtn = document.getElementById('decrease');
  const increaseBtn = document.getElementById('increase');
  const currentValue = document.getElementById('currentValue');

  const step = 10; // Step size
  const heatValues = ['100 J', '500 J', '1000 J', '2000 J'];

  decreaseBtn.addEventListener('click', () => {
    slider.value = Math.max(parseInt(slider.value) - step, slider.min);
    updateValue();
  });

  increaseBtn.addEventListener('click', () => {
    slider.value = Math.min(parseInt(slider.value) + step, slider.max);
    updateValue();
  });

  slider.addEventListener('input', updateValue);

  function updateValue() {
    const index = Math.floor(slider.value / 25); // Get index based on slider position
    currentValue.innerText = heatValues[index];
  }

  updateValue(); // Initialize the value on load
}

 // Mobile controls
 document.getElementById('toggle-sidebar-mobile').addEventListener('click', function() {
  handleSidebar();
});

document.getElementById('toggle-guideline-mobile').addEventListener('click', function() {
  handleGuidelineCollapse();
});

sliderange()
resizeAnimationCene()
draggableGraphic()


// Add event listener for resize events
window.addEventListener('resize', handleScreenChange);

handleScreenChange();