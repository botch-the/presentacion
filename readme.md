# ⚽ CanchaGol - Sistema de Reserva de Canchas de Fútbol

**CanchaGol** es una aplicación web responsive desarrollada con tecnologías nativas (HTML5, CSS3 y JavaScript ES6) para la gestión, consulta y reserva de canchas de fútbol sintéticas y naturales en línea, así como el seguimiento de torneos locales.

---

##  Información del Aprendiz
- **Nombre:** juan hernandez y david ccantillo
- **Programa:** Análisis y Desarrollo de Software (ADSO)
- **Institución:** Colombo aleman (SENA)
- **Ubicación:** malambo, Atlántico - Colombia

---
 Características Principales

- **Módulo CRUD con LocalStorage:** Permite crear, consultar, actualizar (editar) y eliminar reservas de canchas sin necesidad de una base de datos externa.
- **Consumo de API Pública:** Integración con la API de OpenWeather para mostrar la temperatura y el estado del clima en tiempo real.
- **Filtro y Buscador Dinámico:** Filtrado instantáneo por nombre y tipo de cancha (Fútbol 5, 8 o 11) en el catálogo.
- **Modo Oscuro / Claro:** Alternancia de temas visuales mediante botones interactivos con preferencia guardada en el navegador.
- **Diseño Responsive Nativo:** Construido exclusivamente con CSS Flexbox, CSS Grid y Media Queries sin frameworks como Bootstrap o Tailwind.
- **Validación de Formularios:** Control previo de entradas (campos vacíos, formato de correo y fechas válidas) en JavaScript.

---

##  Tecnologías Utilizadas

- **HTML5:** Estructura semántica y accesible.
- **CSS3:** Variables CSS, layouts modernos (Grid/Flexbox) y diseño adaptable.
- **JavaScript (ES6+):** Programación modular (`import`/`export`), manipulación del DOM, Fetch API y almacenamiento LocalStorage.

---

##  Estructura del Proyecto

```text
canchagol/
├── css/
│   └── styles.css          # Hojas de estilo globales (Nativo)
├── js/
│   ├── app.js              # Controlador e inicializador principal
│   ├── crud.js             # Módulo de operaciones CRUD (LocalStorage)
│   └── clima.js            # Módulo de consumo de API (OpenWeather)
├── pages/
│   ├── canchas.html        # Catálogo con buscador y filtros
│   ├── reservas.html       # Tabla interactiva del CRUD de reservas
│   ├── torneos.html        # Tablas de posiciones e inscripción
│   └── contacto.html       # Formulario y widget del clima
├── index.html              # Página de inicio / Landing page
└── README.md               # Documentación del proyecto
```
