import Jugador from "./Jugador.js"; // aca traigo la clase jugador para crear J1 y el J2
import Dado from "./Dado.js"; // aca traigo la clase dado
export default class Juego {
  constructor() {
    //  realizo las capturas de los elementos html que voy a utilizar
    this.pantallaInicial = document.getElementById("pantalla-inicial"); // capturo el div de la pantalla inicial
    this.pantallaJuego = document.getElementById("pantalla-juego");   // capturo el div de la pantalla del juego

    this.btnJugar = document.getElementById("boton-jugar"); // capturo el boton para iniciar la partida (boton jugar)
    this.btnVolverMenu = document.getElementById("btn-volver-menu"); // capturo el boton para volver al menu
    this.btnReiniciar = document.getElementById("btn-reiniciar"); // capturo el boton para reiniciar la partida
    this.btnGuardar = document.getElementById("btn-guardar"); // capturo el boton para guardar el estado en localstorage

    this.inNombreJ1 = document.getElementById("nombre-j1"); // capturo el input nombre del jugador 1
    this.inNombreJ2 = document.getElementById("nombre-j2"); // capturo el input nombre del jugador 2

    this.lblNombreJ1 = document.getElementById("nombre-tablero-j1"); // capturo la etiqueta nombre J1 de la pantalla juego
    this.lblNombreJ2 = document.getElementById("nombre-tablero-j2"); // capturo la etiqueta nombre J2 de la pantalla juego
    this.lblTiradaJ1 = document.getElementById("tirada-j1"); // captura el numero que saco J1 
    this.lblTiradaJ2 = document.getElementById("tirada-j2"); // captura el numero que saco J2
    this.lblRondasJ1 = document.getElementById("rondas-ganadas-j1"); // contador de rondas ganadas para J1
    this.lblRondasJ2 = document.getElementById("rondas-ganadas-j2"); // contador de rondas ganadas para J2

    this.btnJ1 = document.getElementById("btn-j1"); // boton de tirar dado de J1
    this.btnJ2 = document.getElementById("btn-j2"); // boton de tirar dado de J2

    this.mensaje = document.getElementById("mensaje-ronda"); // mensaje que muestra el estado del juego
    this.domDado = document.getElementById("dado"); // capturo el dado grande del centro

    this.j1 = null; // preparo la variable para el jugador 1 aunque todavia no la creo
    this.j2 = null;  // preparo la variable para el jugado 2  aunque todavia no la creo
    this.t1 = 0; // guarda la ulima tirada de J1 pero la inicializo en 0 obviamente 
    this.t2 = 0; // guarda la ulima tirada de J2 pero la inicializo en 0 obviamente 
    this.dado = new Dado(this.domDado); // creo el dado pasando el elemento html domDado

    // clave para el locastorage
    this.LS_KEY = "batallaDadosEstadoV1"; 

    // asigno los eventos a los botones
    this.btnJugar.addEventListener("click", () => this.iniciar());      
    this.btnVolverMenu.addEventListener("click", () => this.volverAlMenu());
    this.btnReiniciar.addEventListener("click", () => this.reiniciar()); 
    this.btnGuardar.addEventListener("click", () => this.guardarEstado());
    this.btnJ1.addEventListener("click", () => this.tirarJ1());          
    this.btnJ2.addEventListener("click", () => this.tirarJ2());         
  }

  // funcion para mostrar una pantalla o otra (la pantalla de inicio o la del juego)
  mostrarPantalla(nombre) {
    if (nombre === "inicial") {                              
      this.pantallaInicial.classList.remove("d-none");        
      this.pantallaJuego.classList.add("d-none");            
    } else {                                                   
      this.pantallaInicial.classList.add("d-none");           
      this.pantallaJuego.classList.remove("d-none");          
    }
  }

  // funcion para preparar una nueva ronda
  prepararNuevaRonda(esInicio = false) {
    this.t1 = 0; this.t2 = 0;                                
    this.lblTiradaJ1.textContent = "-";                       
    this.lblTiradaJ2.textContent = "-";                       
    this.btnJ1.disabled = false;                              
    this.btnJ2.disabled = true;                               
    this.mensaje.textContent = esInicio                       
      ? "Que comience el juego!"                             
      : `Turno de ${this.j1?.nombre || "Jugador 1"}`;         
    this.dado.setCara(null);                                  
  }

  // esta funcion guarda el estado actual del juego para guardarlo en localstorage
  estadoActual() {
    return {
      pantalla: this.pantallaJuego.classList.contains("d-none") ? "inicial" : "juego", 
      jugador1: { 
        nombre: this.j1?.nombre ?? (this.inNombreJ1.value || "Jugador 1"),             
        rondasGanadas: this.j1?.rondasGanadas ?? 0                                     
      },
      jugador2: { 
        nombre: this.j2?.nombre ?? (this.inNombreJ2.value || "Jugador 2"),             
        rondasGanadas: this.j2?.rondasGanadas ?? 0                                    
      },
      t1: this.t1,                                                                      
      t2: this.t2,                                                                      
      mensaje: this.mensaje?.textContent ?? "Que comience el juego!",                
      dado: this.domDado?.textContent ?? "🎲",                                        
      botones: {                                                                        
        j1: this.btnJ1.disabled ? "off" : "on",
        j2: this.btnJ2.disabled ? "off" : "on"
      }
    };
  }

  // se guarda el estado en localStorage como un json
  guardarEstado() {
    try { 
      localStorage.setItem(this.LS_KEY, JSON.stringify(this.estadoActual())); // aca con stringify lo convierto a json
    }
    catch(e){ 
      console.warn("No se pudo guardar estado:", e);                         
    }
  }

  // se restaura desde localStorage si es que habia algo guardado
  restaurar() {
    try {
      const raw = localStorage.getItem(this.LS_KEY);         
      if (!raw) return false;                                
      const st = JSON.parse(raw); // con parse lo convierte de json a objeto                       

      this.mostrarPantalla(st.pantalla === "juego" ? "juego" : "inicial"); // muestro la pantalla correcta

      const n1 = st.jugador1?.nombre || "Jugador 1";        
      const n2 = st.jugador2?.nombre || "Jugador 2";         
      this.j1 = new Jugador(n1);                             
      this.j2 = new Jugador(n2);                             
      this.j1.rondasGanadas = st.jugador1?.rondasGanadas ?? 0; 
      this.j2.rondasGanadas = st.jugador2?.rondasGanadas ?? 0; 2

      this.inNombreJ1.value = n1;                           
      this.inNombreJ2.value = n2;
      this.lblNombreJ1.textContent = n1;                     
      this.lblNombreJ2.textContent = n2;

      this.t1 = st.t1 ?? 0;                                  
      this.t2 = st.t2 ?? 0;                                  
      this.lblTiradaJ1.textContent = this.t1 || "-";         
      this.lblTiradaJ2.textContent = this.t2 || "-";         
      this.lblRondasJ1.textContent = this.j1.rondasGanadas;  
      this.lblRondasJ2.textContent = this.j2.rondasGanadas;  2

      this.mensaje.textContent = st.mensaje || "Que comience el juego!";
      this.domDado.textContent = st.dado || "🎲";           

      this.btnJ1.disabled = (st.botones?.j1 === "off");     
      this.btnJ2.disabled = (st.botones?.j2 === "off");      

      return true;                                          
    } catch(e){
      console.warn("No se pudo restaurar estado:", e);       
      return false;
    }
  }

  // funcion para iniciar la partida
  iniciar() {
    const nombreJ1 = this.inNombreJ1.value || "Jugador 1";  //lo mismo que en reinciar
    const nombreJ2 = this.inNombreJ2.value || "Jugador 2";   

    this.j1 = new Jugador(nombreJ1);   // creo objetos jugador 1 y jugador 2                     
    this.j2 = new Jugador(nombreJ2);

    this.lblNombreJ1.textContent = this.j1.nombre;   // actualizo los nombres en la pantalla del juego       
    this.lblNombreJ2.textContent = this.j2.nombre;

    this.mostrarPantalla("juego");     // muestro la pantalla del juego                     
    this.prepararNuevaRonda(true);           // preparo la primera ronda del juego                 
    this.guardarEstado();            // guardo el estado actual en localstorage     
  }

  // funcion para reiniciar la partida
  reiniciar() {
    if (!this.j1 || !this.j2) {                               
      const n1 = this.inNombreJ1.value || "Jugador 1";        // si jugador 1 o jugador 2 no existen, los creo y le asigno por
      const n2 = this.inNombreJ2.value || "Jugador 2";        // defecto el nombre de Jugador 1 y Jugador 2
      this.j1 = new Jugador(n1);                              
      this.j2 = new Jugador(n2);
    } else {
      this.j1.resetear();                                    
      this.j2.resetear();                                     
    }

    this.lblRondasJ1.textContent = "0";                       
    this.lblRondasJ2.textContent = "0";                      
    this.dado.setCara(null);                               
    this.prepararNuevaRonda(true);                          
    this.guardarEstado();                                     
  }

  //funcion para volver al menu
  volverAlMenu() {
    this.mostrarPantalla("inicial");                          
    this.guardarEstado();                                    
  }

  //funcion para que el jugador 1 tire el dado
  async tirarJ1() {
    if (this.t2 !== 0) this.prepararNuevaRonda();            

    this.btnJ1.disabled = true; // si el j1 ya tiro desactivo su boton                            
    this.btnJ2.disabled = true;  // para evitar doble click de J1                             
    this.mensaje.textContent = "Tirando...";                  
    this.guardarEstado();                                     

    this.t1 = this.dado.tirar();                              
    await this.dado.animarHasta(this.t1);                     
    this.lblTiradaJ1.textContent = this.t1;                  

    this.btnJ2.disabled = false;                              
    this.mensaje.textContent = `Turno de ${this.j2.nombre}`;  
    this.guardarEstado();                                     
  }

  // funcion para que el jugador 2 tire el dado
  async tirarJ2() {
    this.btnJ1.disabled = true;                              
    this.btnJ2.disabled = true;                               
    this.mensaje.textContent = "Tirando...";                 
    this.guardarEstado();                                     

    this.t2 = this.dado.tirar();                              
    await this.dado.animarHasta(this.t2);                     
    this.lblTiradaJ2.textContent = this.t2;                  

    this.compararTiradas();                                   
  }

  // funcion para ver quien gano la ronda 
  compararTiradas() {
    let ganadorRonda = null;                                   

    if (this.t1 > this.t2) {                                 
      ganadorRonda = this.j1;
      this.mensaje.textContent = `${ganadorRonda.nombre} gano la ronda!`; 
      this.lblRondasJ1.textContent = this.j1.ganarRonda();     
    } else if (this.t2 > this.t1) {                           
      ganadorRonda = this.j2;
      this.mensaje.textContent = `${ganadorRonda.nombre} gano la ronda!`; 
      this.lblRondasJ2.textContent = this.j2.ganarRonda();     
    } else {
      this.mensaje.textContent = "Empate!";                  
    }

    // aca le digo la regla de que gana el juego el primer jugador en ganar 3 rondas
    if (this.j1.rondasGanadas === 3 || this.j2.rondasGanadas === 3) {
      this.mensaje.textContent = `${ganadorRonda.nombre} GANO EL JUEGO!`; 
      if (typeof confetti === "function") {                    
        confetti({ particleCount: 180, spread: 90, origin: { y: 0.7 } });
      }
      this.btnJ1.disabled = true;                            
      this.btnJ2.disabled = true;
      this.guardarEstado();                                   
      return;                                               
    }

    // Si aun nadie gano, preparo la siguiente ronda
    this.btnJ1.disabled = false;                               
    this.btnJ2.disabled = true;                               
    this.mensaje.textContent += ` — Turno de ${this.j1.nombre}`; 
    this.guardarEstado();                                      
  }
}
