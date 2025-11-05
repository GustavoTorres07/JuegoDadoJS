//le agrego export default para poder importar la clase en otros archivos
export default class Jugador {

    constructor(nombre = "Jugador") {
        this.nombre = nombre; // por si no pone ningun nombre el usuario le asignamos un valor por defecto
        this.rondasGanadas = 0;
    }

    ganarRonda(){
        this.rondasGanadas += 1; // para incrementar las rondas ganadas en 1
        return this.rondasGanadas;
    }

        resetear() {
        this.rondasGanadas = 0; // vuelve a 0 para reiniciar el juego
    }

}