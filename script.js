// lógica del juego usando DOM para mayor interactividad

// --- utilidades y estado ---
function clearPantalla() {
    document.getElementById('pantalla').innerHTML = '';
}

function showMessage(msg) {
    const pantalla = document.getElementById('pantalla');
    const p = document.createElement('p');
    p.className = 'message';
    p.textContent = msg;
    pantalla.appendChild(p);
}

function guardarResultado(nombre, resultado, intentos) {
    const estadisticas = JSON.parse(localStorage.getItem('estadisticas') || '[]');
    estadisticas.push({ nombre, resultado, intentos });
    localStorage.setItem('estadisticas', JSON.stringify(estadisticas));
}

// muestra tabla de estadísticas dentro de la pantalla
function mostrarEstadisticasEnPantalla() {
    clearPantalla();
    const pantalla = document.getElementById('pantalla');
    const estadisticas = JSON.parse(localStorage.getItem('estadisticas') || '[]');
    showMessage('Estadísticas guardadas');

    if (estadisticas.length === 0) {
        showMessage('No hay resultados aún.');
        return;
    }

    const table = document.createElement('table');
    table.className = 'stats-table';
    table.innerHTML = '<tr><th>Nombre</th><th>Resultado</th><th>Intentos</th></tr>';
    estadisticas.forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${r.nombre}</td><td>${r.resultado}</td><td>${r.intentos}</td>`;
        table.appendChild(row);
    });
    pantalla.appendChild(table);
}

let gameState = {};

// --- flujo de juego ---
function showDifficulty(mode) {
    clearPantalla();
    showMessage('Selecciona dificultad:');
    const pantalla = document.getElementById('pantalla');
    const select = document.createElement('select');
    select.innerHTML =
        '<option value="20">Fácil (20 intentos)</option>' +
        '<option value="12">Medio (12 intentos)</option>' +
        '<option value="5">Difícil (5 intentos)</option>';
    pantalla.appendChild(select);

    const btn = document.createElement('button');
    btn.textContent = 'Confirmar';
    btn.addEventListener('click', () => {
        const intentos = parseInt(select.value, 10);
        if (mode === 'solitario') {
            startSolo(intentos);
        } else {
            startDos(intentos);
        }
    });
    pantalla.appendChild(btn);
}

function startSolo(intentos) {
    gameState = {
        mode: 'solitario',
        numero: Math.floor(Math.random() * 1000) + 1,
        intentos,
        intentosIniciales: intentos
    };
    clearPantalla();
    showGuessForm();
}

function startDos(intentos) {
    gameState = { mode: 'dos', numero: null, intentos, intentosIniciales: intentos };
    clearPantalla();
    showMessage('Jugador 1: introduce el número secreto (no lo muestres).');
    const pantalla = document.getElementById('pantalla');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 1;
    input.max = 1000;
    pantalla.appendChild(input);

    const btn = document.createElement('button');
    btn.textContent = 'Enviar';
    btn.addEventListener('click', () => {
        const num = parseInt(input.value, 10);
        if (isNaN(num) || num < 1 || num > 1000) {
            alert('Número no válido');
            return;
        }
        gameState.numero = num;
        clearPantalla();
        showGuessForm();
    });
    pantalla.appendChild(btn);
}

function showGuessForm() {
    const pantalla = document.getElementById('pantalla');
    showMessage(`Tienes ${gameState.intentos} intentos.`);
    showMessage('Adivina el número (1-1000):');

    const input = document.createElement('input');
    input.type = 'number';
    input.min = 1;
    input.max = 1000;
    pantalla.appendChild(input);

    const btn = document.createElement('button');
    btn.textContent = 'Probar';
    btn.addEventListener('click', () => {
        const intento = parseInt(input.value, 10);
        if (isNaN(intento) || intento < 1 || intento > 1000) {
            alert('Número no válido');
            return;
        }
        processGuess(intento);
    });
    pantalla.appendChild(btn);
}

function processGuess(intento) {
    if (intento === gameState.numero) {
        const usados = gameState.intentosIniciales - gameState.intentos + 1;
        endGame('Ganado', usados);
    } else {
        if (intento > gameState.numero) showMessage('El número es menor');
        else showMessage('El número es mayor');
        gameState.intentos--;
        if (gameState.intentos > 0) {
            showMessage(`Intentos restantes: ${gameState.intentos}`);
        } else {
            showMessage(`Has perdido. El número era: ${gameState.numero}`);
            endGame('Perdido', gameState.intentosIniciales);
        }
    }
}

function endGame(resultado, intentosUsados) {
    const nombre = prompt('Introduce el nombre del jugador:', '') || 'Anonimo';
    guardarResultado(nombre, resultado, intentosUsados);
    showMessage(`Juego terminado: ${resultado}. Intentos usados: ${intentosUsados}`);
    showMessage('Selecciona otra opción en el menú para empezar de nuevo.');
}

// --- inicialización de eventos ---
function inicializar() {
    document.getElementById('modo-solitario').addEventListener('click', () => showDifficulty('solitario'));
    document.getElementById('modo-dos').addEventListener('click', () => showDifficulty('dos'));
    document.getElementById('ver-estadisticas').addEventListener('click', mostrarEstadisticasEnPantalla);
    showMessage('Usa los botones del menú para comenzar.');
}

window.onload = inicializar;
