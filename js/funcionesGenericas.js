// ==== VALIDACIONES BÁSICAS ====

// Devuelve true si algún campo contiene un mensaje de error
export const compruebaErrores = (errores) => {
  for (const campo in errores) {
    if (errores[campo] !== "") {
      return true;
    }
  }
  return false;
};

// Verifica si la lista es un array válido y contiene al menos un elemento
export const hayElementos = (lista) => Array.isArray(lista) && lista.length > 0;

// Crea un intervalo de reserva basado en fecha, hora de inicio y duración (en minutos)
export const crearIntervaloReserva = ({ fecha, horaInicio, duracion }) => {
  const inicio = dayjs(`${fecha} ${horaInicio}`);
  const fin = inicio.add(duracion, "minute");
  return { inicio, fin };
};

// ==== MANEJO DE LOCALSTORAGE ====

export const guardarEnLocalStorage = (clave, valor) => {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    notificarError({
      mensaje: "No se pudo guardar la información en el almacenamiento local.",
      error,
    });
  }
};

export const obtenerDeLocalStorage = (clave) => {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : null;
  } catch (error) {
    notificarError({
      mensaje: "No se pudo obtener la información del almacenamiento local.",
      error,
    });
  }
};

export const eliminarDeLocalStorage = (clave) => {
  try {
    localStorage.removeItem(clave);
  } catch (error) {
    notificarError({
      mensaje: "No se pudo eliminar la información del almacenamiento local.",
      error,
    });
  }
};

// ==== MENSAJES Y NOTIFICACIONES ====

// Crea un mensaje <p> con clase, texto y atributo aria-live
const crearMensaje = (texto, clase, ariaLive) => {
  const p = document.createElement("p");
  p.className = clase;
  p.setAttribute("aria-live", ariaLive);
  p.textContent = texto;
  return p;
};

// Mensaje para listas vacías (por defecto clase: mensaje-vacio)
export const crearMensajeVacio = (texto, clase = "mensaje-vacio") =>
  crearMensaje(texto, clase, "polite");

// Muestra una notificación de éxito con SweetAlert2
export const notificarExito = ({ titulo, mensaje, html }) => {
  Swal.fire({
    icon: "success",
    title: titulo || undefined,
    text: mensaje || undefined,
    html: html || undefined,
    confirmButtonText: "Aceptar",
  });
};

// Muestra una notificación de error con SweetAlert2
export const notificarError = ({ titulo = "", mensaje = "" }) => {
  Swal.fire({
    icon: "error",
    title: titulo || undefined,
    text: mensaje || "Ocurrió un error inesperado.",
  });
};

// Muestra un modal de confirmación con SweetAlert2 y devuelve true si se acepta
export const notificarConfirmacion = async ({
  titulo,
  mensaje,
  confirmText = "Sí",
  cancelText = "Cancelar",
}) => {
  const resultado = await Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
  return resultado.isConfirmed;
};

// ==== OPERACIONES GENERALES SOBRE REGISTROS ====

// Busca un registro por ID dentro del tipo (jugadores, reservas, etc.) y lo devuelve
export const editarRegistro = (id, tipo) => {
  const registros = obtenerDeLocalStorage(tipo);
  const registro = registros.find((item) => item.id === id);
  if (!registro) return;
  return { registro };
};

// Escucha clics sobre botones de edición y ejecuta la función pasada con los datos
export const manejarEventoEditar = ({
  contenedor,
  tipo,
  etiqueta,
  selector,
  funcion,
}) => {
  if (!contenedor || !selector || typeof funcion !== "function") {
    throw new Error("Faltan parámetros obligatorios");
  }

  contenedor.addEventListener("click", (event) => {
    const botonEditar = event.target.closest(selector);
    if (!botonEditar) return;

    const id = botonEditar.dataset.id;
    const resultado = editarRegistro(id, tipo);
    if (!resultado) return;

    const { registro } = resultado;
    if (!registro) return;

    funcion(id, tipo, etiqueta, registro);
  });
};

// Elimina un registro si el usuario confirma y ejecuta una función extra si se pasa
const eliminarRegistro = async (id, tipo, etiqueta, contenedor, funcion) => {
  const registros = obtenerDeLocalStorage(tipo);
  const nuevoRegistro = registros.filter((item) => item.id !== id);

  const confirmado = await notificarConfirmacion({
    titulo: "¿Estás seguro?",
    mensaje: `¿Quieres eliminar el ${etiqueta}?`,
  });

  if (confirmado) {
    guardarEnLocalStorage(tipo, nuevoRegistro);

    const elementoAEliminar = contenedor.querySelector(`[data-id="${id}"]`);
    if (elementoAEliminar) {
      contenedor.removeChild(elementoAEliminar);
    }

    notificarExito({
      titulo: "Eliminado",
      mensaje: `${etiqueta} se ha eliminado con éxito`,
    });

    if (typeof funcion === "function") {
      funcion();
    }
  }
};

// Asocia evento de eliminación a un contenedor y delega a eliminarRegistro
export const manejarEventoEliminar = (contenedor, tipo, etiqueta, funcion) => {
  contenedor.addEventListener("click", (event) => {
    const botonEliminar = event.target.closest(".btn-eliminar");
    if (botonEliminar) {
      const id = botonEliminar.dataset.id;
      eliminarRegistro(id, tipo, etiqueta, contenedor, funcion);
    }
  });
};

// Reemplaza un registro editado, evitando duplicados por email o teléfono si aplica
export const guardarRegistroEditado = (tipo, id, registroEditado) => {
  const registros = obtenerDeLocalStorage(tipo) || [];
  const index = registros.findIndex((item) => item.id === id);
  if (index === -1) return false;

  const esJugador = "email" in registroEditado && "telefono" in registroEditado;
  const repetido = esJugador
    ? registros.some(
        (item) =>
          item.id !== id &&
          (item.email === registroEditado.email ||
            item.telefono === registroEditado.telefono)
      )
    : false;

  if (repetido) {
    notificarError({
      mensaje: "Ya existe un registro con ese email o teléfono.",
    });
    return false;
  }

  const registrosActualizados = registros.map((registro) =>
    registro.id === id ? { ...registro, ...registroEditado } : registro
  );

  guardarEnLocalStorage(tipo, registrosActualizados);
  return true;
};
