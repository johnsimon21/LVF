function handleSidebar() {
    const sidebar = document.querySelector('#sidebar')
    const iconClose = document.querySelector('.icon-close')
    const iconHumburger = document.querySelector('.humburger_svg')

    sidebar.classList.toggle('close-sidebar')

    if (iconClose.classList.contains('show')) {
        iconClose.classList.remove('show')
        iconClose.classList.add('hide')

        iconHumburger.classList.remove('hide')
        iconHumburger.classList.add('show')
    } else {
        iconClose.classList.remove('hide')
        iconClose.classList.add('show')

        iconHumburger.classList.remove('show')
        iconHumburger.classList.add('hide')
    }

}

function handleTopicDropdown(dropdown_arrow_selector, topic_list_selector) {
    // Use the passed selectors to query the elements
    const dropdown_arrow = document.querySelector(dropdown_arrow_selector);
    const topic_list = document.querySelector(topic_list_selector);
    
    // Select all dropdown arrows and topic lists
    const all_dropdown_arrows = document.querySelectorAll(".dropdown-arrow");
    const all_topic_lists = document.querySelectorAll(".topic-list");

    if (!dropdown_arrow || !topic_list) {
        console.error('Dropdown arrow or topic list element not found!');
        return;
    }

    // Toggle the arrow's open class
    if (!dropdown_arrow.classList.contains('dropdown-arrow-open')) {
        // Close all other dropdowns
        all_dropdown_arrows.forEach(arrow => arrow.classList.remove("dropdown-arrow-open"));
        all_topic_lists.forEach(list => (list.style.display = "none"));


        dropdown_arrow.classList.add('dropdown-arrow-open');
        topic_list.style.display = 'block'; // Show the topic list
    } else {
        dropdown_arrow.classList.remove('dropdown-arrow-open');
        topic_list.style.display = 'none'; // Hide the topic list
    }


}

function handleGuidelineCollapse() {
    const guidelineContent = document.querySelector('#guideline-content');
    const collapseIcon = document.querySelector('.guideline-icon-collapse');
    
    guidelineContent.classList.toggle('collapsed');
    collapseIcon.classList.toggle('rotate');
}

function loadSimulation(grade, simulationType) {
    const scene = document.querySelector('#scene');
    const guidelineTitle = document.querySelector('#guideline-title');
    
    fetch(`/pages/simulations/grade_${grade}/${simulationType}.html`)
        .then(response => response.text())
        .then(html => {
            scene.innerHTML = html;
            guidelineTitle.textContent = getSimulationTitle(simulationType);
            window.history.pushState({}, "", `/simulations/grade_${grade}/${simulationType}`);
        });
}
function getSimulationTitle(type) {
    const titles = {
        'mru': 'Movimento Retilíneo Uniforme (MRU)',
        'mruv': 'Movimento Retilíneo Uniforme Variado (MRUV)',
        'mcu': 'Movimento Circular Uniforme (MCU)',
        'mcuv': 'Movimento Circular Uniformemente Variado (MCUV)'
    };
    return titles[type];
}

const gradeContent = {
    10: {
        units: [
            { id: 'cinematica', title: 'Cinemática Básica' },
            { id: 'dinamica', title: 'Dinâmica Fundamental' },
            { id: 'energia', title: 'Energia Mecânica' },
            { id: 'estatica', title: 'Estática Básica' }
        ],
        topics: {
            cinematica: [
                { id: 'mru', title: 'Movimento Retilíneo Uniforme (MRU)' },
                { id: 'mruv', title: 'Movimento Retilíneo Uniforme Variado (MRUV)' }
            ],
            dinamica: [
                { id: 'newton', title: 'Leis de Newton' },
                { id: 'forca', title: 'Força e Movimento' }
            ],
            energia: [
                { id: 'energia_cinetica', title: 'Energia Cinética' },
                { id: 'energia_potencial', title: 'Energia Potencial' }
            ],
            estatica: [
                { id: 'equilibrio', title: 'Equilíbrio' },
                { id: 'momento', title: 'Momento' }
            ]
        }
    },
    11: {
        units: [
            { id: 'cinematica', title: 'Cinemática Avançada' },
            { id: 'dinamica', title: 'Dinâmica Rotacional' },
            { id: 'energia', title: 'Trabalho e Energia' },
            { id: 'estatica', title: 'Estática Rotacional' }
        ],
        topics: {
            cinematica: [
                { id: 'mcu', title: 'Movimento Circular Uniforme (MCU)' },
                { id: 'mcuv', title: 'Movimento Circular Uniformemente Variado (MCUV)' }
            ],
            dinamica: [
                { id: 'impulso', title: 'Impulso' },
                { id: 'quantidade_movimento', title: 'Quantidade de Movimento' }
            ],
            energia: [
                { id: 'trabalho', title: 'Trabalho' },
                { id: 'potencia', title: 'Potência' }
            ],
            estatica: [
                { id: 'centro_massa', title: 'Centro de Massa' },
                { id: 'torque', title: 'Torque' }
            ]
        }
    },
    12: {
        units: [
            { id: 'cinematica', title: 'Oscilações e Ondas' },
            { id: 'dinamica', title: 'Dinâmica Avançada' },
            { id: 'energia', title: 'Conservação de Energia' },
            { id: 'estatica', title: 'Mecânica dos Fluidos' }
        ],
        topics: {
            cinematica: [
                { id: 'mhs', title: 'Movimento Harmônico Simples' },
                { id: 'ondas', title: 'Ondas' }
            ],
            dinamica: [
                { id: 'colisoes', title: 'Colisões' },
                { id: 'gravitacao', title: 'Gravitação' }
            ],
            energia: [
                { id: 'conservacao', title: 'Conservação de Energia' },
                { id: 'dissipacao', title: 'Dissipação de Energia' }
            ],
            estatica: [
                { id: 'elasticidade', title: 'Elasticidade' },
                { id: 'fluidos', title: 'Fluidos' }
            ]
        }
    }
};

function switchGrade(grade) {
    // Update active grade visual state
    document.querySelectorAll('._grade').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.grade == grade) {
            el.classList.add('active');
        }
    });

    const content = gradeContent[grade];
    const unitsGroup = document.querySelector('.units-group');
    
    // Generate new units and topics HTML
    unitsGroup.innerHTML = content.units.map((unit, index) => `
        <div>
            <div onclick="handleTopicDropdown('#dropdownArrow${index + 1}', '#topicList${index + 1}')" class="unit">
                <span>${unit.title}</span>
                <img src="../assets/images/dropdown_arrow.svg" alt="dropdown icon" id="dropdownArrow${index + 1}" class="dropdown-arrow"/>
            </div>
            <ul id="topicList${index + 1}" class="topic-list">
                ${content.topics[unit.id].map(topic => 
                    `<li class="topic" onclick="loadSimulation(${grade}, '${topic.id}')">${topic.title}</li>`
                ).join('')}
            </ul>
        </div>
    `).join('');
}

// Set 10th grade as default active on page load
switchGrade(10);
