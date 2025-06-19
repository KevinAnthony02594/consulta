// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Obtener el token del header de la petición
  const token = req.header('Authorization');

  // 2. Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada.' });
  }

  // El token usualmente viene como "Bearer <token>", lo separamos.
  const tokenValue = token.split(' ')[1];

  // 3. Verificar el token
  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    // 4. Si el token es válido, añadimos el payload del usuario (que contiene el id)
    // al objeto 'req' para que las siguientes rutas puedan usarlo.
    req.user = decoded.user;
    next(); // Llama a la siguiente función en la cadena (la ruta principal)
  } catch (err) {
    res.status(401).json({ message: 'El token no es válido.' });
  }
};