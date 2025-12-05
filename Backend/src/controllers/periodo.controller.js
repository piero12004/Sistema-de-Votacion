import Periodo from "../models/Periodo.js";

// Obtener todos los periodos de un proceso
export const obtenerPeriodosPorProceso = async (req, res) => {
  try {
    const periodos = await Periodo.find({ proceso: req.params.id });
    res.json(periodos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Editar un periodo
export const editarPeriodo = async (req, res) => {
  try {
    const periodoActualizado = await Periodo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!periodoActualizado) {
      return res.status(404).json({ message: "Periodo no encontrado" });
    }

    res.json({
      message: "Periodo actualizado correctamente",
      data: periodoActualizado
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Eliminar un periodo
export const eliminarPeriodo = async (req, res) => {
  try {
    const eliminado = await Periodo.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ message: "Periodo no encontrado" });
    }

    res.json({ message: "Periodo eliminado correctamente" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const obtenerPeriodoPorId = async (req, res) => {
  try {
    const periodo = await Periodo.findById(req.params.id);

    if (!periodo) {
      return res.status(404).json({ message: "Periodo no encontrado" });
    }

    res.json(periodo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
