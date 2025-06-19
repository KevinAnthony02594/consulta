// server/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Importamos nuestra configuración de la base de datos
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --- RUTA: POST /api/users/register ---
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validación simple de entrada
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    // 2. Verificar si el usuario ya existe
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // 3. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Guardar el nuevo usuario en la base de datos
    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );

    // 5. Enviar respuesta exitosa
    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


// --- NUEVA RUTA: POST /api/users/login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Validación de entrada
    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // 2. Buscar al usuario por su email
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            // ¡Importante! No decir "usuario no encontrado" por seguridad.
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const user = userResult.rows[0];

        // 3. Comparar la contraseña enviada con la contraseña hasheada en la BD
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 4. Si todo es correcto, crear el payload para el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        // 5. Firmar el token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // El token expirará en 1 hora
            (err, token) => {
                if (err) throw err;
                res.json({
                    message: 'Inicio de sesión exitoso.',
                    token // <-- Enviamos el token al cliente
                });
            }
        );

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// --- NUEVA RUTA: GET /api/users/me -> Devuelve el perfil del usuario actual ---
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // El middleware ya verificó el token y puso el id del usuario en req.user.id
        const user = await db.query(
            'SELECT id, name, email, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json(user.rows[0]);

    } catch (error) {
        console.error('Error al obtener perfil:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;