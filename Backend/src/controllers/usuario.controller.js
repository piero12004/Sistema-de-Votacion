import Usuario from "../models/Usuario.js";
import generarToken from "../utils/generarToken.js";
import ProcesoElectoral from "../models/ProcesoElectoral.js"; 
import Candidato from "../models/Candidato.js"; 
import Voto from "../models/Voto.js";

export const registerUsuario = async (req, res) => {
    try {
        const { nombre, dni, password } = req.body;
        const rol = 'votante'; 

        if (!nombre || !dni || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const existe = await Usuario.findOne({ dni });

        if (existe) {
            return res.status(400).json({ message: "El DNI ya está registrado" });
        }

        const nuevoUsuario = new Usuario({ nombre, dni, password, rol });
        await nuevoUsuario.save();

        const token = generarToken(nuevoUsuario._id, nuevoUsuario.rol, nuevoUsuario.nombre);

        return res.status(201).json({
            message: "Usuario registrado con éxito",
            token,
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                dni: nuevoUsuario.dni,
                rol: nuevoUsuario.rol 
            }
        });

    } catch (error) {
        console.error("❌ Error en registro usuario:", error);
        if (error.code === 11000) { 
            return res.status(400).json({ message: "El DNI ya está registrado." });
        }
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const loginUsuario = async (req, res) => {
    try {
        const { dni, password } = req.body;

        if (!dni || !password) {
            return res.status(400).json({ message: "DNI y contraseña son obligatorios" });
        }

        const usuario = await Usuario.findOne({ dni });

        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas (Usuario no encontrado)" });
        }

        const isMatch = await usuario.matchPassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas (Contraseña incorrecta)" });
        }
        
        const token = generarToken(usuario._id, usuario.rol, usuario.nombre);

        return res.json({
            message: "Login exitoso",
            token, 
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                dni: usuario.dni,
                rol: usuario.rol 
            }
        });

    } catch (error) {
        console.error("❌ Error en login usuario:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getProcesosActivos = async (req, res) => {
    try {
        const procesos = await ProcesoElectoral.find({
            estado: "Activo",
            fechaFin: { $gte: new Date() }
        }).select("nombre tipo _id");

        if (procesos.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(procesos);
    } catch (error) {
        console.error("❌ Error al obtener procesos activos:", error);
        return res.status(500).json({ message: "Error en el servidor al obtener procesos" });
    }
};

export const getCandidatosPorProceso = async (req, res) => {
    try {
        const { idProceso } = req.params;
        if (!idProceso) {
            return res.status(400).json({ message: "Se requiere el ID del proceso electoral" });
        }
        
        const proceso = await ProcesoElectoral.findById(idProceso);

        if (!proceso || proceso.estado !== "Activo" || proceso.fechaFin < new Date()) {
            return res.status(404).json({ message: "Proceso electoral no encontrado, no está activo o ya ha finalizado." });
        }
        
        const candidatos = await Candidato.find({ 
            proceso: idProceso,
            estado: "activo" 
        }).select("nombre cargo _id foto");


        if (candidatos.length === 0) {
            return res.status(200).json({ proceso: proceso.nombre, candidatos: [], message: `No hay candidatos activos para el proceso ${proceso.nombre}` });
        }
        
        // Verificar si el usuario ya votó en este proceso
        let votoExistente = false;
        if (req.user && req.user.id) {
            const voto = await Voto.findOne({ usuario: req.user.id, proceso: idProceso });
            votoExistente = !!voto;
        }

        return res.status(200).json({ 
            proceso: proceso.nombre, 
            candidatos, 
            votoExistente 
        });


    } catch (error) {
        console.error("❌ Error al obtener candidatos por proceso:", error);
        return res.status(500).json({ message: "Error en el servidor al obtener candidatos" });
    }
};

export const emitirVoto = async (req, res) => {
    const votanteId = req.user.id; 
    const { candidatoId, procesoId } = req.body; 

    try {
        if (!candidatoId || !procesoId) {
            return res.status(400).json({ message: "Datos de voto incompletos: Candidato y Proceso son requeridos." });
        }

        const votoExistente = await Voto.findOne({ 
            votante: votanteId, 
            proceso: procesoId 
        });
        
        if (votoExistente) {
            return res.status(409).json({ message: "Ya has emitido tu voto para este proceso electoral." });
        }

        const proceso = await ProcesoElectoral.findById(procesoId);
        if (!proceso || proceso.estado !== "Activo" || proceso.fechaFin < new Date()) {
             return res.status(404).json({ message: "El proceso electoral no está activo o ha finalizado." });
        }
        
        const candidato = await Candidato.findById(candidatoId);
        if (!candidato || candidato.proceso.toString() !== procesoId || candidato.estado !== "activo") {
            return res.status(404).json({ message: "El candidato seleccionado no es válido para este proceso." });
        }

        const updateCandidato = await Candidato.updateOne(
            { _id: candidatoId },
            { $inc: { votos: 1 } }
        );

        const nuevoVoto = await Voto.create({
           votante: votanteId,
           proceso: procesoId,
           candidato: candidatoId
        });

        return res.status(200).json({
            message: "Voto registrado con éxito.",
            candidatoVotado: candidato.nombre,
            proceso: proceso.nombre,
            votoId: nuevoVoto._id
        });

    } catch (error) {
        console.error("❌ Error al emitir voto:", error);
        
        if (error.code === 11000) { 
             return res.status(409).json({ message: "Ya has emitido tu voto para este proceso electoral." });
        }
        
        return res.status(500).json({ message: "Error interno del servidor al registrar el voto." });
    }
};