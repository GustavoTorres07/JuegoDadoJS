import Juego from "./Juego.js";
//crea una nueva instancia de juego 
const juego = new Juego();
//si no hay una partida guardada, muestra la pantalla inicial
if (!juego.restaurar()) {
  document.getElementById("pantalla-inicial").classList.remove("d-none");
  document.getElementById("pantalla-juego").classList.add("d-none");
  document.getElementById("mensaje-ronda").textContent = "Que comience el juego!";
  document.getElementById("dado").textContent = "🎲";
}
