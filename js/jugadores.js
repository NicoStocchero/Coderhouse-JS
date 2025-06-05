// ==== IMPORTACIONES ====
import {
  notificarError,
  notificarExito,
  obtenerDeLocalStorage,
  guardarEnLocalStorage,
  compruebaErrores,
} from "./funcionesGenericas.js";
import {
  renderizarJugadores,
  mostrarJugadoresRegistrados,
  manejarEventoEditarJugadores,
  manejarEventoEliminarJugadores,
} from "./ui.js";

// ==== UTILIDADES ====

// Esta función limpia y adapta el valor ingresado según el tipo de campo.
// Por ejemplo: quita espacios duplicados, convierte emails a minúsculas y deja solo números en teléfonos.
const normalizar = (campo, valor) => {
  let valorLimpio = valor.trim();
  if (campo === "nombre" || campo === "apellido") {
    valorLimpio = valorLimpio.replace(/\s+/g, " ");
  } else if (campo === "email") {
    valorLimpio = valorLimpio.toLowerCase();
  } else if (campo === "telefono") {
    valorLimpio = valorLimpio.replace(/\D/g, "");
  }
  return valorLimpio;
};

// Valida cada campo según su tipo. Devuelve un mensaje de error si hay algo incorrecto.
// Si el campo está bien, devuelve una cadena vacía.
const validarCampos = (campo, valor) => {
  const valorLimpio = normalizar(campo, valor);

  if (validator.isEmpty(valorLimpio)) {
    return `El campo ${campo} no puede estar vacío`;
  } else if (campo === "nombre" || campo === "apellido") {
    if (!validator.isAlpha(valorLimpio, "es-ES", { ignore: " " })) {
      return `El campo ${campo} solo puede contener letras y espacios`;
    }
    if (valorLimpio.length < 3 || valorLimpio.length > 100) {
      return `El campo ${campo} debe tener entre 3 y 100 caracteres`;
    }
  } else if (campo === "email") {
    if (!validator.isEmail(valorLimpio)) {
      return `El campo ${campo} debe ser un email válido`;
    }
    if (valorLimpio.length > 100) {
      return `El campo ${campo} no puede tener más de 100 caracteres`;
    }
  } else if (campo === "telefono") {
    if (!/^\d{10}$/.test(valorLimpio)) {
      return `El campo ${campo} debe contener exactamente 10 dígitos numéricos`;
    }
  }

  return "";
};

// ==== VALIDACIÓN Y PROCESAMIENTO DE FORMULARIOS ====

// Limpia los mensajes de error visibles en el formulario (los que se muestran debajo de cada campo)
const limpiarErroresEnFormulario = () => {
  document.querySelectorAll(".mensaje-error").forEach((e) => {
    e.textContent = "";
  });
};

// Muestra los errores validados en su respectivo elemento
const mostrarErroresEnFormulario = (errores) => {
  for (const campo in errores) {
    const errorElement = document.getElementById(`error-${campo}`);
    if (errorElement) {
      errorElement.textContent = errores[campo];
    }
  }
};

// Toma un objeto con datos crudos, los normaliza, valida y devuelve el resultado
// con una estructura que incluye: los datos limpios, los errores y si es válido o no
export const procesarJugadorDesdeObjeto = (datos) => {
  const normalizados = {
    nombre: normalizar("nombre", datos.nombre),
    apellido: normalizar("apellido", datos.apellido),
    email: normalizar("email", datos.email),
    telefono: normalizar("telefono", datos.telefono),
  };

  const errores = {};
  for (const campo in normalizados) {
    errores[campo] = validarCampos(campo, normalizados[campo]);
  }

  return {
    datos: normalizados,
    errores,
    valido: !compruebaErrores(errores),
  };
};

// Extrae los datos del formulario HTML y los pasa al procesador anterior
export const procesarJugadorDesdeForm = (form) => {
  const datos = Object.fromEntries(new FormData(form).entries());
  return procesarJugadorDesdeObjeto(datos);
};

// ==== CRUD JUGADORES ====

// Inicializa el formulario de registro de jugador y maneja su evento submit
export const formularioNuevoJugador = () => {
  const form = document.getElementById("formulario-jugador");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const resultado = procesarJugadorDesdeForm(form);

    if (resultado.valido) {
      const fueGuardadoEnLocalStorage = agregarJugadorEnLocalStorage(
        resultado.datos
      );
      limpiarErroresEnFormulario();

      if (fueGuardadoEnLocalStorage) {
        notificarExito({
          titulo: "Jugador creado con éxito",
          html: `
            <b>Nombre:</b> ${resultado.datos.nombre} ${resultado.datos.apellido}<br>
            <b>Email:</b> ${resultado.datos.email}<br>
            <b>Teléfono:</b> ${resultado.datos.telefono}
          `,
        });

        renderizarJugadores();
        form.reset();
      }
    } else {
      limpiarErroresEnFormulario();
      mostrarErroresEnFormulario(resultado.errores);
    }
  });
};

// Guarda un nuevo jugador en localStorage, validando duplicados por email y teléfono
const agregarJugadorEnLocalStorage = (jugador) => {
  const jugadores = obtenerDeLocalStorage("jugadores") || [];

  if (jugadores.some((jug) => jug.email === jugador.email)) {
    notificarError({ mensaje: "Ya existe un jugador con ese email." });
    return;
  }

  if (jugadores.some((jug) => jug.telefono === jugador.telefono)) {
    notificarError({ mensaje: "Ya existe un jugador con ese teléfono." });
    return;
  }

  jugador.id = crypto.randomUUID();
  jugadores.push(jugador);
  guardarEnLocalStorage("jugadores", jugadores);
  return true;
};

// Elimina un jugador del localStorage por ID
export const eliminarJugadorDeLocalStorage = (id) => {
  const jugadores = obtenerDeLocalStorage("jugadores") || [];
  try {
    const actualizados = jugadores.filter((jugador) => jugador.id !== id);
    guardarEnLocalStorage("jugadores", actualizados);
    return jugadores.length !== actualizados.length;
  } catch (error) {
    notificarError({
      mensaje: "Error al eliminar el jugador. Intente nuevamente.",
    });
  }
};

// Inicializar Jugadores
export const inicializarModuloJugadores = () => {
  formularioNuevoJugador();
  mostrarJugadoresRegistrados();
  manejarEventoEditarJugadores();
  manejarEventoEliminarJugadores();
};
