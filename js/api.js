
const API_KEY = '0e62cfc0026a0cc47ccaab7d30bec697'; // <-- pega tu key de OpenWeatherMap
const CIUDAD = 'Barranquilla,CO';
const CACHE_KEY = `clima_cache_${CIUDAD}`;
const CACHE_DURACION_MS = 15 * 60 * 1000; // 15 minutos
const REFRESCO_MS = 15 * 60 * 1000;       // refresca automáticamente cada 15 min
const MAX_REINTENTOS = 2;

function leerCache() {
    try {
        const guardado = localStorage.getItem(CACHE_KEY);
        if (!guardado) return null;

        const { datos, timestamp } = JSON.parse(guardado);
        if (Date.now() - timestamp > CACHE_DURACION_MS) return null;

        return datos;
    } catch {
        return null;
    }
}

function guardarCache(datos) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ datos, timestamp: Date.now() }));
    } catch {
        // Si localStorage falla (modo incógnito, cuota llena, etc.) simplemente no cacheamos
    }
}

function mostrarCargando(contenedor) {
    contenedor.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; color: #cbd5e1;">
            <span style="width: 14px; height: 14px; border: 2px solid #94a3b8; border-top-color: transparent; border-radius: 50%; display: inline-block; animation: girar 0.8s linear infinite;"></span>
            <span style="font-size: 0.9rem;">Cargando clima...</span>
        </div>
        <style>
            @keyframes girar { to { transform: rotate(360deg); } }
        </style>
    `;
}

function pintarClima(contenedor, datos) {
    const { temp, descripcion, icono, humedad, nombre } = datos;

    contenedor.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
            <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="${descripcion}" style="width: 50px; height: 50px;">
            <div>
                <h3 style="font-size: 1.5rem; margin: 0; color: #ffffff;">${temp}°C</h3>
                <p style="margin: 0; text-transform: capitalize; font-size: 0.9rem; color: #e2e8f0;">${descripcion}</p>
            </div>
        </div>
        <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #cbd5e1;">Humedad: ${humedad}% | ${nombre}</p>
    `;
}

function mostrarError(contenedor, mensaje = 'Error al cargar el clima') {
    contenedor.innerHTML = `
        <div style="margin-top: 1rem;">
            <p style="color: #ef4444; margin: 0;">${mensaje}</p>
            <button id="btnReintentarClima" style="margin-top: 0.5rem; background: #334155; color: #e2e8f0; border: none; padding: 0.3rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                Reintentar
            </button>
        </div>
    `;

    const boton = document.getElementById('btnReintentarClima');
    if (boton) {
        boton.addEventListener('click', () => cargarClima());
    }
}

async function obtenerClimaConReintentos(intentos = MAX_REINTENTOS) {
    try {
        const respuesta = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CIUDAD)}&units=metric&lang=es&appid=${API_KEY}`
        );

        const datosCrudos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datosCrudos.message || 'No se pudo obtener el clima');
        }

        return {
            temp: Math.round(datosCrudos.main.temp),
            descripcion: datosCrudos.weather[0].description,
            icono: datosCrudos.weather[0].icon,
            humedad: datosCrudos.main.humidity,
            nombre: datosCrudos.name,
        };
    } catch (error) {
        if (intentos > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return obtenerClimaConReintentos(intentos - 1);
        }
        throw error;
    }
}

async function cargarClima() {
    const contenedor = document.getElementById('contenedorClima');

    if (!contenedor) return; // Si la página actual no tiene el widget de clima, no ejecuta nada.

    // 1. Intentar usar caché primero (respuesta instantánea)
    const cacheado = leerCache();
    if (cacheado) {
        pintarClima(contenedor, cacheado);
        return;
    }

    // 2. Si no hay caché válida, mostrar estado de carga y pedir datos frescos
    mostrarCargando(contenedor);

    try {
        const datos = await obtenerClimaConReintentos();
        guardarCache(datos);
        pintarClima(contenedor, datos);
    } catch (error) {
        console.error('Error al cargar el clima:', error);
        mostrarError(contenedor);
    }
}

// Ejecutar automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', cargarClima);

// Refrescar periódicamente en segundo plano, sin bloquear la vista actual
setInterval(cargarClima, REFRESCO_MS);