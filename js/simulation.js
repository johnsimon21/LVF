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

function loadSimulation(grade, simulationType, category) {
    const simulationFrame = document.querySelector('#simulation-frame');
    const guidelineTitle = document.querySelector('#guideline-title');

    // Use the existing pages/simulations path structure
    simulationFrame.src = `/pages/simulations/grade_${grade}/${category}/${simulationType}.html`;
    guidelineTitle.textContent = getSimulationTitle(simulationType);
}
function getSimulationTitle(type) {
    const titles = {
        'uniform_motion': 'Movimento Retilíneo Uniforme (MRU)',
        'accelerated_motion': 'Movimento Retilíneo Uniforme Variado (MRUV)',
        'circular_motion': 'Movimento Circular Uniforme (MCU)',
        'accelerated_circular': 'Movimento Circular Uniformemente Variado (MCUV)'
    };
    return titles[type];
}

const gradeContent = {
    10: {
        units: [
            { id: 'kinematics', title: 'Cinemática' },
            { id: 'dynamics', title: 'Dinâmica' },
            { id: 'energy', title: 'Energia e Trabalho' },
            { id: 'statics', title: 'Estática' }
        ],
        topics: {
            kinematics: [
                { id: 'uniform_motion', title: 'Movimento Retilíneo Uniforme (MRU)' },
                { id: 'accelerated_motion', title: 'Movimento Retilíneo Uniformemente Variado (MRUV)' },
                { id: 'circular_motion', title: 'Movimento Circular Uniforme (MCU)' },
                { id: 'accelerated_circular', title: 'Movimento Circular Uniformemente Variado (MCUV)' },
                { id: 'horizontal_launch', title: 'Lançamento Horizontal' },
                { id: 'oblique_launch', title: 'Lançamento Obliquo' },
            ],
            dynamics: [
                { id: 'rope_tension', title: 'Força de Tensão em Cordas' },
                { id: 'inclined_plane', title: 'Plano Inclinado' },
                { id: 'newton_second', title: '2ª Lei de Newton ou Lei de Causa e Efeito' },
                { id: 'newton_third', title: '3ª Lei de Newton ou Lei de Ação e Reação' },
                { id: 'pulley_tension', title: 'Força de Tensão Com Polias' },
            ],
            energy: [
                { id: 'kinetic_energy', title: 'Energia Cinética' },
                { id: 'potential_energy', title: 'Energia Potencial' },
                { id: 'mechanical_energy', title: 'Energia Mecânica' },
                { id: 'elastic_energy', title: 'Energia Potencial Elástica' },
            ],
            statics: [
                { id: 'simple_machines', title: 'Máquinas Simples' },
            ]
        }
    },
    11: {
        units: [
            { id: 'thermology', title: 'Termologia' },
            { id: 'fluid_mechanics', title: 'Mecânica dos Fluidos' },
            { id: 'optics', title: 'Óptica' },
        ],
        topics: {
            thermology: [
                { id: 'linear_expansion', title: 'Dilatação Linear' },
                { id: 'surface_expansion', title: 'Dilatação Superficial' },
                { id: 'volume_expansion', title: 'Dilatação Volumétrica' },
            ],
            fluid_mechanics: [
                { id: 'density', title: 'Densidade' },
                { id: 'hydraulic_press', title: 'Princípio de Pascal e Prensa Hidráulica' }
            ],
            optics: [
                { id: 'flat_mirrors', title: 'Espelhos planos' },
            ]
        }
    },
    12: {
        units: [
            { id: 'waves', title: 'Oscilações e Ondas' },
            { id: 'advanced_dynamics', title: 'Dinâmica Avançada' },
            { id: 'energy_conservation', title: 'Conservação de Energia' },
            { id: 'fluid_mechanics', title: 'Mecânica dos Fluidos' }
        ],
        topics: {
            waves: [
                { id: 'simple_harmonic', title: 'Movimento Harmônico Simples' },
                { id: 'waves', title: 'Ondas' }
            ],
            advanced_dynamics: [
                { id: 'collisions', title: 'Colisões' },
                { id: 'gravitation', title: 'Gravitação' }
            ],
            energy_conservation: [
                { id: 'conservation', title: 'Conservação de Energia' },
                { id: 'dissipation', title: 'Dissipação de Energia' }
            ],
            fluid_mechanics: [
                { id: 'elasticity', title: 'Elasticidade' },
                { id: 'fluids', title: 'Fluidos' }
            ]
        }
    }
};

function switchGrade(grade) {
    document.querySelectorAll('._grade').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.grade == grade) {
            el.classList.add('active');
        }
    });

    const content = gradeContent[grade];
    const unitsGroup = document.querySelector('.units-group');

    unitsGroup.innerHTML = content.units.map((unit, index) => `
        <div>
            <div onclick="handleTopicDropdown('#dropdownArrow${index + 1}', '#topicList${index + 1}')" class="unit">
                <span>${unit.title}</span>
                <img src="../assets/images/dropdown_arrow.svg" alt="dropdown icon" id="dropdownArrow${index + 1}" class="dropdown-arrow"/>
            </div>
            <ul id="topicList${index + 1}" class="topic-list">
                ${content.topics[unit.id].map(topic =>
        `<li class="topic" onclick="loadSimulation(${grade}, '${topic.id}', '${unit.id}')">${topic.title}</li>`
    ).join('')}
            </ul>
        </div>
    `).join('');
}

switchGrade(10);