import { Router } from "express";
import {
  crearCandidato,
  obtenerCandidatos,
  obtenerCandidato,
  editarCandidato,
  eliminarCandidato
} from "../controllers/candidato.controller.js";

const router = Router();

router.post("/", crearCandidato);
router.get("/", obtenerCandidatos);
router.get("/:id", obtenerCandidato);
router.put("/:id", editarCandidato);
router.delete("/:id", eliminarCandidato);

export default router;