// ==== IMPORTACIONES ====
import {
  obtenerDeLocalStorage,
  guardarEnLocalStorage,
  notificarExito,
  notificarError,
} from "./funcionesGenericas.js";

import {
  mostrarReservasRegistradas,
  manejarEventoEditarReservas,
  manejarEventoEliminarReservas,
} from "./ui.js";

// ==== GENERACIÓN DE FECHAS Y HORARIOS ====

// Genera un array de fechas disponibles para los próximos 7 días
// Cada item incluye una fecha en formato ISO y una etiqueta formateada para la UI
export const generarFechasDisponibles = () => {
  const fechasDisponibles = [];
  const fechaActual = dayjs();
  for (let i = 0; i < 7; i++) {
    const sumarDias = fechaActual.add(i, "day");
    const fechaFormateada = sumarDias.locale("es").format("ddd D MMMM");
    fechasDisponibles.push({
      fecha: sumarDias.format("YYYY-MM-DD"),
      etiqueta: fechaFormateada,
    });
  }
  return fechasDisponibles;
};

// Genera los horarios del día en bloques de 30 minutos, desde 8:00 hasta 23:00
// Cada horario incluye la hora formateada y una marca de disponibilidad
export const generarHorariosDelDia = () => {
  const horarios = [];
  let horaInicio = dayjs().startOf("day").hour(8);
  const horaFin = dayjs().startOf("day").hour(23);
  while (horaInicio.isBefore(horaFin)) {
    const horaFormateada = horaInicio.format("HH:mm");
    horarios.push({ hora: horaFormateada, disponible: true });
    horaInicio = horaInicio.add(30, "minute");
  }
  return horarios;
};

// Actualiza la propiedad "disponible" de cada horario según la fecha seleccionada
export const disponibilidadHorarios = (horarios, fechaSeleccionada) => {
  const horaActual = dayjs();
  const hoy = dayjs(fechaSeleccionada).isSame(horaActual, "day");
  const fechaPasada = dayjs(fechaSeleccionada).isBefore(horaActual, "day");
  const reservas = obtenerDeLocalStorage("reservas") || [];
  const reservasDelDia = reservas.filter(
    (reserva) => reserva.fecha === fechaSeleccionada
  );
  for (const horario of horarios) {
    const horaCompleta = `${fechaSeleccionada} ${horario.hora}`;
    const yaReservado = reservasDelDia.some(
      (reserva) => reserva.hora === horario.hora
    );
    if (fechaPasada) {
      horario.disponible = false;
    } else if (hoy) {
      const horaSeleccionada = dayjs(horaCompleta);
      horario.disponible = horaSeleccionada.isAfter(horaActual) && !yaReservado;
    } else {
      horario.disponible = !yaReservado;
    }
  }
};

// ==== SELECTS DINÁMICOS ====

// Carga las fechas y horarios disponibles en los select del formulario
const inicializarSelect = (
  idSelect,
  datos,
  obtenerValor,
  obtenerTexto,
  incluirPlaceholder = false
) => {
  const select = document.getElementById(idSelect);
  select.innerHTML = "";
  if (incluirPlaceholder) {
    const placeholder = document.createElement("option");
    placeholder.textContent = "Seleccionar una opción";
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
  }
  datos.forEach((item) => {
    const option = document.createElement("option");
    option.value = obtenerValor(item);
    option.textContent = obtenerTexto(item);
    if ("disponible" in item && item.disponible === false) {
      option.disabled = true;
      option.textContent += " (no disponible)";
    }
    select.appendChild(option);
  });
};

// Inicializa todos los selects del formulario
export const iniciarTodosLosSelect = () => {
  const fechas = generarFechasDisponibles();
  inicializarSelect(
    "select-fecha",
    fechas,
    (fecha) => fecha.fecha,
    (fecha) => fecha.etiqueta,
    true
  );
  const jugadores = obtenerDeLocalStorage("jugadores") || [];
  inicializarSelect(
    "select-jugador",
    jugadores,
    (jugador) => jugador.id,
    (jugador) => jugador.nombre + " " + jugador.apellido,
    true
  );
  document
    .getElementById("select-fecha")
    .addEventListener("change", actualizarSelectHorario);
};

// Actualiza dinámicamente el select de horarios según la fecha seleccionada
export const actualizarSelectHorario = () => {
  const fechaSeleccionada = document.getElementById("select-fecha").value;
  const horarios = generarHorariosDelDia();
  disponibilidadHorarios(horarios, fechaSeleccionada);
  const horariosDisponibles = horarios.filter((horario) => horario.disponible);
  inicializarSelect(
    "select-hora",
    horariosDisponibles,
    (horario) => horario.hora,
    (horario) => horario.hora,
    true
  );
};

// ==== RESERVAS ====

// Guarda una nueva reserva en el localStorage
const guardarReserva = (reserva) => {
  const reservas = obtenerDeLocalStorage("reservas") || [];
  reservas.push(reserva);
  guardarEnLocalStorage("reservas", reservas);
  return true;
};

// Crea una nueva reserva a partir del formulario y la guarda
export const nuevaReserva = () => {
  const jugadorSelect = document.getElementById("select-jugador");
  const jugador = jugadorSelect.value;
  const nombreJugador = jugadorSelect.options[jugadorSelect.selectedIndex].text;
  const fecha = document.getElementById("select-fecha").value;
  const hora = document.getElementById("select-hora").value;

  if (!jugador || !nombreJugador || !fecha || !hora) {
    notificarError({ mensaje: "Por favor, completa todos los campos." });
    return;
  }

  const datosNuevaReserva = {
    id: crypto.randomUUID(),
    jugador,
    nombreJugador,
    fecha,
    hora,
  };

  guardarReserva(datosNuevaReserva);

  notificarExito({
    titulo: "Reserva creada con éxito",
    html: `<b>Jugador:</b> ${nombreJugador}<br><b>Fecha:</b> ${fecha}<br><b>Hora:</b> ${hora}`,
  });

  document.getElementById("formulario-reserva").reset();
  jugadorSelect.selectedIndex = 0;
  document.getElementById("select-fecha").selectedIndex = 0;
  document.getElementById(
    "select-hora"
  ).innerHTML = `<option selected disabled value="">Seleccionar una opción</option>`;
};

// Elimina una reserva del localStorage por ID
export const eliminarReservaDeLocalStorage = (id) => {
  const reservas = obtenerDeLocalStorage("reservas") || [];
  const reservasActualizadas = reservas.filter((reserva) => reserva.id !== id);
  guardarEnLocalStorage("reservas", reservasActualizadas);
  return reservas.length !== reservasActualizadas.length;
};

// Actualiza una reserva en el localStorage por ID
export const actualizarReservaEnLocalStorage = (id, nuevaReserva) => {
  const reservas = obtenerDeLocalStorage("reservas") || [];
  const nuevas = reservas.map((reserva) =>
    reserva.id === id ? nuevaReserva : reserva
  );
  guardarEnLocalStorage("reservas", nuevas);
};

// Inicializar Rservas
export const inicializarModuloReservas = () => {
  iniciarTodosLosSelect();
  mostrarReservasRegistradas();
  manejarEventoEliminarReservas();
  manejarEventoEditarReservas();

  const form = document.getElementById("formulario-reserva");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    nuevaReserva();
  });
};
