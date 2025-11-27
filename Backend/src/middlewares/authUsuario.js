import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const authUsuario = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({ error: "Usuario no autorizado" });
    }

    req.usuario = usuario; // Guardar usuario para usarlo después
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export default authUsuario;