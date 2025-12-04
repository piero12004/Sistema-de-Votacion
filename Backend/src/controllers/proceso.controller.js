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
    const hoy = new Date();

    const procesosActualizados = [];

    for (let p of procesos) {
      let progreso = 0;

      // Determinar el estado según la fecha
      if (p.fechaInicio && p.fechaFin) {
        if (hoy < p.fechaInicio) {
          p.estado = "Pendiente"; // aún no inicia
          progreso = 0;
        } else if (hoy >= p.fechaInicio && hoy <= p.fechaFin) {
          p.estado = "Activo"; // en curso
          progreso = Math.round(((hoy - p.fechaInicio) / (p.fechaFin - p.fechaInicio)) * 100);
        } else if (hoy > p.fechaFin) {
          p.estado = "Terminado"; // ya pasó la fecha de fin
          progreso = 100;
        }
      }

      // Solo guardar si hubo un cambio de estado
      if (p.isModified()) await p.save();

      // Añadir el progreso calculado al objeto que se enviará
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