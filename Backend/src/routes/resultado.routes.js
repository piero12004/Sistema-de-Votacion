import express from "express";
import { getResultadosPorProceso } from "../controllers/resultados.controller.js";

const router = express.Router();

router.get("/:procesoId", getResultadosPorProceso);

export default router;