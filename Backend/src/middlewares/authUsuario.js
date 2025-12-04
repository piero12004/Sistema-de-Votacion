import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const JWT_SECRET = process.env.JWT_SECRET || 'TuClaveSecretaMuySegura'; 

const authUsuario = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, JWT_SECRET); 
            req.user = await Usuario.findById(decoded.id).select('-password'); 

            if (!req.user) {
                return res.status(401).json({ error: "Usuario no autorizado (Token válido pero usuario no encontrado)" });
            }

            next();

        } catch (error) {
            console.error("Error de autenticación:", error.message);
            return res.status(401).json({ error: "Token inválido o expirado" });
        }
    } else {
        return res.status(401).json({ error: "No autorizado, no se encontró token Bearer" });
    }
};

export default authUsuario;