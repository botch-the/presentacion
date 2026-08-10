/* FORMULARIO DE CONTACTO -> ENVÍO POR CORREO (contacto.js) */

const ACCESS_KEY = '48960c92-c500-4f37-a4d6-b83ad1324b92';

document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('formContacto');
    if (!formContacto) return; // Si la página actual no tiene este formulario, no hace nada

    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();
        await enviarContacto();
    });
});

async function enviarContacto() {
    const formContacto = document.getElementById('formContacto');
    const boton = document.getElementById('btnEnviarContacto');

    const nombre = document.getElementById('contactoNombre').value.trim();
    const email = document.getElementById('contactoEmail').value.trim();
    const mensaje = document.getElementById('contactoMensaje').value.trim();

    if (!nombre || !email || !mensaje) return;

    // Deshabilitar el botón para evitar doble envío mientras se procesa
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando...';

    try {
        const respuesta = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_key: ACCESS_KEY,
                subject: `Nuevo mensaje de contacto - CanchaGol (${nombre})`,
                from_name: nombre,
                nombre: nombre,
                email: email,
                mensaje: mensaje,
            }),
        });

        const resultado = await respuesta.json();

        if (resultado.success) {
            mostrarToastContacto('¡Gracias por contactarnos! Te responderemos muy pronto.');
            formContacto.reset();
        } else {
            throw new Error(resultado.message || 'No se pudo enviar el mensaje');
        }
    } catch (error) {
        console.error('Error al enviar el formulario de contacto:', error);
        mostrarToastContacto('No se pudo enviar el mensaje. Intenta de nuevo.', true);
    } finally {
        boton.disabled = false;
        boton.textContent = textoOriginal;
    }
}

// Usa el mismo estilo de notificación discreta que crud.js (si ya existe la
// función mostrarToast, la reutiliza; si no, crea una propia como respaldo)
function mostrarToastContacto(mensaje, esError = false) {
    if (typeof mostrarToast === 'function') {
        mostrarToast(mensaje);
        return;
    }

    const toast = document.createElement('div');
    toast.textContent = mensaje;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${esError ? '#dc2626' : '#16a34a'};
        color: #ffffff;
        padding: 0.8rem 1.2rem;
        border-radius: 8px;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        z-index: 9999;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}