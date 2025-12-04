import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || 'UnaClaveSecretaDeEmergenciaMuyLarga12345'; 

/**
 *
 * @param {string} id 
 * @param {string} rol 
 * @returns {string}
 */
const generarToken = (id, rol) => {
    return jwt.sign({ id, rol }, JWT_SECRET, {
        expiresIn: "1d" 
    });
};

export default generarToken;