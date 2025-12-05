import {Router} from "express";
import {
  crearPeriodo, 
  obtenerPeriodosPorProceso,
  editarPeriodo,
  eliminarPeriodo,
  obtenerPeriodoPorId
} from "../controllers/periodo.controller.js";

const router = Router();

router.get("/proceso/:id", obtenerPeriodosPorProceso); // obtener periodos por proceso
router.get("/:id", obtenerPeriodoPorId);
router.put("/:id", editarPeriodo);                     // editar un periodo
router.delete("/:id", eliminarPeriodo);                // eliminar periodo
router.post("/", crearPeriodo);                        //añadir periodo

export default router;
