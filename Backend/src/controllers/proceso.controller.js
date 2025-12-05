import ProcesoElectoral from "../models/ProcesoElectoral.js";
import Voto from "../models/Voto.js";
import Periodo from "../models/Periodo.js";
import {generarPeriodosAutomaticos} from "../utils/generarPeriodos.js"

const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Crear proceso
export const crearProceso = async (req, res) => {
  try {
    const nuevoProceso = new ProcesoElectoral(req.body);
    await nuevoProceso.save();

    const periodos = generarPeriodosAutomaticos(nuevoProceso);
    await Periodo.insertMany(periodos);

    res.json({ message: "Proceso electoral creado con éxito", data: nuevoProceso, periodosGenerados: periodos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los procesos
export const obtenerProcesos = async (req, res) => {
    try {
        const procesos = await ProcesoElectoral.find();

        // Obtener la fecha de HOY a medianoche en UTC para comparación
        const hoy = new Date();
        const hoySoloFecha = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));

        const procesosActualizados = [];

        for (let p of procesos) {
            let progreso = p.progreso ?? 0;
            let estadoNuevo = p.estado;

            // Solo recalcular si el estado NO es Observacion o Rechazado
            if (!["Observacion", "Rechazado"].includes(p.estado) && p.fechaInicio && p.fechaFin) {
                const inicio = new Date(Date.UTC(
                    p.fechaInicio.getUTCFullYear(),
                    p.fechaInicio.getUTCMonth(),
                    p.fechaInicio.getUTCDate()
                ));

                const fin = new Date(Date.UTC(
                    p.fechaFin.getUTCFullYear(),
                    p.fechaFin.getUTCMonth(),
                    p.fechaFin.getUTCDate()
                ));

                // Lógica de Estado automática
                if (hoySoloFecha < inicio) {
                    estadoNuevo = "Pendiente";
                    progreso = 0;
                } else if (hoySoloFecha >= inicio && hoySoloFecha <= fin) {
                    estadoNuevo = "Activo";
                    
                    const totalDuration = fin.getTime() - inicio.getTime();
                    const elapsedDuration = hoySoloFecha.getTime() - inicio.getTime();
                    
                    if (totalDuration > 0) {
                        progreso = Math.round((elapsedDuration / totalDuration) * 100);
                        if (progreso > 100) progreso = 100; 
                    } else {
                        progreso = 100; 
                    }
                } else if (hoySoloFecha > fin) {
                    estadoNuevo = "Terminado";
                    progreso = 100;
                }
            }

            // Guardar cambios solo si hubo modificación
            if (estadoNuevo !== p.estado || progreso !== p.progreso) {
                p.estado = estadoNuevo;
                p.progreso = progreso;
                await p.save();
            }

            // Devolver objeto actualizado al frontend
            procesosActualizados.push({ ...p.toObject(), progreso });
        }

        res.json(procesosActualizados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Obtener proceso por ID
export const obtenerProceso = async (req, res) => {
  try {
    const proceso = await ProcesoElectoral.findById(req.params.id);
    res.json(proceso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar proceso
export const editarProceso = async (req, res) => {
  try {
    const procesoEditado = await ProcesoElectoral.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Proceso actualizado", data: procesoEditado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar proceso
export const eliminarProceso = async (req, res) => {
  try {
    await ProcesoElectoral.findByIdAndDelete(req.params.id);
    res.json({ message: "Proceso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar totalVotos + progreso (llamar cuando se registre un voto)
export const actualizarEstadisticas = async (req, res) => {
  try {
    const procesoId = req.params.id;

    const totalVotos = await Voto.countDocuments({ proceso: procesoId });

    const proceso = await ProcesoElectoral.findById(procesoId);

    // calcular porcentaje (si quieres puedes ajustar)
    const progreso = totalVotos;

    proceso.totalVotos = totalVotos;
    proceso.progreso = progreso;

    await proceso.save();

    res.json({ message: "Estadísticas actualizadas", data: proceso });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};