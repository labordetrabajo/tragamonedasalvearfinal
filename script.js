// ===============================
// CONFIGURACIÓN
// ===============================

// Lista de íconos disponibles para la tragamonedas  NO SE PUEDE REPETIR EN OTRA LINEA LA FRUTA
const ICONS = [
    ...Array(4).fill('cherry'),     // 16% 
    ...Array(16).fill('banana'),     // 16% 
    ...Array(21).fill('big_win'),     // 4% 
    ...Array(16).fill('lemon'),      // 16% 
    ...Array(11).fill('pear'),       // 16% 
    ...Array(11).fill('grapes'),     // 16% 
    ...Array(21).fill('apricot')     // 16% (¡Nuevo máximo!)
];
// Mensajes asociados a cada premio
const PRIZES = {
    'cherry': "🍒 1- Una vuelta más",
    'banana': "🍌 2- Casi casi",
    'big_win': "🎁 3- Regalo sorpresa",
    'lemon': "🍋 4- Te pasaste",
    'pear': "🍐 5- Seguí participando",
    'grapes': "🍇 6- A bailar",
    'apricot': "🥭 7- En la pera 2x1"
};

// Valores de cada ícono (si querés agregar sistema de puntos más adelante)
const ICON_VALUES = {
    'lucky_seven': 100,
    'big_win': 75,
    'cherry': 50,
    'watermelon': 40,
    'strawberry': 35,
    'grapes': 30,
    'apple': 25,
    'banana': 20,
    'orange': 15,
    'lemon': 10,
    'pear': 10,
    'apricot': 5
};

// Variables DOM y tiempos de animación
const lever = document.getElementById("lever");
const button = document.querySelector(".start-button");
const BASE_SPINNING_DURATION = 2.7;
const COLUMN_SPINNING_DURATION = 0.3;

let cols; // columnas de la tragamonedas

// ===============================
// INICIALIZACIÓN
// ===============================

window.addEventListener('DOMContentLoaded', () => {
    cols = document.querySelectorAll('.col');
    setInitialItems();
});

// ===============================
// FUNCIONES PRINCIPALES
// ===============================

function setInitialItems() {
    const baseItemAmount = 40;

    cols.forEach((col, i) => {
        const amount = baseItemAmount + i * 3;
        let elms = '';
        let firstThreeElms = '';

        for (let x = 0; x < amount; x++) {
            const icon = getRandomIcon();
            const item = `<div class="icon" data-item="${icon}"><img src="items/${icon}.png"></div>`;
            elms += item;
            if (x < 3) firstThreeElms += item;
        }

        col.innerHTML = elms + firstThreeElms;
    });
}

// Función para hacer girar la máquina
function spin(elem) {
    // Reproducir el sonido de la máquina girando
    var spinSound = document.getElementById("spin-sound");
    spinSound.play();

    let duration = BASE_SPINNING_DURATION + randomDuration();

    cols.forEach(col => {
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    });

    // Desactiva el botón durante la animación
    elem.setAttribute('disabled', true);
    document.getElementById('container').classList.add('spinning');

    // Llama a setResult después de que termine la animación
    setTimeout(setResult, BASE_SPINNING_DURATION * 500);

    // Reactiva el botón después de que termine la animación
    setTimeout(() => {
        document.getElementById('container').classList.remove('spinning');
        elem.removeAttribute('disabled');
    }, duration * 1000);
}

function setResult() {
    const allResults = [];

    cols.forEach(col => {
        const results = [
            getRandomIcon(),
            getRandomIcon(),
            getRandomIcon()
        ];
        allResults.push(results);

        const icons = col.querySelectorAll('.icon img');
        for (let x = 0; x < 3; x++) {
            icons[x].setAttribute('src', 'items/' + results[x] + '.png');
            icons[icons.length - 3 + x].setAttribute('src', 'items/' + results[x] + '.png');
        }
    });

    checkMultipleLines(allResults);
}

// ===============================
// SISTEMA DE PREMIOS
// ===============================

function checkMultipleLines(matrix) {
    const lines = [
        matrix.map(r => r[0]), // 🟥 superior
        matrix.map(r => r[1]), // 🟩 central
        matrix.map(r => r[2])  // 🟦 inferior
    ];

    const diagonals = [
        [matrix[0][0], matrix[1][1], matrix[2][2]], // 🔺 diagonal descendente
        [matrix[0][2], matrix[1][1], matrix[2][0]]  // 🔻 diagonal ascendente
    ];

    const lineNames = ["🟥 Línea superior", "🟩 Línea central", "🟦 Línea inferior"];
    const diagonalNames = ["🔺 Diagonal descendente", "🔻 Diagonal ascendente"];

    lines.forEach((line, index) => {
        if (line[0] === line[1] && line[1] === line[2]) {
            const icon = line[0];
            const message = PRIZES[icon] || "¡Ganaste!";
            showWinMessage(`${lineNames[index]}:\n${message}`);
        }
    });

    diagonals.forEach((diag, index) => {
        if (diag[0] === diag[1] && diag[1] === diag[2]) {
            const icon = diag[0];
            const message = PRIZES[icon] || "¡Ganaste!";
            showWinMessage(`${diagonalNames[index]}:\n${message}`);
        }
    });
}



// Función para mostrar el mensaje de premio
function showWinMessage(text) {
    const messageBox = document.createElement('div');
    messageBox.className = 'win-message';
    messageBox.textContent = text;

    document.body.appendChild(messageBox);

    // Espera 1 segundo antes de mostrar el mensaje
    setTimeout(() => {
        messageBox.classList.add('visible');
    }, 3000);

    // Luego de 4 segundos (1s delay + 3s visible), lo oculta
    setTimeout(() => {
        messageBox.classList.remove('visible');
        // Espera 0.5s más para removerlo del DOM
        setTimeout(() => document.body.removeChild(messageBox), 500);
    }, 6000);

    // Reproducir el sonido cuando hay un premio
    var winSound = document.getElementById("win-sound");
    winSound.play();
}


// ===============================
// FUNCIONES DE UTILIDAD
// ===============================

function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}

// ===============================
// EVENTOS
// ===============================

lever.addEventListener("click", () => {
    if (button.disabled) return;
    lever.classList.add("pulled");

    setTimeout(() => {
        lever.classList.remove("pulled");
    }, 600);

    button.click();
});
