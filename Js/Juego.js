import Jugador from "./Jugador.js"; // traemos la clase Jugador para crear J1 y J2

// Agarramos todo lo que usamos del html
const pantallaInicial = document.getElementById("pantalla-inicial"); // pantalla de inicio
const pantallaJuego   = document.getElementById("pantalla-juego"); // pantalla del juego

const botonJugar    = document.getElementById("boton-jugar"); // boton jugar
const btnVerReglas  = document.getElementById("btn-ver-reglas"); // boton ver reglas (que es un modal)
const btnVolverMenu = document.getElementById("btn-volver-menu"); // boton volver al menu

const inputNombreJ1 = document.getElementById("nombre-j1"); // nombre del jugador 1
const inputNombreJ2 = document.getElementById("nombre-j2"); // nombre del jugador 2

const nombreTableroJ1 = document.getElementById("nombre-tablero-j1"); // nombre del J1 en pantalla
const elTiradaJ1      = document.getElementById("puntos-j1"); // numero que saco el J1
const elRondasJ1      = document.getElementById("rondas-ganadas-j1"); // rondas ganadas por el J1
const btnJ1           = document.getElementById("btn-j1"); // boton de tirar dado del J1

const nombreTableroJ2 = document.getElementById("nombre-tablero-j2"); // nombre del J2 en patanlla
const elTiradaJ2      = document.getElementById("puntos-j2"); // numero que saco el J2
const elRondasJ2      = document.getElementById("rondas-ganadas-j2"); // rondas ganadas por el J2
const btnJ2           = document.getElementById("btn-j2"); // boton de tirar dado del J2

const elMensaje       = document.getElementById("mensaje-ronda"); // textito con el estado del turno
const btnReiniciar    = document.getElementById("btn-reiniciar"); // boton para reiniciar el juego
const btnGuardar      = document.getElementById("btn-guardar"); //  boton para guardar el estado (localstorage)

const dado  = document.getElementById("dado"); // dado grande del medio
const CARAS = ["\u2680","\u2681","\u2682","\u2683","\u2684","\u2685"]; // las caras del dado (con unicode)

// estado de memoria
let jugador1, jugador2; // aca guardamos las instancias de J1 y J2
let tiradaJ1 = 0; // ultimo numero que saco J1 (inicializamos en 0 obviamente)
let tiradaJ2 = 0; // ultimo numero que saco J2 (inicializamos en 0 obviamente)

const LS_KEY = "batallaDadosEstadoV1"; // clave para guardar en localStorage

//aca van funciones utiles que necesitamos

function tirarDado() { // funcion para tirar el dado
  return Math.floor(Math.random() * 6) + 1; // devuelve un numero aleatorio entre 1 y 6
}

// funcion para la animacion del dado
function animarDadoHasta(valor) { 
  //hace girar el dado un toque y lo deja mostrando la cara final
  return new Promise(res => {
    dado.textContent = "🎲";
    dado.classList.add("girando");
    setTimeout(() => {
      dado.classList.remove("girando");
      dado.textContent = CARAS[valor - 1];
      res();
    }, 600); // tiempo de la animacion css
  });
}

// funcion para mostrar la pantalla correspondiente
function mostrarPantalla(nombre) {
  //cambiamos entre menu inicial y juego (osea las pantallas)
  if (nombre === "inicial") {
    pantallaInicial.classList.remove("d-none");
    pantallaJuego.classList.add("d-none");
  } else {
    pantallaInicial.classList.add("d-none");
    pantallaJuego.classList.remove("d-none");
  }
}

// funcion para preparar una nueva ronda
function prepararNuevaRonda(esInicio = false) {
  // dejamos todo listo para la ronda: se borra la tirada y arranaca J1
  tiradaJ1 = 0;
  tiradaJ2 = 0;
  elTiradaJ1.textContent = "-";
  elTiradaJ2.textContent = "-";
  btnJ1.disabled = false;
  btnJ2.disabled = true;
  elMensaje.textContent = esInicio ? "Que comience el juego!" : `Turno de ${jugador1.nombre}`;
}
// funcion para lanzar confetti al ganar el juego
function lanzarConfetti() {
  confetti({ particleCount: 180, spread: 90, origin: { y: 0.7 } });
}
// aca viene guardado / carga (persistencia) del estado del juego
// funcion para guardar el estado actual del juego y poder restaurarlo
function estadoActual() {
  // armamos un objeto con todo lo necesario para recuperar la partida
  return {
    pantalla: pantallaJuego.classList.contains("d-none") ? "inicial" : "juego",
    jugador1: { nombre: jugador1?.nombre ?? (inputNombreJ1.value || "Jugador 1"), rondasGanadas: jugador1?.rondasGanadas ?? 0 },
    jugador2: { nombre: jugador2?.nombre ?? (inputNombreJ2.value || "Jugador 2"), rondasGanadas: jugador2?.rondasGanadas ?? 0 },
    tiradaJ1,
    tiradaJ2,
    mensaje: elMensaje?.textContent ?? "Que comience el juego!",
    dado: dado?.textContent ?? "🎲",
    botones: {
      j1: !!btnJ1 && btnJ1.disabled ? "off" : "on",
      j2: !!btnJ2 && btnJ2.disabled ? "off" : "on"
    }
  };
}
// funcion para guardar el estado en localStorage
function guardarEstado() {
  // mandamos el estado al localstorage en json
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(estadoActual()));
  } catch (e) {
    console.warn("No se pudo guardar el estado:", e);
  }
}

// funcion para restaurar el estado desde localStorage
function restaurarDesdeStorage() {
  // si hay alguna partida guardada la traemos y dejamos como estaba
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const st = JSON.parse(raw);

    // aca mostramos la pantalla correcta
    mostrarPantalla(st.pantalla === "juego" ? "juego" : "inicial");

    // creamos jugadores con su nombre y rondas que estaban guardadas
    const n1 = st.jugador1?.nombre || "Jugador 1";
    const n2 = st.jugador2?.nombre || "Jugador 2";
    jugador1 = new Jugador(n1);
    jugador2 = new Jugador(n2);
    jugador1.rondasGanadas = st.jugador1?.rondasGanadas ?? 0;
    jugador2.rondasGanadas = st.jugador2?.rondasGanadas ?? 0;

    // actualizamos inputs y nombres visibles
    inputNombreJ1.value = n1;
    inputNombreJ2.value = n2;
    nombreTableroJ1.textContent = n1;
    nombreTableroJ2.textContent = n2;

    // volvemos a mostrar tiradas, rondas y mensaje
    tiradaJ1 = st.tiradaJ1 ?? 0;
    tiradaJ2 = st.tiradaJ2 ?? 0;
    elTiradaJ1.textContent = tiradaJ1 || "-";
    elTiradaJ2.textContent = tiradaJ2 || "-";
    elRondasJ1.textContent  = jugador1.rondasGanadas;
    elRondasJ2.textContent  = jugador2.rondasGanadas;
    elMensaje.textContent   = st.mensaje || "Que comience el juego!";

    // el dado del medio
    dado.textContent = st.dado || "🎲";

    // volvemos a habilitar / deshabilitar los botones segun como estaban
    if (st.botones?.j1 === "off") btnJ1.disabled = true; else btnJ1.disabled = false;
    if (st.botones?.j2 === "off") btnJ2.disabled = true; else btnJ2.disabled = false;

    return true;
  } catch (e) {
    console.warn("No se pudo restaurar estado:", e);
    return false;
  }
}

// aca viene la logica del juego
function iniciarJuego() {
  // leemos los nombres (los ingresados o por default) y creamos los jugadores y arrancamos
  const nombreJ1 = inputNombreJ1.value || "Jugador 1";
  const nombreJ2 = inputNombreJ2.value || "Jugador 2";

  jugador1 = new Jugador(nombreJ1);
  jugador2 = new Jugador(nombreJ2);

  nombreTableroJ1.textContent = jugador1.nombre;
  nombreTableroJ2.textContent = jugador2.nombre;

  mostrarPantalla("juego");
  prepararNuevaRonda(true);
  guardarEstado();
}

// funcion para reiniciar el juego
function reiniciarJuego() {
  // dejamos todo como nuevo pero mantenemos los nombres ingresados
  if (!jugador1 || !jugador2) {
    // Si no hay jugadores aún, inícialos con lo que haya
    const n1 = inputNombreJ1.value || "Jugador 1";
    const n2 = inputNombreJ2.value || "Jugador 2";
    jugador1 = new Jugador(n1);
    jugador2 = new Jugador(n2);
  } else {
    // reseteo rondas ganadas en cero (llamo al metodo en Jugador.js)
    jugador1.resetear?.();
    jugador2.resetear?.();
  }

  elRondasJ1.textContent = "0";
  elRondasJ2.textContent = "0";
  dado.textContent = "🎲";
  prepararNuevaRonda(true);
  guardarEstado();
}
// funcion para volver al menu inicial
function volverAlMenu() {
  mostrarPantalla("inicial");
  guardarEstado(); // mantenemos los nombres de los jugadores ingresados en los inputs
}

// funcion para comparar las tiradas de ambos jugadores
function compararTiradas() {
  //aca se decide quien gano la ronda (cuando digo ronda me refiero al turno) y si alguien gano el juego
  let ganadorRonda = null;

  if (tiradaJ1 > tiradaJ2) {
    ganadorRonda = jugador1;
    elMensaje.textContent = `${ganadorRonda.nombre} gano la ronda!`;
    elRondasJ1.textContent = jugador1.ganarRonda();
  } else if (tiradaJ2 > tiradaJ1) {
    ganadorRonda = jugador2;
    elMensaje.textContent = `${ganadorRonda.nombre} gano la ronda!`;
    elRondasJ2.textContent = jugador2.ganarRonda();
  } else {
    elMensaje.textContent = "Empate!";
  }

  // nosotros lo hicimos al mejor de 5 rondas osea que gana la partida el jugador que primero gane 3 rondas)
  if (jugador1.rondasGanadas === 3 || jugador2.rondasGanadas === 3) {
    elMensaje.textContent = `${ganadorRonda.nombre} GANO EL JUEGO!!!`;
    lanzarConfetti();
    btnJ1.disabled = true;
    btnJ2.disabled = true;
    guardarEstado();
    return;
  }

  // si nadie gano aun dejamos todo listo para que J1 empiece la proxima ronda
  btnJ1.disabled = false;
  btnJ2.disabled = true;
  elMensaje.textContent += ` — Turno de ${jugador1.nombre}`;
  guardarEstado();
}

// definimos y asignamos los eventos a los botones
botonJugar.addEventListener("click", iniciarJuego);
btnVolverMenu.addEventListener("click", volverAlMenu);
btnReiniciar.addEventListener("click", reiniciarJuego);
btnGuardar.addEventListener("click", guardarEstado);

btnJ1.addEventListener("click", async () => {
  // si la ronda anterior ya tuvo las dos tiradas limpio para la nueva
  if (tiradaJ2 !== 0) prepararNuevaRonda(); 

  // animo el dado y guardo la tirada de J1
  btnJ1.disabled = true;
  btnJ2.disabled = true;
  elMensaje.textContent = "Tirando...";
  guardarEstado();

  tiradaJ1 = tirarDado();
  await animarDadoHasta(tiradaJ1);
  elTiradaJ1.textContent = tiradaJ1;
  // aca le toca a J2 
  btnJ2.disabled = false;
  elMensaje.textContent = `Turno de ${jugador2.nombre}`;
  guardarEstado();
});

btnJ2.addEventListener("click", async () => {
  // bueno aca es la misma idea pero para el J2
  btnJ1.disabled = true;
  btnJ2.disabled = true;
  elMensaje.textContent = "Tirando...";
  guardarEstado();

  tiradaJ2 = tirarDado();
  await animarDadoHasta(tiradaJ2);
  elTiradaJ2.textContent = tiradaJ2;
  // vemos quien gano la ronda o si ya se gano la partida
  compararTiradas(); //aca dentro ya se guarda el estado
});

// al cargar la pagina intento recuperar lo que habia 
(() => {
  const ok = restaurarDesdeStorage();
  if (!ok) {
    // si no llegara haber nada guardado se empieza de cero
    mostrarPantalla("inicial");
    elMensaje.textContent = "Que comience el juego!";
    dado.textContent = "🎲";
  }
})();
