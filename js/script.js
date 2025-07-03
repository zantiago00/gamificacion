        // --- CONFIGURACIÓN GENERAL ---
        const screens = document.querySelectorAll('.screen');
        const progressBar = document.getElementById('progress-bar');
const scoreEl = document.getElementById("score");
const badgesEl = document.getElementById("badges");
let score = parseInt(localStorage.getItem("score") || "0");
const unlockedLevels = {
    'welcome-screen': true,
    'level-1': false,
    'level-2': false
};

// --- SONIDOS ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}
function addAudioToButtons() {
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', playClickSound);
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

        
        let currentScreen = 'welcome-screen';
        const totalLevels = 2;

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
        }
        
function updateProgressBar() {
    let progress = 0;
    if (currentScreen === 'level-1') progress = 0;
    if (currentScreen === 'level-2') progress = 50;
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
        showScreen(target);
    });
});

document.getElementById('start-btn').addEventListener('click', () => {
    unlockedLevels['level-1'] = true;
    showScreen('level-1');
    initLevel1();
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
                } else {
                    level1Attempts++;
                    feedbackEl.textContent = "Algunas conexiones son incorrectas. ¡Inténtalo de nuevo!";
                    if (level1Attempts >= 2) {
                        feedbackEl.textContent += " Pista: conecta cada concepto con su definición correspondiente.";
                    }
                    feedbackEl.className = 'mt-4 text-center font-medium text-red-600';
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
                setTimeout(() => showScreen('final-screen'), 1500);
            } else {
                 level2Attempts++;
                 feedbackEl.textContent = "Casi... algunas palabras no están en el lugar correcto. ¡Vuelve a intentarlo!";
                 if(level2Attempts >= 2){
                     feedbackEl.textContent += " Pista: arrastra cada palabra al espacio que mejor complete la frase.";
                 }
                 feedbackEl.className = 'mt-4 text-center font-medium text-red-600';
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
            
            // Volver a la pantalla de bienvenida
    unlockedLevels['level-1'] = false;
    unlockedLevels['level-2'] = false;
    showScreen('welcome-screen');
});

        document.getElementById('reset-score-btn').addEventListener('click', () => {
            score = 0;
            scoreEl.textContent = `Puntos: ${score}`;
            localStorage.removeItem('score');
            badgesEl.innerHTML = '';
        });

        // Iniciar la aplicación
        showScreen('welcome-screen');
        addAudioToButtons();

