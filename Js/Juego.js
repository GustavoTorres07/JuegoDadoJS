import Jugador from "./Jugador.js";

// Pantallas
const pantallaInicial = document.getElementById("pantalla-inicial");
const pantallaJuego = document.getElementById("pantalla-juego");

// Controles de la pantalla inicial
const botonJugar = document.getElementById("boton-jugar");
const inputNombreJ1 = document.getElementById("nombre-j1");
const inputNombreJ2 = document.getElementById("nombre-j2");

// Tableros
const nombreTableroJ1 = document.getElementById("nombre-tablero-j1");
const elTiradaJ1 = document.getElementById("puntos-j1");
const elRondasJ1 = document.getElementById("rondas-ganadas-j1");
const btnJ1 = document.getElementById("btn-j1");

const nombreTableroJ2 = document.getElementById("nombre-tablero-j2");
const elTiradaJ2 = document.getElementById("puntos-j2");
const elRondasJ2 = document.getElementById("rondas-ganadas-j2");
const btnJ2 = document.getElementById("btn-j2");

const elMensaje = document.getElementById("mensaje-ronda");
const btnReiniciar = document.getElementById("btn-reiniciar");

let jugador1;
let jugador2;
let tiradaJ1 = 0;
let tiradaJ2 = 0;

function tirarDado() {
  return Math.floor(Math.random() * 6) + 1; // 1..6
}

function prepararNuevaRonda() {
  tiradaJ1 = 0;
  tiradaJ2 = 0;
  elTiradaJ1.textContent = "-";
  elTiradaJ2.textContent = "-";
  btnJ1.disabled = false; 
  btnJ2.disabled = true;   
  elMensaje.textContent = `Turno de ${jugador1.nombre}`;
}

function reiniciarJuego() {
  jugador1.resetear();
  jugador2.resetear();
  elRondasJ1.textContent = "0";
  elRondasJ2.textContent = "0";
  prepararNuevaRonda();
}

function compararTiradas() {
  let ganadorRonda = null;

  if (tiradaJ1 > tiradaJ2) {
    ganadorRonda = jugador1;
    elMensaje.textContent = `${ganadorRonda.nombre} ganó la ronda!`;
    elRondasJ1.textContent = jugador1.ganarRonda();
  } else if (tiradaJ2 > tiradaJ1) {
    ganadorRonda = jugador2;
    elMensaje.textContent = `${ganadorRonda.nombre} ganó la ronda!`;
    elRondasJ2.textContent = jugador2.ganarRonda();
  } else {
    elMensaje.textContent = `¡Empate!`;
  }

  // ¿Fin del juego? (al mejor de 5 → primero a 3)
  if (jugador1.rondasGanadas === 3 || jugador2.rondasGanadas === 3) {
    elMensaje.textContent = `${ganadorRonda.nombre} GANÓ EL JUEGO!`;
        lanzarConfetti(); // 🎉
    btnJ1.disabled = true;
    btnJ2.disabled = true;
    return;
  }

  // ⬇️ Ronda terminada pero el juego sigue: dejar visibles los puntajes
  // y habilitar a J1 para iniciar la siguiente ronda con su próximo click.
  btnJ1.disabled = false;
  btnJ2.disabled = true;
  elMensaje.textContent += ` — Turno de ${jugador1.nombre}`;
}

function lanzarConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.7 }
  });
}


function iniciarJuego() {
  const nombreJ1 = inputNombreJ1.value || "Jugador 1";
  const nombreJ2 = inputNombreJ2.value || "Jugador 2";

  jugador1 = new Jugador(nombreJ1);
  jugador2 = new Jugador(nombreJ2);

  nombreTableroJ1.textContent = jugador1.nombre;
  nombreTableroJ2.textContent = jugador2.nombre;

  // Mostrar pantalla de juego
  pantallaInicial.classList.add("d-none");
  pantallaJuego.classList.remove("d-none");

  prepararNuevaRonda();
}

// Eventos
botonJugar.addEventListener("click", iniciarJuego);

btnJ1.addEventListener('click', () => {

  // Si la ronda anterior terminó, reseteamos ahora
  if (tiradaJ2 !== 0) {
    prepararNuevaRonda();
  }

  tiradaJ1 = tirarDado();
  elTiradaJ1.textContent = tiradaJ1;

  btnJ1.disabled = true;
  btnJ2.disabled = false;
  elMensaje.textContent = `Turno de ${jugador2.nombre}`;
});

btnJ2.addEventListener("click", () => {
  tiradaJ2 = tirarDado();
  elTiradaJ2.textContent = tiradaJ2;
  btnJ2.disabled = true;
  compararTiradas();
});

btnReiniciar.addEventListener("click", reiniciarJuego);
