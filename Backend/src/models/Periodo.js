import mongoose from "mongoose";

const periodoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  proceso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProcesoElectoral",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Periodo", periodoSchema);
