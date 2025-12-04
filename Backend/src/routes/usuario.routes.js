import { Router } from "express";
import { 
    registerUsuario, 
    loginUsuario, 
    getProcesosActivos, 
    getCandidatosPorProceso 
} from "../controllers/usuario.controller.js";

import protect from "../middlewares/authUsuario.js"; 

const router = Router();

router.post("/register", registerUsuario);
router.post("/login", loginUsuario);
router.get("/procesos/activos", protect, getProcesosActivos);
router.get("/proceso/:idProceso/candidatos", protect, getCandidatosPorProceso);

export default router;