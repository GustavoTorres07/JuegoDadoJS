import Juego from "./Juego.js";
//crea una nueva instancia de juego 
const juego = new Juego();

const musica = new Audio("/audio/game-8-bit.mp3"); 
musica.loop = true; 
musica.volume = 0.5; 

// cuando se haga click en Jugar va a empezar la música
document.getElementById("boton-jugar").addEventListener("click", () => {
  musica.play(); 
});

//si no hay una partida guardada, muestra la pantalla inicial
if (!juego.restaurar()) {
  document.getElementById("pantalla-inicial").classList.remove("d-none");
  document.getElementById("pantalla-juego").classList.add("d-none");
  document.getElementById("mensaje-ronda").textContent = "Que comience el juego!";
  document.getElementById("dado").textContent = "🎲";
}
