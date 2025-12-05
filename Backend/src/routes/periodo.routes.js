import {Router} from "express";
import { 
  obtenerPeriodosPorProceso,
  editarPeriodo,
  eliminarPeriodo
} from "../controllers/periodo.controller.js";

const router = Router();

router.get("/proceso/:id", obtenerPeriodosPorProceso); // obtener periodos por proceso
router.get("/:id", obtenerPeriodoPorId);
router.put("/:id", editarPeriodo);                     // editar un periodo
router.delete("/:id", eliminarPeriodo);                // eliminar periodo

export default router;
