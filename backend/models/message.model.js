const db = require('../config/database');

/**
 * Enviar un mensaje
 */
const sendMessage = async (senderId, receiverId, content) => {
  try {
    const [result] = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content, created_at, is_read) VALUES (?, ?, ?, NOW(), 0)',
      [senderId, receiverId, content]
    );

    return { success: true, messageId: result.insertId };
  } catch (error) {
    console.error('Error en sendMessage:', error);
    throw error;
  }
};

/**
 * Obtener conversación entre dos usuarios
 */
const getConversation = async (userId1, userId2, limit = 50) => {
  try {
    const [messages] = await db.query(
      `SELECT 
        m.id,
        m.sender_id,
        m.receiver_id,
        m.content,
        m.is_read,
        m.created_at,
  u.nombre as sender_nombre,
  u.apellido as sender_apellido
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
      LIMIT ?`,
      [userId1, userId2, userId2, userId1, limit]
    );

    return messages;
  } catch (error) {
    console.error('Error en getConversation:', error);
    throw error;
  }
};

/**
 * Obtener lista de conversaciones (inbox)
 */
const getConversations = async (userId) => {
  try {
    const [conversations] = await db.query(
      `SELECT DISTINCT
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END as contact_id,
  u.nombre as nombre,
  u.apellido as apellido,
        u.profile_picture_url,
        (SELECT content FROM messages 
         WHERE (sender_id = ? AND receiver_id = contact_id) OR (sender_id = contact_id AND receiver_id = ?)
         ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages 
         WHERE (sender_id = ? AND receiver_id = contact_id) OR (sender_id = contact_id AND receiver_id = ?)
         ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages 
         WHERE sender_id = contact_id AND receiver_id = ? AND is_read = 0) as unread_count
      FROM messages m
      INNER JOIN users u ON (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) = u.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY last_message_time DESC`,
      [userId, userId, userId, userId, userId, userId, userId, userId, userId]
    );

    return conversations;
  } catch (error) {
    console.error('Error en getConversations:', error);
    throw error;
  }
};

/**
 * Marcar mensajes como leídos
 */
const markAsRead = async (userId, contactId) => {
  try {
    await db.query(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [contactId, userId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error en markAsRead:', error);
    throw error;
  }
};

/**
 * Eliminar un mensaje
 */
const deleteMessage = async (messageId, userId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM messages WHERE id = ? AND sender_id = ?',
      [messageId, userId]
    );

    return { success: result.affectedRows > 0 };
  } catch (error) {
    console.error('Error en deleteMessage:', error);
    throw error;
  }
};

/**
 * Obtener conteo de mensajes no leídos
 */
const getUnreadCount = async (userId) => {
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0',
      [userId]
    );

    return result[0].count;
  } catch (error) {
    console.error('Error en getUnreadCount:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  deleteMessage,
  getUnreadCount
};
