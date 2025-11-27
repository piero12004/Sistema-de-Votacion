import mongoose from "mongoose";

const votoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  proceso: { type: mongoose.Schema.Types.ObjectId, ref: "ProcesoElectoral", required: true },
  candidato: { type: mongoose.Schema.Types.ObjectId, ref: "Candidato", required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Voto", votoSchema);