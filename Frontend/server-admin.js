const express = require("express");
const app = express();
const path = require("path");

console.log("Carpeta administrador:", path.join(__dirname, "administrador"));
console.log("Login:", path.join(__dirname, "administrador/login.html"));

app.use(express.static(path.join(__dirname, "administrador")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "administrador/login.html"));
});

app.get("/principal", (req, res) => {
  res.sendFile(path.join(__dirname, "administrador", "principal.html"));
});

app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});
