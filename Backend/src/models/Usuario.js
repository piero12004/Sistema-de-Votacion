import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // fecha en que se registró
  fechaRegistro: { type: Date, default: Date.now },

  // historial de votaciones
  votaciones: [
    {
      procesoId: { type: mongoose.Schema.Types.ObjectId, ref: "ProcesoElectoral" },
      candidatoId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidato" },
      fecha: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Usuario", usuarioSchema);
