import Voto from "../models/Voto.js";
import Candidato from "../models/Candidato.js";
import ProcesoElectoral from "../models/ProcesoElectoral.js";

export const getResultadosPorProceso = async (req, res) => {
  try {
    const { procesoId } = req.params;

    const proceso = await ProcesoElectoral.findById(procesoId);
    if (!proceso) return res.status(404).json({ message: "Proceso no encontrado" });

    const candidatos = await Candidato.find({ proceso: procesoId, estado: "activo" });
    const votos = await Voto.find({ proceso: procesoId });

    const totalVotos = votos.length;

    const resultados = candidatos.map(c => {
      const votosCandidato = votos.filter(v => v.candidato.toString() === c._id.toString()).length;
      const porcentaje = totalVotos ? Math.round((votosCandidato / totalVotos) * 100) : 0;
      return {
        candidate: c.nombre,
        votes: votosCandidato,
        percentage: porcentaje,
        img: c.foto,
        color: "vote-color-1" // opcional: puedes asignar dinámicamente
      };
    });

    const ganador = resultados.reduce((max, r) => r.votes > max.votes ? r : max, { votes: -1 });

    return res.json({ ganador, votos: resultados });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error obteniendo resultados" });
  }
};