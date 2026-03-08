// lógica del juego replicando el código Python

// utilidades
function pedirNumeroValido(mensaje, minimo, maximo) {
    let num;
    do {
        num = parseInt(prompt(mensaje, ""));
        if (isNaN(num) || num < minimo || num > maximo) {
            alert("Número no válido");
        }
    } while (isNaN(num) || num < minimo || num > maximo);
    return num;
}

function pedirNombre() {
    let nombre = prompt("Introduce el nombre del jugador:", "");
    return nombre || "Anonimo";
}

function guardarResultado(nombre, resultado, intentos) {
    let estadisticas = JSON.parse(localStorage.getItem('estadisticas') || '[]');
    estadisticas.push({ nombre, resultado, intentos });
    localStorage.setItem('estadisticas', JSON.stringify(estadisticas));
}

function mostrarEstadisticasEnPantalla() {
    const pantalla = document.getElementById('pantalla');
    const estadisticas = JSON.parse(localStorage.getItem('estadisticas') || '[]');
    let html = '<h2>Estadísticas guardadas</h2>';
    if (estadisticas.length === 0) {
        html += '<p>No hay resultados aún.</p>';
    } else {
        html += '<table class="stats-table"><tr><th>Nombre</th><th>Resultado</th><th>Intentos</th></tr>';
        estadisticas.forEach(r => {
            html += `<tr><td>${r.nombre}</td><td>${r.resultado}</td><td>${r.intentos}</td></tr>`;
        });
        html += '</table>';
    }
    pantalla.innerHTML = html;
}

// funciones de juego
function jugarSolitario(intentos) {
    const numero = Math.floor(Math.random() * 1000) + 1;
    let intentosIniciales = intentos;
    let result = { estado: 'Perdido', intentosUsados: intentosIniciales };

    while (intentos > 0) {
        const intento = pedirNumeroValido('Introduce un número (1-1000):', 1, 1000);
        if (intento === numero) {
            intentosUsados = intentosIniciales - intentos + 1;
            result.estado = 'Ganado';
            result.intentosUsados = intentosUsados;
            alert('Has acertado');
            return result;
        } else if (intento > numero) {
            alert('El número es menor');
        } else {
            alert('El número es mayor');
        }
        intentos--;
        alert('Intentos restantes: ' + intentos);
    }
    alert('Has perdido. El número era: ' + numero);
    return result;
}

function jugarDosJugadores(intentos) {
    const numero = pedirNumeroValido('Jugador 1, introduce un número (1-1000):', 1, 1000);
    let intentosIniciales = intentos;
    let result = { estado: 'Perdido', intentosUsados: intentosIniciales };

    while (intentos > 0) {
        const intento = pedirNumeroValido('Jugador 2, introduce un número:', 1, 1000);
        if (intento === numero) {
            intentosUsados = intentosIniciales - intentos + 1;
            result.estado = 'Ganado';
            result.intentosUsados = intentosUsados;
            alert('Has acertado');
            return result;
        } else if (intento > numero) {
            alert('El número es menor');
        } else {
            alert('El número es mayor');
        }
        intentos--;
        alert('Intentos restantes: ' + intentos);
    }
    alert('Has perdido. El número era: ' + numero);
    return result;
}

function pedirDificultad() {
    let opcion;
    do {
        opcion = pedirNumeroValido('Nivel de dificultad: (1) Fácil 20 intentos, (2) Medio 12 intentos, (3) Difícil 5 intentos', 1, 3);
    } while (opcion < 1 || opcion > 3);
    if (opcion === 1) return 20;
    if (opcion === 2) return 12;
    if (opcion === 3) return 5;
}

// controlador de eventos
function inicializar() {
    document.getElementById('modo-solitario').addEventListener('click', () => {
        const intentos = pedirDificultad();
        const res = jugarSolitario(intentos);
        const nombre = pedirNombre();
        guardarResultado(nombre, res.estado, res.intentosUsados);
    });
    document.getElementById('modo-dos').addEventListener('click', () => {
        const intentos = pedirDificultad();
        const res = jugarDosJugadores(intentos);
        const nombre = pedirNombre();
        guardarResultado(nombre, res.estado, res.intentosUsados);
    });
    document.getElementById('ver-estadisticas').addEventListener('click', () => {
        mostrarEstadisticasEnPantalla();
    });
}

window.onload = inicializar;
