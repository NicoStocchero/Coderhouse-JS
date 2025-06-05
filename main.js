import { inicializarModuloJugadores } from "./js/jugadores.js";
import { inicializarModuloReservas } from "./js/reservas.js";

// Inicializar módulos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarModuloJugadores();
  inicializarModuloReservas();
});
