// Exporto la clase para poder usarla desde otros archivos 
export default class Dado {

  // el constructor se ejecuta automaticamente al crear el dado recibe el elemento html donde se ve el dado
  constructor(domDado) {
    this.dom = domDado;                                       // guardo el elemento dom para usarlo despues
    this.CARAS = ["\u2680","\u2681","\u2682","\u2683","\u2684","\u2685"]; // caras del dado (con unicode)
  }

  // esta funcion simula tirar el dado devuelve un numero aleatorio entre 1 y 6
  tirar() {
    return Math.floor(Math.random() * 6) + 1;                 
  }

  // esta funcion hace la animacion del dado girando y lo deja mostrando la cara 
  async animarHasta(valor, ms = 600) {
    this.dom.textContent = "🎲";                              // muestro el emoji del dado mientras gira
    this.dom.classList.add("girando");                        // se activa la animacion css
    await new Promise(res => setTimeout(res, ms));            // espero un tiempo
    this.dom.classList.remove("girando");                     // desactivo la animación
    this.dom.textContent = this.CARAS[valor - 1];             // muestro la cara final
  }

  // muestra una cara sin animar, esto nos sirve para cuando queremos restaurar desde localstorage o iniciar el juego
  setCara(valor) {
    this.dom.textContent = valor ? this.CARAS[valor - 1] : "🎲"; // Si hay numero muestro cara sino un dado neutro
  }
}
