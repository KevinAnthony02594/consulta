const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware); // Protege todas las rutas con el middleware de autenticación

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit || 20; // Limite por defecto de 20
        const favorites = await db.query(
            'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
            [req.user.id, limit]
        );
        res.json(favorites.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.post('/', async (req, res) => {
    const { dni_consultado, nombre_completo } = req.body;

    if (!dni_consultado || !nombre_completo) {
        return res.status(400).json({ message: 'Datos de favorito incompletos.' });
    }

    try {
        // --- CAMBIO AQUÍ ---
        // Añadimos "RETURNING *" para que la consulta nos devuelva la fila que acaba de insertar.
        const newFavorite = await db.query(
            'INSERT INTO favorites (user_id, dni_consultado, nombre_completo) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, dni_consultado, nombre_completo]
        );
        // Enviamos el objeto completo del nuevo favorito (la primera fila del resultado)
        res.status(201).json(newFavorite.rows[0]);

    } catch (error) {
        console.error(error.message);
        // Para que el frontend reciba un error claro si el DNI ya es favorito (error de constraint 'unique')
        if (error.code === '23505') { 
            return res.status(409).json({ message: 'Este DNI ya está en tus favoritos.'});
        }
        res.status(500).send('Server error');
    }
});

// --- NUEVA RUTA: DELETE /api/favorites/:dni -> Elimina un favorito específico ---
router.delete('/:dni', async (req, res) => {
    try {
        const { dni } = req.params;
        const result = await db.query(
            'DELETE FROM favorites WHERE user_id = $1 AND dni_consultado = $2',
            [req.user.id, dni]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Favorito no encontrado o no autorizado.' });
        }

        res.json({ message: 'Favorito eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar favorito:', error.message);
        res.status(500).send('Server error');
    }
});

// --- NUEVA RUTA: DELETE /api/favorites -> Limpia todos los favoritos del usuario ---
router.delete('/', async (req, res) => {
    try {
        await db.query('DELETE FROM favorites WHERE user_id = $1', [req.user.id]);
        res.json({ message: 'Todos los favoritos han sido eliminados.' });
    } catch (error) {
        console.error('Error al limpiar favoritos:', error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;