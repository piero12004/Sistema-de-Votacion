import { Router } from "express";
import { registroUsuario, loginUsuario } from "../controllers/usuario.controller.js";

const router = Router();

router.post("/registro", registroUsuario);
router.post("/login", loginUsuario);

export default router;