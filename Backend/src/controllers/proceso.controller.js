import ProcesoElectoral from "../models/ProcesoElectoral.js";
import Voto from "../models/Voto.js";

const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Crear proceso
export const crearProceso = async (req, res) => {
  try {
    const nuevoProceso = new ProcesoElectoral(req.body);
    await nuevoProceso.save();

    res.json({ message: "Proceso electoral creado con éxito", data: nuevoProceso });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los procesos
export const obtenerProcesos = async (req, res) => {
    try {
        const procesos = await ProcesoElectoral.find();

        // 1. Obtener la fecha de HOY a medianoche en UTC para comparación
        const hoy = new Date();
        const hoySoloFecha = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));

        const procesosActualizados = [];

        for (let p of procesos) {
            let progreso = 0;
            let estadoNuevo = p.estado;

            if (p.fechaInicio && p.fechaFin) {
                // 2. Extraer fechas de inicio/fin usando métodos UTC
                // Esto garantiza que la fecha sea la misma sin importar la zona horaria del servidor.
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

                // Lógica de Estado
                if (hoySoloFecha < inicio) {
                    estadoNuevo = "Pendiente";
                    progreso = 0;
                } else if (hoySoloFecha >= inicio && hoySoloFecha <= fin) {
                    estadoNuevo = "Activo";
                    
                    // Cálculo de progreso
                    const totalDuration = fin.getTime() - inicio.getTime();
                    const elapsedDuration = hoySoloFecha.getTime() - inicio.getTime();
                    
                    if (totalDuration > 0) {
                        progreso = Math.round((elapsedDuration / totalDuration) * 100);
                        // Asegurar que el progreso no exceda el 100%
                        if (progreso > 100) progreso = 100; 
                    } else {
                        // En caso de que inicio y fin sean el mismo día o haya un error, 
                        // si está activo, se asume 100% de progreso.
                        progreso = 100; 
                    }

                } else if (hoySoloFecha > fin) {
                    estadoNuevo = "Terminado";
                    progreso = 100;
                }
            }
            
            // Guardar el estado y progreso en la BD si han cambiado
            // Nota: Mongoose solo guarda si hay un cambio real.
            if (estadoNuevo !== p.estado || progreso !== p.progreso) {
                p.estado = estadoNuevo;
                p.progreso = progreso;
                await p.save();
            }

            // Devolver el objeto actualizado al frontend
            procesosActualizados.push({ ...p.toObject(), progreso: p.progreso });
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