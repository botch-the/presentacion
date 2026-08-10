/* ==========================================================================
   SISTEMA CRUD DE RESERVAS Y TORNEOS (crud.js)
   Versión simplificada: la lógica de "guardar / editar / eliminar / renderizar"
   se repetía igual para reservas y equipos, así que ahora vive en una sola
   función genérica (crearCRUD) que ambas reutilizan.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    crudReservas.init();
    crudEquipos.init();
    initModoOscuro();
});

/* ==========================================================================
   MODO OSCURO
   Tu CSS ya define las variables para "body.dark-mode" y el botón ".btn-theme",
   así que aquí solo alternamos esa clase y guardamos la preferencia.
   ========================================================================== */
function initModoOscuro() {
    crearBotonModoOscuro();
    aplicarPreferenciaGuardada();
}

// Crea el botón flotante que activa o desactiva el modo oscuro
function crearBotonModoOscuro() {
    if (document.getElementById('botonModoOscuro')) return;

    const boton = document.createElement('button');
    boton.id = 'botonModoOscuro';
    boton.className = 'btn-theme';
    boton.title = 'Cambiar modo oscuro/claro';
    boton.textContent = '🌙 Oscuro';
    boton.addEventListener('click', alternarModoOscuro);
    document.body.appendChild(boton);
}

// Activa/desactiva el modo oscuro y guarda la preferencia
function alternarModoOscuro() {
    const activo = document.body.classList.toggle('dark-mode');
    localStorage.setItem('modoOscuro', activo ? 'true' : 'false');
    actualizarIconoBoton(activo);
}

// Al cargar la página, revisa si el usuario ya había elegido modo oscuro
function aplicarPreferenciaGuardada() {
    const activo = localStorage.getItem('modoOscuro') === 'true';
    document.body.classList.toggle('dark-mode', activo);
    actualizarIconoBoton(activo);
}

function actualizarIconoBoton(activo) {
    const boton = document.getElementById('botonModoOscuro');
    if (boton) boton.textContent = activo ? '☀️ Claro' : '🌙 Oscuro';
}

/* --- NOTIFICACIÓN DISCRETA (reemplaza los alert() que bloqueaban la pantalla) --- */
function mostrarToast(mensaje) {
    let toast = document.getElementById('toastNotificacion');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotificacion';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #16a34a;
            color: #ffffff;
            padding: 0.8rem 1.2rem;
            border-radius: 8px;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.25s ease, transform 0.25s ease;
            z-index: 9999;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = mensaje;

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    clearTimeout(toast.dataset.timeoutId);
    toast.dataset.timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
    }, 2500);
}

/* ==========================================================================
   FÁBRICA GENÉRICA DE CRUD
   Recibe la configuración de "una tabla" (reservas o equipos) y devuelve
   un objeto con todas las funciones necesarias para manejarla.
   Así evitamos escribir dos veces el mismo código.
   ========================================================================== */
function crearCRUD({ storageKey, formId, bodyTablaId, campos, columnas, mensajes }) {

    function obtenerTodos() {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    function guardarEnStorage(lista) {
        localStorage.setItem(storageKey, JSON.stringify(lista));
        if (typeof actualizarEstadisticas === 'function') actualizarEstadisticas();
    }

    // Lee los valores actuales del formulario según la lista de "campos" configurada
    function leerFormulario() {
        const datos = {};
        for (const campo of campos) {
            datos[campo] = document.getElementById(campo).value.trim();
        }
        return datos;
    }

    function renderizarTabla() {
        const bodyTabla = document.getElementById(bodyTablaId);
        if (!bodyTabla) return;

        const lista = obtenerTodos();
        bodyTabla.innerHTML = '';

        if (lista.length === 0) {
            bodyTabla.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; color:var(--text-muted); padding:1.5rem;">
                        ${mensajes.vacio}
                    </td>
                </tr>`;
            return;
        }

        lista.forEach((item, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                ${columnas.map(col => `<td>${col(item)}</td>`).join('')}
                <td>
                    <button class="btn-editar" onclick="${formId}CRUD.prepararEdicion(${index})">✏️ Editar</button>
                    <button class="btn-cancelar" onclick="${formId}CRUD.eliminar(${index})">🗑️ ${mensajes.botonEliminar}</button>
                </td>`;
            bodyTabla.appendChild(fila);
        });
    }

    function guardar() {
        const form = document.getElementById(formId);
        const datos = leerFormulario();

        if (Object.values(datos).some(valor => !valor)) return;

        const lista = obtenerTodos();
        const indexEdicion = form.dataset.editIndex;

        if (indexEdicion !== undefined && indexEdicion !== '') {
            lista[indexEdicion] = datos;
            delete form.dataset.editIndex;
            mostrarToast(mensajes.actualizado);
        } else {
            lista.push(datos);
            mostrarToast(mensajes.creado);
        }

        guardarEnStorage(lista);
        form.reset();
        renderizarTabla();
    }

    function prepararEdicion(index) {
        const item = obtenerTodos()[index];
        if (!item) return;

        campos.forEach(campo => document.getElementById(campo).value = item[campo]);

        const form = document.getElementById(formId);
        form.dataset.editIndex = index;
        form.scrollIntoView({ behavior: 'smooth' });
    }

    function eliminar(index) {
        const lista = obtenerTodos();
        lista.splice(index, 1);
        guardarEnStorage(lista);
        renderizarTabla();
        mostrarToast(mensajes.eliminado);
    }

    function init() {
        renderizarTabla();
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                guardar();
            });
        }
    }

    return { init, obtenerTodos, guardar, prepararEdicion, eliminar, renderizarTabla };
}

/* ==========================================================================
   RESERVAS DE CANCHAS — solo configuración, la lógica ya está en crearCRUD
   ========================================================================== */
const crudReservas = crearCRUD({
    storageKey: 'reservasCanchas',
    formId: 'formReserva',
    bodyTablaId: 'bodyTablaReservas',
    campos: ['clienteNombre', 'clienteEmail', 'canchaSelect', 'reservaFecha', 'reservaHora'],
    columnas: [
        item => `<strong>${item.clienteNombre}</strong><br><small style="color:var(--text-muted);">${item.clienteEmail}</small>`,
        item => item.canchaSelect,
        item => `${item.reservaFecha} - ${item.reservaHora}`,
    ],
    mensajes: {
        vacio: 'No hay reservas registradas aún.',
        creado: '¡Reserva agendada con éxito!',
        actualizado: '¡Reserva actualizada con éxito!',
        eliminado: 'Reserva cancelada',
        botonEliminar: 'Cancelar',
    },
});

/* ==========================================================================
   EQUIPOS DE TORNEOS — solo configuración, la lógica ya está en crearCRUD
   ========================================================================== */
const crudEquipos = crearCRUD({
    storageKey: 'equiposTorneos',
    formId: 'formTorneo',
    bodyTablaId: 'bodyTablaTorneos',
    campos: ['nombreEquipo', 'nombreCapitan', 'telefonoCapitan', 'torneoSelect'],
    columnas: [
        item => `<strong>${item.nombreEquipo}</strong>`,
        item => `${item.nombreCapitan}<br><small style="color:var(--text-muted);">${item.telefonoCapitan}</small>`,
        item => item.torneoSelect,
    ],
    mensajes: {
        vacio: 'No hay equipos inscritos aún.',
        creado: '¡Equipo inscrito con éxito!',
        actualizado: '¡Equipo actualizado con éxito!',
        eliminado: 'Equipo eliminado',
        botonEliminar: 'Eliminar',
    },
});

// Los botones de la tabla llaman a "formReservaCRUD" / "formTorneoCRUD"
window.formReservaCRUD = crudReservas;
window.formTorneoCRUD = crudEquipos;