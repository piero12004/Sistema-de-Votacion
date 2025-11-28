import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: ["http://localhost:5000", "http://localhost:8080","https://sistema-de-votacion-admin.onrender.com","https://sistema-de-votacion-usuario.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());

// Conectar BD
connectDB();

// Registrar rutas
import adminRoutes from "./src/routes/admin.routes.js";
import usuarioRoutes from "./src/routes/usuario.routes.js";
import procesoRoutes from "./src/routes/proceso.routes.js";
import candidatoRoutes from "./src/routes/candidato.routes.js";
import votoRoutes from "./src/routes/voto.routes.js";

app.use("/api/admin", adminRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/proceso", procesoRoutes);
app.use("/api/candidato", candidatoRoutes);
app.use("/api/voto", votoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
