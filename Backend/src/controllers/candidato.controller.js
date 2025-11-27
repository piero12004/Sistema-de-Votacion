import Candidato from "../models/Candidato.js";

// Crear candidato
export const crearCandidato = async (req, res) => {
  try {
    const nuevo = new Candidato(req.body);
    await nuevo.save();
    res.json({ message: "Candidato creado", data: nuevo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos
export const obtenerCandidatos = async (req, res) => {
  try {
    const data = await Candidato.find().populate("proceso");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener por ID
export const obtenerCandidato = async (req, res) => {
  try {
    const candidato = await Candidato.findById(req.params.id).populate("proceso");
    res.json(candidato);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar
export const editarCandidato = async (req, res) => {
  try {
    const editado = await Candidato.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(editado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar
export const eliminarCandidato = async (req, res) => {
  try {
    await Candidato.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidato eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};