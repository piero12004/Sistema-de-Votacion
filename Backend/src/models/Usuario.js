import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'votante' }, 

    fechaRegistro: { type: Date, default: Date.now },

    votaciones: [
        {
            procesoId: { type: mongoose.Schema.Types.ObjectId, ref: "ProcesoElectoral" },
            candidatoId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidato" },
            fecha: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return; 

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Usuario", usuarioSchema);