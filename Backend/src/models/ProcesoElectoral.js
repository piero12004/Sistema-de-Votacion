import mongoose from "mongoose";

const procesoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ["Presencial", "Online"], required: true },
  estado: { type: String, enum: ["Activo", "Pendiente", "Observacion", "Terminado", "Rechazado"], default: "Pendiente" },
  fechaInicio: Date,
  fechaFin: Date,
  progreso: { type: Number, default: 0 }, // % avance
  totalVotos: { type: Number, default: 0 }
});

export default mongoose.model("ProcesoElectoral", procesoSchema);