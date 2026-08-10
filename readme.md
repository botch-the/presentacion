# ⚽ CanchaGol - Sistema de Reserva de Canchas de Fútbol

**CanchaGol** es una aplicación web responsive desarrollada con tecnologías nativas (HTML5, CSS3 y JavaScript ES6) y el framework **Bootstrap 5**, para la gestión, consulta y reserva de canchas de fútbol sintéticas y naturales en línea, así como el seguimiento de torneos locales.

---

## Información del Aprendiz
- **Nombre:** Juan Hernández y David Cantillo
- **Programa:** Análisis y Desarrollo de Software (ADSO)
- **Institución:** Centro Nacional Colombo Alemán (SENA)
- **Ubicación:** Malambo, Atlántico - Colombia

---

## Características Principales
- **Módulo CRUD con LocalStorage:** Permite crear, consultar, actualizar (editar) y eliminar reservas de canchas sin necesidad de una base de datos externa.
- **Consumo de API Pública:** Integración con la API de OpenWeather para mostrar la temperatura y el estado del clima en tiempo real.
- **Filtro y Buscador Dinámico:** Filtrado instantáneo por nombre y tipo de cancha (Fútbol 5, 9 o 11) en el catálogo.
- **Modo Oscuro / Claro:** Alternancia de temas visuales mediante botones interactivos con preferencia guardada en el navegador.
- **Diseño Responsive:** Construido con **Bootstrap 5** (sistema de grillas, componentes y utilidades) combinado con CSS Flexbox, CSS Grid y Media Queries personalizadas para ajustes adicionales.
- **Validación de Formularios:** Control previo de entradas (campos vacíos, formato de correo y fechas válidas) en JavaScript, apoyado en las clases de validación de Bootstrap.

---

## Tecnologías Utilizadas
- **HTML5:** Estructura semántica y accesible.
- **CSS3:** Variables CSS, layouts modernos (Grid/Flexbox) y diseño adaptable.
- **Bootstrap 5:** Framework CSS para maquetación responsive, componentes (navbar, cards, modales, formularios) y sistema de grillas.
- **JavaScript (ES6+):** Programación modular (`import`/`export`), manipulación del DOM, Fetch API y almacenamiento LocalStorage.


taller_juan_1/
└──── assets/                  # Recursos estáticos varios (fuentes, extras)
    ├── css/
    │   └── styles.css           # Hoja de estilos global (colores, layout, diseño)
    ├── icons/                   # Íconos de la interfaz
    ├── img/
    │   ├── cancha1.jpeg         # Fotos de las canchas deportivas
    │   ├── cancha2.jpeg
    │   ├── cancha3.jpeg
    │   ├── cancha4.jpeg
    │   ├── cancha5.jpeg
    │   └── cancha6.jpeg
    ├── js/
    │   ├── api.js               # Conexión a la API de OpenWeather (para la temperatura y el clima)
    │   ├── app.js                # Controlador principal / inicializador del sitio
    │   ├── contacto.js           # Lógica del formulario de contacto
    │   └── crud.js                # Operaciones CRUD (crear, leer, actualizar, borrar)
    ├── pages/
    │   ├── canchas.html          # Catálogo/listado de canchas disponibles
    │   ├── contacto.html         # Página de contacto y formulario de contacto
    │   ├── dashboard.html        # Panel de torneos disponibles
    │   └── reservas.html         # Página para gestionar/hacer reservas
    ├── index.html                # Página principal
    ├── readme.md                  # Documentación del proyecto
               
    
