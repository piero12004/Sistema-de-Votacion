import { Router } from "express";
import { registerUsuario, loginUsuario, getProcesosActivos, getCandidatosPorProceso,emitirVoto } from "../controllers/usuario.controller.js";

import protect from "../middlewares/authUsuario.js"; 

const router = Router();
router.post("/register", registerUsuario);
router.post("/login", loginUsuario);
router.get("/procesos-activos", protect, getProcesosActivos); 
router.get("/:idProceso/candidatos", protect, getCandidatosPorProceso); 
router.post("/votar", protect, emitirVoto); 

export default router;