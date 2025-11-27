import Usuario from "../models/Usuario.js";
import generarToken from "../utils/generarToken.js";

export const registroUsuario = async (req, res) => {
  try {
    const { nombre, dni, password } = req.body;

    if (!nombre || !dni || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si DNI ya existe
    const existe = await Usuario.findOne({ dni });

    if (existe) {
      return res.status(400).json({ message: "El DNI ya está registrado" });
    }

    const nuevoUsuario = new Usuario({ nombre, dni, password });
    await nuevoUsuario.save();

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        dni: nuevoUsuario.dni
      }
    });

  } catch (error) {
    console.error("❌ Error en registro usuario:", error);
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
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparación simple (más adelante podemos encriptarlo)
    if (usuario.password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = generarToken(usuario._id);

    return res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        dni: usuario.dni
      }
    });

  } catch (error) {
    console.error("❌ Error en login usuario:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
