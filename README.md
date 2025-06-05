# Sistema de Gestión de Turnos

Este proyecto es un **sistema de reservas y gestión de jugadores**, desarrollado como entrega final para el curso de JavaScript en Coderhouse. La aplicación permite registrar jugadores, crear turnos de reserva, editar y eliminar tanto jugadores como reservas, y realizar validaciones en tiempo real.

---

## 🧩 Funcionalidades

- Registro, edición y eliminación de jugadores.
- Registro y edición de reservas.
- Gestión de fechas y horarios dinámicos.
- Validación de campos usando `validator.js`.
- Notificaciones con `SweetAlert2`.
- Interfaz responsive y componentes reutilizables.
- Datos persistentes con `localStorage`.

---

## ⚙️ Tecnologías utilizadas

- **JavaScript** Vanilla (modular)
- **HTML5** + **CSS3**
- **SweetAlert2** para formularios y mensajes
- **Day.js** para manejo de fechas
- **Validator.js** para validación de formularios

---

## 🗂 Estructura del proyecto

Separación clara de responsabilidades siguiendo buenas prácticas:

- `jugadores.js`: Lógica de validación y procesamiento de datos.
- `ui.js`: Renderizado dinámico y manipulación del DOM.
- `reservas.js`: Generación de fechas, horarios y disponibilidad.
- `funcionesGenericas.js`: Helpers para acceso a localStorage, validaciones comunes, notificaciones.

---

## 🚀 Instrucciones para correrlo

1. Clonar el repositorio o descargar el ZIP.
2. Abrir el archivo `index.html` en el navegador.
3. ¡Listo! Ya podés gestionar jugadores y reservas.

---

## ✅ Buenas prácticas aplicadas

- Código modular con responsabilidades separadas.
- Validación de datos antes de guardar.
- Uso de funciones puras y helpers reutilizables.
- Comentarios explicativos en todo el código.
- Reseteo correcto de formularios y manejo de selects.

---

## 📚 Aprendizajes

Este proyecto fue diseñado para demostrar dominio de:

- Manipulación del DOM con JS puro.
- Lógica de negocio sin frameworks.
- Manejo profesional de formularios, errores y UX.
- Programación orientada a funciones reutilizables.

---

Proyecto realizado como entrega final de **JavaScript - Coderhouse**
