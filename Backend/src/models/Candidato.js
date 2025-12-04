import mongoose from "mongoose";

const candidatoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  dni: { type: String, required: true },
  cargo: { type: String, required: true },
  estado: { type: String, enum: ["activo", "inactivo"], default: "activo" },
  foto: { type: String },
  proceso: { type: mongoose.Schema.Types.ObjectId, ref: "ProcesoElectoral", required: function() {
    return this.estado === "activo";
  }}
});

export default mongoose.model("Candidato", candidatoSchema);