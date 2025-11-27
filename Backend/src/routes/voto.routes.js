import { Router } from "express";
import {
  crearVoto,
  obtenerVotos,
  votosPorProceso
} from "../controllers/voto.controller.js";

const router = Router();

// Usuario vota
router.post("/", crearVoto);

// Admin ve todos los votos
router.get("/", obtenerVotos);

// Resultados por proceso
router.get("/proceso/:id", votosPorProceso);

export default router;