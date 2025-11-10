const express = require('express');
const { authenticateToken } = require('./auth.router');
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  deleteMessage,
  getUnreadCount
} = require('../models/message.model');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * POST / - Enviar un mensaje
 */
router.post('/', async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !content || content.trim() === '') {
      return res.status(400).json({ message: 'receiverId y content son requeridos' });
    }

    const result = await sendMessage(senderId, receiverId, content.trim());

    res.status(201).json({
      message: 'Mensaje enviado',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ message: 'Error al enviar mensaje' });
  }
});

/**
 * GET /conversation/:contactId - Obtener conversación con un usuario
 */
router.get('/conversation/:contactId', async (req, res) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const userId = req.user.userId;

    const messages = await getConversation(userId, contactId);

    // Marcar mensajes como leídos
    await markAsRead(userId, contactId);

    res.json({
      messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Error al obtener conversación:', error);
    res.status(500).json({ message: 'Error al obtener conversación' });
  }
});

/**
 * GET / - Obtener lista de conversaciones (inbox)
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversations = await getConversations(userId);

    res.json({
      conversations,
      count: conversations.length
    });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ message: 'Error al obtener conversaciones' });
  }
});

/**
 * GET /unread - Obtener conteo de mensajes no leídos
 */
router.get('/unread', async (req, res) => {
  try {
    const userId = req.user.userId;
    const count = await getUnreadCount(userId);

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error al obtener no leídos:', error);
    res.status(500).json({ message: 'Error al obtener conteo' });
  }
});

/**
 * PUT /:contactId/read - Marcar conversación como leída
 */
router.put('/:contactId/read', async (req, res) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const userId = req.user.userId;

    await markAsRead(userId, contactId);

    res.json({ message: 'Mensajes marcados como leídos' });
  } catch (error) {
    console.error('Error al marcar como leído:', error);
    res.status(500).json({ message: 'Error al marcar como leído' });
  }
});

/**
 * DELETE /:messageId - Eliminar mensaje
 */
router.delete('/:messageId', async (req, res) => {
  try {
    const messageId = parseInt(req.params.messageId);
    const userId = req.user.userId;

    const result = await deleteMessage(messageId, userId);

    if (!result.success) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    res.json({ message: 'Mensaje eliminado' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({ message: 'Error al eliminar mensaje' });
  }
});

module.exports = router;
