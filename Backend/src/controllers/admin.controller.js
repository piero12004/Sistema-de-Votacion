import Admin from "../models/Admin.js";
import generarToken from "../utils/generarToken.js";

export const loginAdmin = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Buscar admin
    const admin = await Admin.findOne({ usuario });

    if (!admin) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }

    // Comparar password (sin encriptar por ahora)
    if (password !== admin.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Token
    const token = generarToken(admin._id);

    return res.json({
      message: "Login exitoso",
      token,
      admin: {
        id: admin._id,
        usuario: admin.usuario
      }
    });

  } catch (error) {
    console.error("Error en login admin:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
