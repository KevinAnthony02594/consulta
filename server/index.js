// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite al servidor entender JSON
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const historyRoutes = require('./routes/historyRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoritesRoutes);
// --- LA NUEVA RUTA SEGURA PARA CONSULTAR DNI ---
app.get('/api/dni/:dni', authMiddleware, async (req, res) => {
  try {
    console.log(`Usuario con ID: ${req.user.id} está consultando un DNI.`);
    const { dni } = req.params;
    const apiToken = process.env.DNI_API_TOKEN;

    if (!apiToken) {
      return res.status(500).json({ message: 'El token de la API no está configurado en el servidor.' });
    }

    const response = await axios.get(`https://apis.aqpfact.pe/api/dni/${dni}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
      }
    });

    res.json(response.data);

  } catch (error) {
    console.error('Error en la consulta de DNI:', error.message);
    res.status(error.response?.status || 500).json({ message: 'Error al consultar el DNI.' });
  }
});

 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});