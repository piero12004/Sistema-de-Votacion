export function cargarNombreAdmin() {
    const nombre = localStorage.getItem("adminUsuario");

    if (!nombre) return;

    const span = document.getElementById("nombreAdmin");
    if (span) span.textContent = nombre;

    const titulo = document.getElementById("tituloAdmin");
    if (titulo) titulo.textContent = `Bienvenido ${nombre}`;
}

export function cerrarSesion() {
    localStorage.removeItem("tokenAdmin");
    localStorage.removeItem("adminUsuario");
    window.location.href = "login.html";
}

// Función para proteger páginas: redirige al login si no hay token
export function protegerPagina() {
    const token = localStorage.getItem("tokenAdmin");
    if (!token) {
        window.location.href = "login.html";
    }
}