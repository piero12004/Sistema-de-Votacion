import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "Acceso restringido: No es administrador" });
    }

    req.admin = admin; // Se guarda para usarlo luego
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export default authAdmin;