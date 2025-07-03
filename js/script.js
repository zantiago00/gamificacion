        // --- CONFIGURACIÓN GENERAL ---
        const screens = document.querySelectorAll('.screen');
        const progressBar = document.getElementById('progress-bar');
const scoreEl = document.getElementById("score");
const badgesEl = document.getElementById("badges");
let score = parseInt(localStorage.getItem("score") || "0");
const unlockedLevels = {
    'start-screen': true,
    'welcome-screen': true,
    'level-1': false,
    'level-2': false,
    'level-3': false
};

// --- SONIDOS ---
const clickSound = new Audio('https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3');
const startSound = new Audio('https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3');
const successSound = new Audio('https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3');
const failSound = new Audio('https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3');
const beepSound = new Audio('https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav');
clickSound.volume = 0.5;
startSound.volume = 0.5;
successSound.volume = 0.5;
failSound.volume = 0.5;
beepSound.volume = 0.5;

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function addAudioToButtons() {
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => playSound(clickSound));
    });
}
function updateScore(points){
    score += points;
    scoreEl.textContent = `Puntos: ${score}`;
    localStorage.setItem("score", score);
}
function awardBadge(){
    const badge = document.createElement("span");
    badge.textContent = "\ud83c\udfc6"; // trophy emoji
    badgesEl.appendChild(badge);
}
scoreEl.textContent = `Puntos: ${score}`;

        
        let currentScreen = 'start-screen';
        const totalLevels = 3;

        function showScreen(screenId) {
            const newScreen = document.getElementById(screenId);
            const current = document.querySelector('.screen.active');

            if (current && current !== newScreen) {
                current.classList.add('fade-exit');
                void current.offsetWidth;
                current.classList.add('fade-exit-active');
                current.addEventListener('transitionend', function handler() {
                    current.classList.remove('active', 'fade-exit', 'fade-exit-active');
                    current.removeEventListener('transitionend', handler);
                });
            }

            if (!newScreen.classList.contains('active')) {
                newScreen.classList.add('active', 'fade-enter');
                void newScreen.offsetWidth;
                newScreen.classList.add('fade-enter-active');
                newScreen.addEventListener('transitionend', function handler() {
                    newScreen.classList.remove('fade-enter', 'fade-enter-active');
                    newScreen.removeEventListener('transitionend', handler);
                });
            }

            currentScreen = screenId;
            updateProgressBar();
            updateNavigation();
            if (screenId === 'final-screen') {
                playSound(beepSound);
            }
        }
        
function updateProgressBar() {
    let progress = 0;
    if (currentScreen === 'level-1') progress = 0;
    if (currentScreen === 'level-2') progress = 33;
    if (currentScreen === 'level-3') progress = 66;
    if (currentScreen === 'final-screen') progress = 100;
    progressBar.style.width = `${progress}%`;
}

function updateNavigation() {
    document.querySelectorAll('.level-btn').forEach(btn => {
        const target = btn.dataset.target;
        if (unlockedLevels[target]) {
            btn.classList.remove('locked');
            btn.disabled = false;
        } else {
            btn.classList.add('locked');
            btn.disabled = true;
        }
        if (currentScreen === target) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (!unlockedLevels[target]) return;
        if (target === 'level-1') {
            initLevel1();
        }
        if (target === 'level-2') {
            initLevel2();
        }
        if (target === 'level-3') {
            initLevel3();
        }
        showScreen(target);
        playSound(startSound);
    });
});

document.getElementById('start-btn').addEventListener('click', () => {
    unlockedLevels['level-1'] = true;
    showScreen('level-1');
    initLevel1();
    playSound(startSound);
});
document.getElementById('begin-btn').addEventListener('click', () => {
    showScreen('welcome-screen');
    playSound(startSound);
});

        // --- LÓGICA DEL NIVEL 1: UNIR CONCEPTOS ---
        const level1Data = {
            concepts: [
                { id: 'c1', text: 'Storytelling Digital' },
                { id: 'c2', text: 'Interacción' },
                { id: 'c3', text: 'Multimedia' }
            ],
            definitions: [
                { id: 'd1', text: 'El arte de contar historias usando herramientas digitales y elementos multimedia.', match: 'c1' },
                { id: 'd2', text: 'La capacidad del usuario para influir en la narrativa o explorarla de forma no lineal.', match: 'c2' },
                { id: 'd3', text: 'El uso combinado de texto, imágenes, audio y video.', match: 'c3' }
            ]
        };

        let selectedConcept = null;
        let lines = [];
        let connections = {};

let level1Attempts = 0;
let level2Attempts = 0;
        function initLevel1() {
            const conceptsContainer = document.getElementById('concepts');
    level1Attempts = 0;
            const definitionsContainer = document.getElementById('definitions');
            conceptsContainer.innerHTML = '';
            definitionsContainer.innerHTML = '';
            
            const shuffledDefinitions = [...level1Data.definitions].sort(() => Math.random() - 0.5);

            level1Data.concepts.forEach(concept => {
                conceptsContainer.innerHTML += `<div id="${concept.id}" class="selectable p-4 border-2 border-gray-300 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400">${concept.text}</div>`;
            });

            shuffledDefinitions.forEach(def => {
                definitionsContainer.innerHTML += `<div id="${def.id}" data-match="${def.match}" class="selectable p-4 border-2 border-gray-300 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400">${def.text}</div>`;
            });
            
            addLevel1EventListeners();
        }

        function addLevel1EventListeners() {
            document.querySelectorAll('#level-1 .selectable').forEach(el => {
                el.addEventListener('click', handleSelection);
            });
        }
        
        function handleSelection(event) {
            const clickedElement = event.currentTarget;
            if (Object.values(connections).includes(clickedElement.id) || connections[clickedElement.id]) return;

            playSound(clickSound);

            if (clickedElement.parentElement.id === 'concepts') {
                if (selectedConcept) selectedConcept.classList.remove('selected');
                selectedConcept = clickedElement;
                selectedConcept.classList.add('selected');
            } else if (clickedElement.parentElement.id === 'definitions' && selectedConcept) {
                const conceptId = selectedConcept.id;
                const definitionId = clickedElement.id;
                connections[conceptId] = definitionId;
                
                const color = (clickedElement.dataset.match === conceptId) ? '#22c55e' : '#ef4444';
                const line = new LeaderLine(selectedConcept, clickedElement, { color: color, size: 4, path: 'fluid', endPlug: 'arrow1' });
                lines.push(line);

                selectedConcept.classList.remove('selected');
                selectedConcept = null;
                checkLevel1Completion();
            }
        }
        
        function checkLevel1Completion() {
            const feedbackEl = document.getElementById('level1-feedback');
            if (Object.keys(connections).length === level1Data.concepts.length) {
                const isCorrect = Object.entries(connections).every(([conceptId, definitionId]) => {
                    const definitionEl = document.getElementById(definitionId);
                    return definitionEl.dataset.match === conceptId;
                });

                if (isCorrect) {
                    feedbackEl.textContent = "¡Excelente! Todas las conexiones son correctas.";
                    feedbackEl.className = 'mt-4 text-center font-medium text-green-600';
                    document.getElementById('level1-continue-btn').disabled = false;
                    updateScore(50);
                    playSound(successSound);
                } else {
                    level1Attempts++;
                    feedbackEl.textContent = "Algunas conexiones son incorrectas. ¡Inténtalo de nuevo!";
                    if (level1Attempts >= 2) {
                        feedbackEl.textContent += " Pista: conecta cada concepto con su definición correspondiente.";
                    }
                    feedbackEl.className = 'mt-4 text-center font-medium text-red-600';
                    playSound(failSound);
                    setTimeout(resetLevel1, 1500);
                }
            }
        }
        
        // Función para limpiar solo las líneas
        function cleanupLevel1Lines() {
            lines.forEach(line => line.remove());
            lines = [];
        }

        function resetLevel1() {
            cleanupLevel1Lines(); // Usar la nueva función para limpiar líneas
            connections = {};
            selectedConcept = null;
            document.querySelectorAll('#level-1 .selectable').forEach(el => el.classList.remove('selected'));
            document.getElementById('level1-feedback').textContent = '';
        }

document.getElementById('level1-continue-btn').addEventListener('click', () => {
    cleanupLevel1Lines(); // <-- CORRECCIÓN: Limpiar las líneas antes de continuar
    unlockedLevels['level-2'] = true;
    showScreen('level-2');
    initLevel2();
    playSound(startSound);
});
        
        // --- LÓGICA DEL NIVEL 2: ARRASTRAR Y SOLTAR ---
        const level2Data = {
            options: [
                { id: 'opt1', text: 'Multimedia', correctDrop: 'drop1' },
                { id: 'opt2', text: 'permite', correctDrop: 'drop2' },
                { id: 'opt3', text: 'interacción', correctDrop: 'drop3' }
            ]
        };
        let draggedItem = null;

        function initLevel2() {
            const optionsContainer = document.getElementById('draggable-options');
    level2Attempts = 0;
            optionsContainer.innerHTML = '';
            const shuffledOptions = [...level2Data.options].sort(() => Math.random() - 0.5);
            
            shuffledOptions.forEach(opt => {
                optionsContainer.innerHTML += `<div id="${opt.id}" class="draggable bg-blue-100 text-blue-800 font-semibold px-5 py-2 rounded-lg shadow" draggable="true" tabindex="0" aria-grabbed="false">${opt.text}</div>`;
            });

            addLevel2EventListeners();
        }

        function addLevel2EventListeners() {
            document.querySelectorAll('.draggable').forEach(draggable => {
                draggable.addEventListener('dragstart', handleDragStart);
                draggable.addEventListener('dragend', handleDragEnd);
                draggable.addEventListener('keydown', handleKeyDrag);
            });

            document.querySelectorAll('.drop-zone').forEach(zone => {
                zone.addEventListener('dragover', handleDragOver);
                zone.addEventListener('dragleave', handleDragLeave);
                zone.addEventListener('drop', handleDrop);
            });

            const optionsContainer = document.getElementById('draggable-options');
            optionsContainer.addEventListener('dragover', handleDragOver);
            optionsContainer.addEventListener('drop', handleDrop);
        }

        function handleDragStart(e) {
            draggedItem = e.target;
            e.target.setAttribute('aria-grabbed', 'true');
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => e.target.classList.add('dragging'), 0);
            playSound(clickSound);
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
            e.target.setAttribute('aria-grabbed', 'false');
            draggedItem = null;
        }

        function handleDragOver(e) {
            e.preventDefault();
            if (e.currentTarget.classList.contains('drop-zone')) {
                e.currentTarget.classList.add('over');
            }
        }

        function handleDragLeave(e) {
            if (e.currentTarget.classList.contains('drop-zone')) {
                e.currentTarget.classList.remove('over');
            }
        }

        function handleKeyDrag(e) {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

            const optionsContainer = document.getElementById('draggable-options');
            const dropZones = Array.from(document.querySelectorAll('.drop-zone'));
            const targets = [optionsContainer, ...dropZones];
            const parent = e.target.parentElement;
            const currentIndex = targets.indexOf(parent);
            const newIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;

            if (newIndex < 0 || newIndex >= targets.length) return;

            const target = targets[newIndex];
            e.preventDefault();
            e.target.setAttribute('aria-grabbed', 'true');

            if (target.classList.contains('drop-zone') && target.children.length > 0) {
                const existing = target.firstElementChild;
                optionsContainer.appendChild(existing);
                target.classList.remove('filled');
            }

            if (parent.classList.contains('drop-zone')) {
                parent.classList.remove('filled');
            }

            target.appendChild(e.target);

            if (target.classList.contains('drop-zone')) {
                target.classList.add('filled');
            }

            e.target.setAttribute('aria-grabbed', 'false');
        }

        function handleDrop(e) {
            e.preventDefault();
            const dropTarget = e.currentTarget;
            if (!draggedItem) return;

            if (dropTarget.classList.contains('drop-zone')) {
                dropTarget.classList.remove('over');
            }

            if (dropTarget.classList.contains('drop-zone') && dropTarget.children.length > 0) {
                const existingEl = dropTarget.firstElementChild;
                document.getElementById('draggable-options').appendChild(existingEl);
                dropTarget.classList.remove('filled');
            }

            dropTarget.appendChild(draggedItem);
            draggedItem.setAttribute('aria-grabbed', 'false');

            if (dropTarget.classList.contains('drop-zone')) {
                dropTarget.classList.add('filled');
            }
        }
        
        document.getElementById('level2-check-btn').addEventListener('click', () => {
            const feedbackEl = document.getElementById('level2-feedback');
            let allCorrect = true;
            
            level2Data.options.forEach(option => {
                const droppedEl = document.getElementById(option.id);
                const parentId = droppedEl.parentElement.id;
                const dropZone = document.getElementById(option.correctDrop);

                if (parentId === option.correctDrop) {
                    dropZone.style.borderColor = '#22c55e';
                } else {
                    allCorrect = false;
                    if(droppedEl.parentElement.classList.contains('drop-zone')){
                        droppedEl.parentElement.style.borderColor = '#ef4444';
                    }
                }
            });
            
            if(allCorrect) {
                feedbackEl.textContent = "¡Correcto! Has completado la definición perfectamente.";
                feedbackEl.className = 'mt-4 text-center font-medium text-green-600';
                updateScore(50);
                awardBadge();
                playSound(successSound);
                unlockedLevels['level-3'] = true;
                setTimeout(() => { showScreen('level-3'); initLevel3(); }, 1500);
            } else {
                 level2Attempts++;
                 feedbackEl.textContent = "Casi... algunas palabras no están en el lugar correcto. ¡Vuelve a intentarlo!";
                 if(level2Attempts >= 2){
                     feedbackEl.textContent += " Pista: arrastra cada palabra al espacio que mejor complete la frase.";
                 }
                 feedbackEl.className = 'mt-4 text-center font-medium text-red-600';
                playSound(failSound);
            }
        });

        // --- LÓGICA DEL NIVEL 3: VERDADERO O FALSO ---
        const level3Data = [
            { id: 'q1', text: 'El Storytelling Digital usa elementos multimedia.', answer: true },
            { id: 'q2', text: 'La interacci\u00f3n con la audiencia no es importante.', answer: false },
            { id: 'q3', text: 'Las historias digitales pueden ser no lineales.', answer: true }
        ];

        let level3Interval = null;
        let level3TimeLeft = 180;

        function initLevel3() {
            const container = document.getElementById('level3-questions');
            const feedbackEl = document.getElementById('level3-feedback');
            const timerEl = document.getElementById('level3-timer');
            document.getElementById('level3-check-btn').disabled = false;
            container.innerHTML = '';
            feedbackEl.textContent = '';
            timerEl.textContent = '';

            level3Data.forEach(q => {
                container.innerHTML += `<div><p class="font-medium">${q.text}</p>
                    <label class="mr-4"><input type="radio" name="${q.id}" value="true"> Verdadero</label>
                    <label><input type="radio" name="${q.id}" value="false"> Falso</label>
                </div>`;
            });

            startLevel3Timer();
        }

        function startLevel3Timer() {
            clearInterval(level3Interval);
            level3TimeLeft = 180;
            const timerEl = document.getElementById('level3-timer');
            timerEl.textContent = formatTime(level3TimeLeft);
            level3Interval = setInterval(() => {
                level3TimeLeft--;
                timerEl.textContent = formatTime(level3TimeLeft);
                if (level3TimeLeft <= 0) {
                    clearInterval(level3Interval);
                    disableLevel3();
                    const feedback = document.getElementById('level3-feedback');
                    feedback.textContent = '¡Tiempo agotado!';
                    feedback.className = 'mt-4 text-center font-medium text-red-600';
                }
            }, 1000);
        }

        function formatTime(seconds) {
            const m = String(Math.floor(seconds / 60)).padStart(2, '0');
            const s = String(seconds % 60).padStart(2, '0');
            return `${m}:${s}`;
        }

        function disableLevel3() {
            document.getElementById('level3-check-btn').disabled = true;
            document.querySelectorAll('#level3-questions input').forEach(inp => inp.disabled = true);
        }

        document.getElementById('level3-check-btn').addEventListener('click', () => {
            const feedbackEl = document.getElementById('level3-feedback');
            let allAnswered = true;
            let allCorrect = true;

            level3Data.forEach(q => {
                const selected = document.querySelector(`input[name="${q.id}"]:checked`);
                if (!selected) {
                    allAnswered = false;
                    allCorrect = false;
                    return;
                }
                if ((selected.value === 'true') !== q.answer) {
                    allCorrect = false;
                }
            });

            if (!allAnswered) {
                feedbackEl.textContent = 'Responde todas las preguntas.';
                feedbackEl.className = 'mt-4 text-center font-medium text-red-600';
                return;
            }

            clearInterval(level3Interval);
            disableLevel3();

            if (allCorrect) {
                feedbackEl.textContent = '\u00a1Muy bien! Has completado el cuestionario.';
                feedbackEl.className = 'mt-4 text-center font-medium text-green-600';
                updateScore(50);
                awardBadge();
                playSound(successSound);
                setTimeout(() => showScreen('final-screen'), 1500);
            } else {
                feedbackEl.textContent = 'Hay respuestas incorrectas.';
                feedbackEl.className = 'mt-4 text-center font-medium text-red-600';
                playSound(failSound);
            }
        });

        // --- PANTALLA FINAL Y REINICIO ---
document.getElementById('restart-btn').addEventListener('click', () => {
            // Resetear estado del Nivel 1
            resetLevel1();
            document.getElementById('level1-continue-btn').disabled = true;

            // Resetear estado del Nivel 2
            document.querySelectorAll('.drop-zone').forEach(zone => {
                zone.innerHTML = '&nbsp;';
                zone.className = 'drop-zone inline-block align-middle px-4 py-1 rounded-lg mx-1 min-w-[120px]';
                zone.style.borderColor = '';
            });
    document.getElementById('draggable-options').innerHTML = '';
    document.getElementById('level2-feedback').textContent = '';

            // Resetear estado del Nivel 3
            clearInterval(level3Interval);
            document.getElementById('level3-questions').innerHTML = '';
            document.getElementById('level3-feedback').textContent = '';
            document.getElementById('level3-timer').textContent = '';
            document.getElementById('level3-check-btn').disabled = false;

            // Volver a la pantalla de bienvenida
    unlockedLevels['level-1'] = false;
    unlockedLevels['level-2'] = false;
    unlockedLevels['level-3'] = false;
    showScreen('start-screen');
    playSound(startSound);
});

        document.getElementById('reset-score-btn').addEventListener('click', () => {
            score = 0;
            scoreEl.textContent = `Puntos: ${score}`;
            localStorage.removeItem('score');
            badgesEl.innerHTML = '';
            playSound(failSound);
        });

        // Iniciar la aplicación
        showScreen('start-screen');
        addAudioToButtons();

