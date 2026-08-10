/* ==========================================================================
   LÓGICA PRINCIPAL DEL APLICATIVO (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTema();
    actualizarEstadisticas();
    resaltarEnlaceActivo();
    initFiltroCanchas();
});

/* --- MODO OSCURO / CLARO Y ESTILOS DINÁMICOS --- */
function initTema() {
    let btnTema = document.getElementById('btnDarkMode') || document.getElementById('btnTema');

    if (!btnTema) {
        btnTema = document.createElement('button');
        btnTema.id = 'btnTema';
        btnTema.className = 'btn-theme';
        document.body.appendChild(btnTema);
    }

    const temaGuardado = localStorage.getItem('temaCanchas');
    const esOscuroInicial = temaGuardado === 'dark';

    aplicarTema(esOscuroInicial, btnTema);

    btnTema.addEventListener('click', () => {
        const esOscuro = !document.body.classList.contains('dark-mode');
        localStorage.setItem('temaCanchas', esOscuro ? 'dark' : 'light');
        aplicarTema(esOscuro, btnTema);
    });
}


function aplicarTema(esOscuro, btnTema) {
    document.body.classList.toggle('dark-mode', esOscuro);
    btnTema.innerHTML = esOscuro ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    document.documentElement.style.colorScheme = esOscuro ? 'dark' : 'light';
}

/* --- BÚSQUEDA Y FILTRADO EN TIEMPO REAL (CANCHAS) --- */
function initFiltroCanchas() {
    const inputBuscador = document.getElementById('inputBuscador');
    const selectFiltroTipo = document.getElementById('selectFiltroTipo');
    const tarjetasCanchas = document.querySelectorAll('.tarjeta-cancha');

    // Si no existen los elementos en la página actual, se detiene
    if (!inputBuscador || !selectFiltroTipo || tarjetasCanchas.length === 0) return;

    function filtrar() {
        const textoBusqueda = inputBuscador.value.toLowerCase().trim();
        const tipoSeleccionado = selectFiltroTipo.value;

        tarjetasCanchas.forEach(tarjeta => {
            const titulo = tarjeta.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const descripcion = tarjeta.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const tipoCancha = tarjeta.dataset.tipo || 'todos';

            const coincideTexto = titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
            const coincideTipo = (tipoSeleccionado === 'todos') || (tipoCancha === tipoSeleccionado);

            if (coincideTexto && coincideTipo) {
                tarjeta.style.display = '';
            } else {
                tarjeta.style.display = 'none';
            }
        });
    }

    inputBuscador.addEventListener('input', filtrar);
    selectFiltroTipo.addEventListener('change', filtrar);
}

/* --- ACTUALIZAR CONTADORES Y ESTADÍSTICAS --- */
function actualizarEstadisticas() {
    const statTotalReservas = document.getElementById('statTotalReservas');
    if (statTotalReservas) {
        const reservas = JSON.parse(localStorage.getItem('reservasCanchas')) || [];
        statTotalReservas.textContent = reservas.length;
    }

    // el dashboard de torneos tiene un contador de equipos
    // inscritos (id="statTotalEquipos") que nunca se actualizaba.
    const statTotalEquipos = document.getElementById('statTotalEquipos');
    if (statTotalEquipos) {
        const equipos = JSON.parse(localStorage.getItem('equiposTorneos')) || [];
        statTotalEquipos.textContent = equipos.length;
    }
}

/* --- INDICADOR DE PÁGINA ACTIVA EN EL MENÚ --- */
function resaltarEnlaceActivo() {
    const navLinks = document.querySelectorAll('.nav-links a, .navbar-nav a');
    const rutaActual = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === rutaActual || (rutaActual === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}