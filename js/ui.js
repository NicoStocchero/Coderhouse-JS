// ==== IMPORTACIONES ====
import {
  obtenerDeLocalStorage,
  hayElementos,
  manejarEventoEditar,
  manejarEventoEliminar,
  notificarExito,
  notificarError,
  crearMensajeVacio,
  guardarRegistroEditado,
} from "./funcionesGenericas.js";

import { procesarJugadorDesdeObjeto } from "./jugadores.js";

import {
  actualizarReservaEnLocalStorage,
  generarFechasDisponibles,
  generarHorariosDelDia,
  disponibilidadHorarios,
} from "./reservas.js";

// ==== UTILS DOM ====
// Crea un mensaje genérico para mostrar en caso de que no haya elementos
export const crearElemento = (tag, clases = "", texto = "") => {
  const elemento = document.createElement(tag);
  if (clases)
    clases.split(" ").forEach((clase) => elemento.classList.add(clase));
  if (texto) elemento.textContent = texto;
  return elemento;
};

// Crea un elemento HTML con un icon
export const crearIcono = (clases) => {
  const icono = document.createElement("i");
  icono.className = clases;
  icono.setAttribute("aria-hidden", "true");
  return icono;
};

// Crea un párrafo con un icono y un texto
export const crearParrafoConIcono = (iconoClases, texto) => {
  const p = crearElemento("p", "dato-icono");
  const icono = crearIcono(iconoClases);
  const span = document.createElement("span");
  span.textContent = texto;
  p.append(icono, span);
  return p;
};

// Crea un badge (etiqueta) con un texto y clases opcionales
export const crearBadge = (texto, clases = "badge-activo") => {
  return crearElemento("span", `badge ${clases}`, texto);
};

// Crea un botón interactivo con texto, clase, tipo, icono y dataset
const crearBotonInteractivo = ({
  texto,
  clase,
  tipo = "button",
  icono = "",
  dataset = {},
  clasesExtra = [],
  onClick,
  usarHTML = false,
}) => {
  const boton = document.createElement("button");
  boton.classList.add(clase);
  clasesExtra.forEach((claseExtra) => boton.classList.add(claseExtra));
  boton.type = tipo;

  if (icono) {
    const iconoElemento = document.createElement("i");
    iconoElemento.className = icono;
    boton.appendChild(iconoElemento);
  }

  if (usarHTML) boton.innerHTML += texto;
  else boton.textContent += texto;

  Object.entries(dataset).forEach(([clave, valor]) => {
    boton.dataset[clave] = valor;
  });
  // Object.entries se utiliza para iterar sobre las propiedades del objeto dataset
  // A modo de explicacion, si dataset es { id: "123" }, se agregará un atributo data-id="123" al botón.

  if (typeof onClick === "function") {
    boton.addEventListener("click", onClick);
  }

  return boton;
};

export const renderizarLista = (items, contenedor, crearElemento) => {
  contenedor.innerHTML = "";
  if (hayElementos(items)) {
    items.forEach((item) => contenedor.appendChild(crearElemento(item)));
  } else {
    contenedor.appendChild(crearMensajeVacio("No hay elementos registrados"));
  }
};

// ==== JUGADORES ====

const contenedorIDJugadores = "lista-jugadores";

// Inicializa el módulo de jugadores
export const renderizarJugadores = () => {
  document.getElementById(contenedorIDJugadores).innerHTML = "";
  mostrarJugadoresRegistrados();
};

export const crearCardJugador = (jugador) => {
  const div = document.createElement("div");
  div.classList.add("jugador");
  div.dataset.id = jugador.id;
  div.appendChild(crearContenidoJugador(jugador));
  return div;
};

const crearContenidoJugador = (jugador) => {
  const cardBody = crearElemento("div", "card-body");
  const infoJugador = crearElemento("div", "info-jugador");
  const headerJugador = crearElemento("div", "header-jugador");
  const iconoCard = crearIcono("fa-solid fa-user icono-card");
  const nombreJugador = crearElemento("h3", "nombre-jugador");
  nombreJugador.append(`${jugador.nombre} ${jugador.apellido}`);
  nombreJugador.appendChild(crearBadge("Activo"));
  headerJugador.append(iconoCard, nombreJugador);
  infoJugador.append(headerJugador);
  infoJugador.append(
    crearParrafoConIcono("fa-solid fa-envelope", jugador.email),
    crearParrafoConIcono("fa-solid fa-phone", jugador.telefono)
  );

  const acciones = crearElemento("div", "acciones-jugador");
  acciones.append(
    crearBotonInteractivo({
      clase: "boton-secundario",
      clasesExtra: ["btn-editar-jugador", "boton--chico"],
      texto: "Editar",
      dataset: { id: jugador.id },
      icono: "fa-solid fa-pen",
    }),
    crearBotonInteractivo({
      clase: "boton-principal",
      clasesExtra: ["btn-eliminar", "boton--chico"],
      texto: "Eliminar",
      dataset: { id: jugador.id },
      icono: "fa-solid fa-trash",
    })
  );

  cardBody.append(infoJugador, acciones);
  return cardBody;
};

export const mostrarJugadoresRegistrados = () => {
  const jugadores = obtenerDeLocalStorage("jugadores") || [];
  const contenedor = document.getElementById(contenedorIDJugadores);
  renderizarLista(jugadores, contenedor, crearCardJugador);
};

export const manejarEventoEliminarJugadores = () => {
  const contenedor = document.getElementById(contenedorIDJugadores);
  manejarEventoEliminar(
    contenedor,
    "jugadores",
    "jugador",
    renderizarJugadores
  );
};

export const manejarEventoEditarJugadores = () => {
  manejarEventoEditar({
    contenedor: document.getElementById("lista-jugadores"),
    tipo: "jugadores",
    etiqueta: "jugador",
    selector: ".btn-editar-jugador",
    funcion: mostrarModalEditarJugador,
  });
};

const crearFormularioJugadorEditable = (jugador) => `
  <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${jugador.nombre}" />
  <input id="swal-apellido" class="swal2-input" placeholder="Apellido" value="${jugador.apellido}" />
  <input id="swal-email" class="swal2-input" placeholder="Email" value="${jugador.email}" />
  <input id="swal-telefono" class="swal2-input" placeholder="Teléfono" value="${jugador.telefono}" />
`;

const obtenerDatosModalJugador = () => {
  const popup = Swal.getPopup();
  return {
    nombre: popup.querySelector("#swal-nombre").value,
    apellido: popup.querySelector("#swal-apellido").value,
    email: popup.querySelector("#swal-email").value,
    telefono: popup.querySelector("#swal-telefono").value,
  };
};

const mostrarModalEditarJugador = (id, tipo, etiqueta, jugador) => {
  Swal.fire({
    title: `Editar ${etiqueta}`,
    html: crearFormularioJugadorEditable(jugador),
    focusConfirm: false,
    preConfirm: () => {
      const datos = obtenerDatosModalJugador();
      const resultado = procesarJugadorDesdeObjeto(datos);
      if (!resultado.valido) {
        const primerError = Object.values(resultado.errores).find(Boolean);
        Swal.showValidationMessage(primerError);
        return false;
      }
      const fueEditado = guardarRegistroEditado(tipo, id, resultado.datos);
      if (!fueEditado) {
        notificarError({ mensaje: `No se pudo actualizar el ${etiqueta}.` });
        return false;
      }
      return resultado.datos;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      notificarExito({
        titulo: `${etiqueta} actualizado`,
        mensaje: `Los datos se guardaron correctamente.`,
      });
      renderizarJugadores();
    }
  });
};

// ==== RESERVAS ====

const contenedorIDReservas = "lista-reservas";

export const crearCardReserva = (reserva) => {
  const div = document.createElement("div");
  div.classList.add("reserva");
  div.dataset.id = reserva.id;
  div.appendChild(crearContenidoReserva(reserva));
  return div;
};

const crearContenidoReserva = (reserva) => {
  const cardBody = crearElemento("div", "card-body");
  const cabecera = crearElemento("div", "cabecera-reserva");
  const fecha = crearElemento(
    "div",
    "cabecera-fecha",
    dayjs(reserva.fecha).format("D [de] MMM")
  );
  const lineaInferior = crearElemento("div", "cabecera-inferior");
  const horario = crearElemento("span", "dato-horario", reserva.hora);
  lineaInferior.append(horario, fecha);
  cabecera.append(lineaInferior);
  const headerJugador = crearElemento("div", "header-jugador");
  const iconoCard = crearIcono("fa-solid fa-user icono-card");
  const jugador = crearElemento("p", "jugador-reserva", reserva.nombreJugador);
  headerJugador.append(iconoCard, jugador);
  const separador = crearElemento("div", "linea-separadora");
  const acciones = crearElemento("div", "acciones-reserva");
  acciones.append(
    crearBotonInteractivo({
      clase: "boton-secundario",
      clasesExtra: ["btn-editar-reserva", "boton--chico"],
      texto: "Editar",
      dataset: { id: reserva.id },
      icono: "fa-solid fa-pen",
    }),
    crearBotonInteractivo({
      clase: "boton-principal",
      clasesExtra: ["btn-eliminar", "boton--chico"],
      texto: "Eliminar",
      dataset: { id: reserva.id },
      icono: "fa-solid fa-trash",
    })
  );
  cardBody.append(cabecera, headerJugador, separador, acciones);
  return cardBody;
};

export const mostrarReservasRegistradas = () => {
  const reservas = obtenerDeLocalStorage("reservas") || [];
  const contenedor = document.getElementById(contenedorIDReservas);
  renderizarLista(reservas, contenedor, crearCardReserva);
};

export const manejarEventoEliminarReservas = () => {
  const contenedor = document.getElementById(contenedorIDReservas);
  manejarEventoEliminar(
    contenedor,
    "reservas",
    "reserva",
    mostrarReservasRegistradas
  );
};

export const manejarEventoEditarReservas = () => {
  manejarEventoEditar({
    contenedor: document.getElementById("lista-reservas"),
    tipo: "reservas",
    etiqueta: "reserva",
    selector: ".btn-editar-reserva",
    funcion: mostrarModalEditarReserva,
  });
};

const crearFormularioReservaEditable = (reserva) => `
  <select id="swal-jugador" class="swal2-input" style="width:100%; margin-bottom:1rem;">
    ${generarOpcionesJugadores(reserva.jugador)}
  </select>
  <select id="swal-fecha" class="swal2-input" style="width:100%; margin-bottom:1rem;">
    ${generarOpcionesFechas(reserva.fecha)}
  </select>
  <select id="swal-hora" class="swal2-input" style="width:100%; margin-bottom:1rem;">
    ${generarOpcionesHorarios(reserva.fecha, reserva.hora)}
  </select>
`;

const mostrarModalEditarReserva = (id, etiqueta, reserva) => {
  const fechaISO = dayjs(reserva.fecha).format("YYYY-MM-DD");

  Swal.fire({
    title: `Editar ${etiqueta}`,
    html: crearFormularioReservaEditable({ ...reserva, fecha: fechaISO }),
    focusConfirm: false,
    preConfirm: () => {
      const popup = Swal.getPopup();
      const jugador = popup.querySelector("#swal-jugador").value;
      const fecha = popup.querySelector("#swal-fecha").value;
      const hora = popup.querySelector("#swal-hora").value;
      if (!jugador || !fecha || !hora) {
        Swal.showValidationMessage("Todos los campos son obligatorios.");
        return false;
      }
      const jugadorData = obtenerDeLocalStorage("jugadores").find(
        (jug) => jug.id === jugador
      );
      const nombreJugador = `${jugadorData.nombre} ${jugadorData.apellido}`;
      const nueva = { id, jugador, nombreJugador, fecha, hora };
      actualizarReservaEnLocalStorage(id, nueva);
      return nueva;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      notificarExito({
        titulo: "Reserva actualizada",
        mensaje: "Los datos se guardaron correctamente.",
      });
      mostrarReservasRegistradas();
    }
  });
};

//  ==== GENERACIÓN DE OPCIONES PARA SELECTS DE EDICION ====

export const generarOpcionesJugadores = (valorActual) => {
  const jugadores = obtenerDeLocalStorage("jugadores") || [];
  return jugadores
    .map(
      (jugador) => `
        <option value="${jugador.id}" ${
        jugador.id === valorActual ? "selected" : ""
      }>
          ${jugador.nombre} ${jugador.apellido}
        </option>
      `
    )
    .join("");
};

export const generarOpcionesFechas = (valorActual) => {
  const fechas = generarFechasDisponibles();
  return fechas
    .map(
      (fecha) => `
        <option value="${fecha.fecha}" ${
        fecha.fecha === valorActual ? "selected" : ""
      }>
          ${fecha.etiqueta}
        </option>
      `
    )
    .join("");
};

const generarOpcionesHorarios = (fechaSeleccionada, valorActual) => {
  const horarios = generarHorariosDelDia();
  disponibilidadHorarios(horarios, fechaSeleccionada);
  const disponibles = horarios.filter(
    (hora) => hora.disponible || hora.hora === valorActual
  );
  return disponibles
    .map(
      (hora) => `
        <option value="${hora.hora}" ${
        hora.hora === valorActual ? "selected" : ""
      }>
          ${hora.hora}
        </option>
      `
    )
    .join("");
};
