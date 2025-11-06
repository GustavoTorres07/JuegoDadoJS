//le agrego export default para poder importar la clase en otros archivos
export default class Jugador {

    constructor(nombre = "Jugador") {
        this.nombre = nombre; // por si el usuario no ingresa ningun nombre le asignamos un valor por defecto
        this.rondasGanadas = 0; // aca inicializamos en 0 las rondas ganadas obviamente
    }

    ganarRonda(){
        this.rondasGanadas += 1; // para incrementar las rondas ganadas en 1
        return this.rondasGanadas; //aca devolvemos el valor actualizado de las rondas ganadas de cada jugador en caso de ganar una ronda
    }

        resetear() {
        this.rondasGanadas = 0; // vuelve a 0 rondas ganadas cuando reiniciamos el juego
    }

}