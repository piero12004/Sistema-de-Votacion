import mongoose from "mongoose";

const procesoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ["presencial", "online"], required: true },
  estado: { type: String, enum: ["activo", "pendiente", "observacion"], default: "pendiente" },
  fechaInicio: Date,
  fechaFin: Date,
  progreso: { type: Number, default: 0 }, // % avance
  totalVotos: { type: Number, default: 0 }
});

export default mongoose.model("ProcesoElectoral", procesoSchema);