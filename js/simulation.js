window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const grade = parseInt(urlParams.get('grade')) || 10;

    // Switch to correct grade
    switchGrade(grade);

    // Get first unit and topic from gradeContent
    const firstUnit = gradeContent[grade].units[0].id;
    const firstTopic = gradeContent[grade].topics[firstUnit][0].id;

    // Load first simulation
    loadSimulation(grade, firstTopic, firstUnit);
}


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
    const guidelineContent = document.querySelector('#guideline-content');

    // Remove active class from all topics
    document.querySelectorAll('.topic').forEach(topic => {
        topic.classList.remove('active');
    });

    // Add active class to selected topic
    const selectedTopic = document.querySelector(`.topic[onclick*="${simulationType}"]`);
    if (selectedTopic) {
        selectedTopic.classList.add('active');
    }

    // Find the topic description from gradeContent
    const topic = gradeContent[grade].topics[category].find(t => t.id === simulationType);

    // Update simulation frame source
    simulationFrame.src = `/pages/simulations/grade_${grade}/${category}/${simulationType}.html`;

    // Update guideline title and content
    guidelineTitle.textContent = topic.title;
    guidelineContent.innerHTML = `<p>${topic.description}</p>`;
}

function getSimulationTitle(type) {
    const titles = {
        // Grade 10
        'uniform_motion': 'Movimento Retilíneo Uniforme (MRU)',
        'accelerated_motion': 'Movimento Retilíneo Uniforme Variado (MRUV)',
        'circular_motion': 'Movimento Circular Uniforme (MCU)',
        'accelerated_circular': 'Movimento Circular Uniformemente Variado (MCUV)',
        'horizontal_launch': 'Lançamento Horizontal',
        'oblique_launch': 'Lançamento Obliquo',
        'rope_tension': 'Força de Tensão em Cordas',
        'inclined_plane': 'Plano Inclinado',
        'newton_second': '2ª Lei de Newton',
        'newton_third': '3ª Lei de Newton',
        'pulley_tension': 'Força de Tensão Com Polias',
        'kinetic_energy': 'Energia Cinética',
        'potential_energy': 'Energia Potencial',
        'mechanical_energy': 'Energia Mecânica',
        'elastic_energy': 'Energia Potencial Elástica',
        'simple_machines': 'Máquinas Simples',

        // Grade 11
        'linear_expansion': 'Dilatação Linear',
        'surface_expansion': 'Dilatação Superficial',
        'volume_expansion': 'Dilatação Volumétrica',
        'density': 'Densidade',
        'hydraulic_press': 'Princípio de Pascal e Prensa Hidráulica',
        'flat_mirrors': 'Espelhos planos',

        // Grade 12
        'simple_harmonic': 'Movimento Harmônico Simples',
        'waves': 'Ondas',
        'collisions': 'Colisões',
        'gravitation': 'Gravitação',
        'conservation': 'Conservação de Energia',
        'dissipation': 'Dissipação de Energia',
        'elasticity': 'Elasticidade',
        'fluids': 'Fluidos'
    };
    return titles[type] || 'Simulação';
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
                {
                    id: 'uniform_motion',
                    title: 'Movimento Retilíneo Uniforme (MRU)',
                    description: 'O Movimento Retilíneo Uniforme (MRU) é caracterizado por uma trajetória em linha reta com velocidade constante. A aceleração é nula e a distância percorrida é diretamente proporcional ao tempo. A equação fundamental é: S = S0 + v.t'
                },
                {
                    id: 'accelerated_motion',
                    title: 'Movimento Retilíneo Uniformemente Variado (MRUV)',
                    description: 'No MRUV, o movimento ocorre em linha reta com aceleração constante. A velocidade varia uniformemente com o tempo. As equações principais são: v = v0 + a.t e S = S0 + v0.t + (a.t²)/2'
                },
                {
                    id: 'circular_motion',
                    title: 'Movimento Circular Uniforme (MCU)',
                    description: 'O MCU é um movimento periódico onde um objeto descreve uma trajetória circular com velocidade angular constante. Possui aceleração centrípeta que muda apenas a direção do movimento. Principais conceitos: período, frequência e velocidade angular'
                },
                {
                    id: 'accelerated_circular',
                    title: 'Movimento Circular Uniformemente Variado (MCUV)',
                    description: 'No MCUV, além da aceleração centrípeta, existe uma aceleração tangencial constante que altera o módulo da velocidade angular. A velocidade angular varia uniformemente com o tempo'
                },
                {
                    id: 'horizontal_launch',
                    title: 'Lançamento Horizontal',
                    description: 'No lançamento horizontal, um objeto é lançado paralelamente ao solo com velocidade inicial horizontal. O movimento pode ser analisado em duas componentes: horizontal (MRU) e vertical (MRUV devido à gravidade)'
                },
                {
                    id: 'oblique_launch',
                    title: 'Lançamento Oblíquo',
                    description: 'O lançamento oblíquo ocorre quando um objeto é arremessado com uma velocidade inicial que forma um ângulo com a horizontal. A trajetória é parabólica, combinando movimentos horizontal (MRU) e vertical (MRUV)'
                }
            ],
            dynamics: [
                {
                    id: 'rope_tension',
                    title: 'Força de Tensão em Cordas',
                    description: 'A tensão é uma força que atua ao longo de cordas, cabos ou fios. Em uma corda ideal (massa desprezível e inextensível), a tensão é igual em todos os pontos e transmite-se integralmente ao longo da corda'
                },
                {
                    id: 'inclined_plane',
                    title: 'Plano Inclinado',
                    description: '<h4>DESCRIÇÃO DA SIMULAÇÃO:</h4> <p>Um plano inclinado é uma superfície plana que forma um ângulo com a horizontal. É usado para analisar o movimento de objetos em inclinações, facilitando a compreensão de forças e acelerações.</p>'
                },  
                {
                    id: 'newton_second',
                    title: '2ª Lei de Newton ou Lei de Causa e Efeito',
                    description: 'A força resultante que atua sobre um corpo é diretamente proporcional à aceleração adquirida por ele. F = m.a, onde F é a força resultante, m é a massa do corpo e a é a aceleração'
                },
                {
                    id: 'newton_third',
                    title: '3ª Lei de Newton ou Lei de Ação e Reação',
                    description: 'Para toda força de ação existe uma força de reação, de mesma intensidade e direção, mas em sentido contrário. Estas forças sempre atuam em corpos diferentes'
                },
                {
                    id: 'pulley_tension',
                    title: 'Força de Tensão Com Polias',
                    description: 'As polias são máquinas simples que permitem mudar a direção de aplicação de forças. Em sistemas com polias ideais, a tensão na corda é a mesma em todos os segmentos'
                }
            ],
            energy: [
                {
                    id: 'kinetic_energy',
                    title: 'Energia Cinética',
                    description: 'A energia cinética é a energia associada ao movimento dos corpos. É calculada pela fórmula Ec = (m.v²)/2, onde m é a massa e v é a velocidade do corpo'
                },
                {
                    id: 'potential_energy',
                    title: 'Energia Potencial',
                    description: '<p>Na simulação podemos ver a tela inicial da simulação Queda Livre. Essa simulação permite o estudo do movimento dequeda livre para alturas de até 100 cm, compatível com equipamentos normalmente utilizados em laboratórios de ensino de física. Há 3 opções de aceleração da gravidade (Terra, Lua e Marte). A altura de queda pode ser regulada pela movimentação de um cursor e pode ser medida com uma régua. Um cronômetro automático, é ligado quando o corpo é liberado e para quando o corpo toca sua superfície. O tempo é registrado em segundos com três casas decimais. Há 3 opções de massas para verificação da influência da massa no tempo de queda.</p><p><h4>PROCEDIMENTO: Estudo do movimento de queda livre na Terra.</h4></p> <ul><li>1 Ajuste a altura em cm, como indicado na caixa de seleção de alturas. Verifique com a régua. </li><li>2 Escolha a massa em gramas.</li><li>3 Pressione “Liberar” e anote o tempo de queda.</li><li>4 Repita o procedimento para as outras alturas indicadas na Tabela.</li></ul>'
                },
                {
                    id: 'mechanical_energy',
                    title: 'Energia Mecânica',
                    description: 'A energia mecânica é a soma das energias cinética e potencial de um sistema. Em sistemas conservativos, a energia mecânica total permanece constante'
                },
                {
                    id: 'elastic_energy',
                    title: 'Energia Potencial Elástica',
                    description: 'A energia potencial elástica é armazenada em objetos deformados elasticamente, como molas. É calculada por Ee = (k.x²)/2, onde k é a constante elástica e x é a deformação'
                }
            ],
            statics: [
                {
                    id: 'simple_machines',
                    title: 'Máquinas Simples',
                    description: 'Máquinas simples são dispositivos que modificam a intensidade ou direção de uma força para facilitar a realização de trabalho. Exemplos incluem alavancas, polias, plano inclinado e engrenagens'
                }
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
                {
                    id: 'linear_expansion',
                    title: 'Dilatação Linear',
                    description: 'A dilatação linear ocorre quando há variação em apenas uma dimensão do corpo. A variação do comprimento é diretamente proporcional ao comprimento inicial, à variação de temperatura e ao coeficiente de dilatação linear do material'
                },
                {
                    id: 'surface_expansion',
                    title: 'Dilatação Superficial',
                    description: 'Na dilatação superficial, há variação em duas dimensões do corpo. O coeficiente de dilatação superficial é aproximadamente o dobro do coeficiente de dilatação linear'
                },
                {
                    id: 'volume_expansion',
                    title: 'Dilatação Volumétrica',
                    description: 'A dilatação volumétrica envolve a variação nas três dimensões do corpo. O coeficiente de dilatação volumétrica é aproximadamente o triplo do coeficiente de dilatação linear'
                }
            ],
            fluid_mechanics: [
                {
                    id: 'density',
                    title: 'Densidade',
                    description: 'A densidade é a relação entre a massa e o volume de um corpo. Em fluidos, a densidade pode variar com a temperatura e a pressão. É fundamental para entender o comportamento dos fluidos e o princípio de Arquimedes'
                },
                {
                    id: 'hydraulic_press',
                    title: 'Princípio de Pascal e Prensa Hidráulica',
                    description: 'O Princípio de Pascal estabelece que a pressão aplicada a um fluido em repouso transmite-se integralmente a todos os pontos do fluido. A prensa hidráulica utiliza este princípio para multiplicar forças'
                }
            ],
            optics: [
                {
                    id: 'flat_mirrors',
                    title: 'Espelhos planos',
                    description: 'Espelhos planos formam imagens virtuais, direitas e simétricas ao objeto. A distância da imagem ao espelho é igual à distância do objeto ao espelho. São fundamentais para entender reflexão da luz'
                }
            ]
        }
    },
    12: {
        units: [
            { id: 'mechanics', title: 'Mecânica Avançada' },
            { id: 'waves', title: 'Ondas e Oscilações' },
            { id: 'energy_conservation', title: 'Conservação de Energia' }
        ],
        topics: {
            mechanics: [
                {
                    id: 'simple_harmonic',
                    title: 'Movimento Harmônico Simples',
                    description: 'O MHS é um movimento oscilatório periódico onde a força restauradora é proporcional ao deslocamento. Exemplos incluem pêndulos simples e sistemas massa-mola'
                },
                {
                    id: 'collisions',
                    title: 'Colisões',
                    description: 'As colisões podem ser elásticas (conservação da energia cinética) ou inelásticas. Em todas as colisões, o momento linear total do sistema se conserva'
                },
                {
                    id: 'gravitation',
                    title: 'Gravitação',
                    description: 'A Lei da Gravitação Universal de Newton descreve a força de atração entre massas. É fundamental para entender o movimento dos planetas e satélites'
                }
            ],
            waves: [
                {
                    id: 'waves',
                    title: 'Ondas',
                    description: 'Ondas são perturbações que se propagam transportando energia sem transporte de matéria. Podem ser classificadas como mecânicas ou eletromagnéticas, transversais ou longitudinais'
                }
            ],
            energy_conservation: [
                {
                    id: 'conservation',
                    title: 'Conservação de Energia',
                    description: 'O princípio da conservação da energia estabelece que a energia não pode ser criada nem destruída, apenas transformada de uma forma para outra'
                },
                {
                    id: 'dissipation',
                    title: 'Dissipação de Energia',
                    description: 'A dissipação de energia ocorre quando parte da energia mecânica é convertida em formas não úteis, como calor devido ao atrito'
                },
                {
                    id: 'elasticity',
                    title: 'Elasticidade',
                    description: 'A elasticidade é a propriedade dos materiais de retornarem à sua forma original após uma deformação. A Lei de Hooke descreve o comportamento de materiais elásticos'
                },
                {
                    id: 'fluids',
                    title: 'Fluidos',
                    description: 'O estudo avançado de fluidos inclui dinâmica dos fluidos, equação de Bernoulli, viscosidade e turbulência. Fundamental para entender o comportamento de líquidos e gases em movimento'
                }
            ]
        }
    }
}

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

    const firstDropdownArrow = document.querySelector('#dropdownArrow1');
    const firstTopicList = document.querySelector('#topicList1');

    if (firstDropdownArrow && firstTopicList) {
        firstDropdownArrow.classList.add('dropdown-arrow-open');
        firstTopicList.style.display = 'block';
    }
}

function updateGuideline(topicId) {
    const topic = findTopicById(topicId);
    document.getElementById('guideline-title').textContent = topic.title;
    document.getElementById('guideline-content').innerHTML = `<p>${topic.description}</p>`;
}

switchGrade(10);