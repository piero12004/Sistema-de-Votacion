import Voto from "../models/Voto.js";
import ProcesoElectoral from "../models/ProcesoElectoral.js";
import Candidato from "../models/Candidato.js";

// Registrar un voto
export const crearVoto = async (req, res) => {
  try {
    const usuario = req.usuarioId; // viene del token
    const { proceso, candidato } = req.body;
    
    // Validar si ya votó en este proceso
    const votoExistente = await Voto.findOne({ usuario, proceso });
    if (votoExistente) {
      return res.status(403).json({ error: "Ya votaste en este proceso." });
    }

    // Validar si el proceso sigue activo
    const proc = await ProcesoElectoral.findById(proceso);
    if (!proc || proc.estado !== "Activo") { // fijarse que estado en DB es "Activo"
      return res.status(400).json({ error: "El proceso electoral no está activo." });
    }

    // Crear voto
    const nuevoVoto = new Voto({ usuario, proceso, candidato });
    await nuevoVoto.save();

    // Incrementar votos del candidato
    await Candidato.findByIdAndUpdate(candidato, { $inc: { votos: 1 } });

    // Incrementar total de votos del proceso
    await ProcesoElectoral.findByIdAndUpdate(proceso, { $inc: { totalVotos: 1 } });

    res.json({ message: "Voto registrado exitosamente", data: nuevoVoto });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los votos (solo admin)
export const obtenerVotos = async (req, res) => {
  try {
    const votos = await Voto.find()
      .populate("usuario")
      .populate("proceso")
      .populate("candidato");

    res.json(votos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener votos por proceso (para mostrar resultados)
export const votosPorProceso = async (req, res) => {
  try {
    const votos = await Voto.find({ proceso: req.params.id })
      .populate("usuario")
      .populate("candidato");

    res.json(votos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};