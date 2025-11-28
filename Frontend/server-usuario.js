const express = require("express");
const app = express();
const path = require("path");

// Servir archivos estáticos de la carpeta usuario
app.use(express.static(path.join(__dirname, "usuario")));

// Página principal por defecto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "usuario/index.html"));
});


app.get("/candidatos", (req, res) => {
  res.sendFile(path.join(__dirname, "usuario/candidatos.html"));
});

app.get("/resultados", (req, res) => {
  res.sendFile(path.join(__dirname, "usuario/resultados.html"));
});

app.listen(8080, () => {
  console.log("Usuario corriendo en http://localhost:8080");
});
