# Sistema de Gestión de Turnos

Este proyecto es un **sistema de reservas y gestión de jugadores**, desarrollado como entrega final para el curso de JavaScript en Coderhouse. La aplicación permite registrar jugadores, crear turnos de reserva, editar y eliminar tanto jugadores como reservas, y realizar validaciones en tiempo real.

---

## Aclaraciones sobre esta entrega

- Esta versión del proyecto es una reestructuración total respecto a mi propuesta anterior. Si bien el sistema anterior ya funcionaba correctamente y seguía buenas prácticas como modularización, Clean Architecture y separación de responsabilidades, el enfoque no coincidía con lo enseñado durante la cursada.

- Por ese motivo, decidí rehacer todo el sistema de reservas **desde cero**, manteniéndome 100% dentro del marco que se pidió en la última clase y en las consignas del curso: sin estructura modular, sin separación por archivos ni carpetas, y concentrando la lógica en un máximo de 2–3 archivos como se sugirió.

- **Evité el uso de múltiples archivos JS separados** (como en mi proyecto original), ya que entiendo que eso podría perjudicar la performance con JS Vanilla si se lleva a un entorno real y, sobre todo, que escapa al espíritu del proyecto evaluado. Aunque no comparto completamente ese criterio desde el punto de vista profesional, acepto que este proyecto es académico y me adecué a lo solicitado.

- Decidí **no usar un archivo `.json` externo** ni simular datos remotos, ya que en esta versión más simplificada no había lógica que justificara su uso. En mi otro proyecto esto tenía sentido porque existía una lógica asíncrona para cargar jugadores, reservas, turnos pasados, etc. Aquí opté por usar únicamente `localStorage`.

- **El CSS es heredado** de la primera versión del proyecto, ya que estaba bien estructurado visualmente. No lo recorté ni lo reescribí por completo para no perder claridad visual, aunque muchas funciones visuales (como estadísticas o filtros) fueron removidas para cumplir la consigna de no tener múltiples módulos.

- Intenté aplicar **buenas prácticas de desarrollo** dentro del nuevo esquema: reutilizar funciones cuando era posible, mantener una nomenclatura clara, encapsular lógica en funciones individuales y validar correctamente los datos. Aún así, admito que el código podría contener algunos errores menores por el poco tiempo que tuve para rearmarlo completo.

- **Clean Architecture no fue aplicada en esta entrega**, ya que entendí que, para esta etapa, su implementación era contraproducente. Me pareció más valioso mostrar que sé adaptarme a las necesidades y contexto de la consigna.

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
