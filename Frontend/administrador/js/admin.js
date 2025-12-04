export function cargarNombreAdmin() {
    const nombre = localStorage.getItem("adminUsuario");

    if (!nombre) return;

    const span = document.getElementById("nombreAdmin");
    if (span) span.textContent = nombre;

    const titulo = document.getElementById("tituloAdmin");
    if (titulo) titulo.textContent = `Bienvenido ${nombre}`;
}