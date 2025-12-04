import Usuario from "../models/Usuario.js";
import generarToken from "../utils/generarToken.js";
import ProcesoElectoral from "../models/ProcesoElectoral.js"; 
import Candidato from "../models/Candidato.js";            

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

        const token = generarToken(nuevoUsuario._id, nuevoUsuario.rol);

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

        const token = generarToken(usuario._id, usuario.rol);

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
            return res.status(200).json({ message: "No hay procesos electorales activos actualmente.", procesos: [] });
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

        if (!proceso || proceso.estado !== "Activo") {
            return res.status(404).json({ message: "Proceso electoral no encontrado o no está activo." });
        }
        const candidatos = await Candidato.find({ 
            proceso: idProceso,
            estado: "activo" 
        }).select("-dni -__v");

        if (candidatos.length === 0) {
            return res.status(200).json({ message: `No hay candidatos activos para el proceso ${proceso.nombre}`, candidatos: [] });
        }
        return res.status(200).json({ proceso: proceso.nombre, candidatos });

    } catch (error) {
        console.error("❌ Error al obtener candidatos por proceso:", error);
        return res.status(500).json({ message: "Error en el servidor al obtener candidatos" });
    }
};
