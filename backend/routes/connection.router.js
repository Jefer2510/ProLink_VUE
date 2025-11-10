const express = require('express');
const { authenticateToken } = require('./auth.router');
const {
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  getPendingRequests,
  getConnections,
  searchUsers
} = require('../models/connection.model');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * POST / - Enviar solicitud de conexión
 */
router.post('/', async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.userId;

    if (!receiverId) {
      return res.status(400).json({ message: 'receiverId es requerido' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'No puedes conectarte contigo mismo' });
    }

    const result = await sendConnectionRequest(senderId, receiverId);

    res.status(201).json({
      message: 'Solicitud de conexión enviada',
      connectionId: result.connectionId
    });
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    res.status(500).json({ 
      message: error.message || 'Error al enviar solicitud de conexión'
    });
  }
});

/**
 * PUT /:id/accept - Aceptar solicitud de conexión
 */
router.put('/:id/accept', async (req, res) => {
  try {
    const connectionId = parseInt(req.params.id);
    const userId = req.user.userId;

    const result = await acceptConnection(connectionId, userId);

    if (!result.success) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json({ message: 'Conexión aceptada exitosamente' });
  } catch (error) {
    console.error('Error al aceptar conexión:', error);
    res.status(500).json({ message: 'Error al aceptar la conexión' });
  }
});

/**
 * DELETE /:id - Rechazar/eliminar conexión
 */
router.delete('/:id', async (req, res) => {
  try {
    const connectionId = parseInt(req.params.id);
    const userId = req.user.userId;

    const result = await rejectConnection(connectionId, userId);

    if (!result.success) {
      return res.status(404).json({ message: 'Conexión no encontrada' });
    }

    res.json({ message: 'Conexión eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar conexión:', error);
    res.status(500).json({ message: 'Error al eliminar la conexión' });
  }
});

/**
 * GET /pending - Obtener solicitudes pendientes
 */
router.get('/pending', async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await getPendingRequests(userId);

    res.json({
      message: 'Solicitudes obtenidas exitosamente',
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
});

/**
 * GET / - Obtener conexiones aceptadas
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const connections = await getConnections(userId);

    res.json({
      message: 'Conexiones obtenidas exitosamente',
      count: connections.length,
      connections
    });
  } catch (error) {
    console.error('Error al obtener conexiones:', error);
    res.status(500).json({ message: 'Error al obtener conexiones' });
  }
});

/**
 * GET /search - Buscar usuarios
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.userId;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Query debe tener al menos 2 caracteres' });
    }

    const users = await searchUsers(q, userId);

    res.json({
      message: 'Búsqueda exitosa',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ message: 'Error al buscar usuarios' });
  }
});

module.exports = router;
