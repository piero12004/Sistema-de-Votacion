import { Router } from "express";
import {
  crearProceso,
  obtenerProcesos,
  obtenerProceso,
  editarProceso,
  eliminarProceso,
  actualizarEstadisticas
} from "../controllers/proceso.controller.js";

const router = Router();

// CRUD
router.post("/", crearProceso);          // Crear proceso
router.get("/", obtenerProcesos);        // Listar procesos
router.get("/:id", obtenerProceso);      // Ver proceso por ID
router.put("/:id", editarProceso);       // Editar proceso
router.delete("/:id", eliminarProceso);  // Eliminar

// Actualizar estadísticas (llamar después de votar)
router.get("/:id/estadisticas", actualizarEstadisticas);

export default router;