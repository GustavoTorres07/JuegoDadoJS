export default class Jugador {

  constructor(nombre = "Jugador") {
    this.nombre = nombre;       // Guardo el nombre del jugador
    this.rondasGanadas = 0;     // le inicializo las rondas ganadas en 0 obviamente
  }

  // funcion para aumentar en 1 las rondas ganadas y actualizar rondas ganadas
  ganarRonda() {
    this.rondasGanadas++;       
    return this.rondasGanadas;  
  }

  // Reinicia las rondas a cero
  resetear() {
    this.rondasGanadas = 0;
  }
}
