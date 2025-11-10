const db = require('../config/database');

/**
 * Enviar solicitud de conexión
 */
const sendConnectionRequest = async (senderId, receiverId) => {
  try {
    // Verificar que no exista ya una conexión
    const [existing] = await db.query(
      'SELECT * FROM connections WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
      [senderId, receiverId, receiverId, senderId]
    );

    if (existing.length > 0) {
      throw new Error('Ya existe una solicitud de conexión');
    }

    const [result] = await db.query(
      'INSERT INTO connections (sender_id, receiver_id, status, created_at) VALUES (?, ?, "PENDING", NOW())',
      [senderId, receiverId]
    );

    return { success: true, connectionId: result.insertId };
  } catch (error) {
    console.error('Error en sendConnectionRequest:', error);
    throw error;
  }
};

/**
 * Aceptar solicitud de conexión
 */
const acceptConnection = async (connectionId, userId) => {
  try {
    const [result] = await db.query(
      'UPDATE connections SET status = "ACCEPTED" WHERE id = ? AND receiver_id = ?',
      [connectionId, userId]
    );

    return { success: result.affectedRows > 0 };
  } catch (error) {
    console.error('Error en acceptConnection:', error);
    throw error;
  }
};

/**
 * Rechazar/eliminar solicitud de conexión
 */
const rejectConnection = async (connectionId, userId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM connections WHERE id = ? AND (sender_id = ? OR receiver_id = ?)',
      [connectionId, userId, userId]
    );

    return { success: result.affectedRows > 0 };
  } catch (error) {
    console.error('Error en rejectConnection:', error);
    throw error;
  }
};

/**
 * Obtener solicitudes de conexión pendientes
 */
const getPendingRequests = async (userId) => {
  try {
    const [requests] = await db.query(
      `SELECT 
        c.id as connection_id,
        c.created_at,
        u.id as user_id,
        u.first_name as nombre,
        u.last_name as apellido,
        u.headline,
        u.profile_picture_url
      FROM connections c
      INNER JOIN users u ON c.sender_id = u.id
      WHERE c.receiver_id = ? AND c.status = "PENDING"
      ORDER BY c.created_at DESC`,
      [userId]
    );

    return requests;
  } catch (error) {
    console.error('Error en getPendingRequests:', error);
    throw error;
  }
};

/**
 * Obtener conexiones aceptadas
 */
const getConnections = async (userId) => {
  try {
    const [connections] = await db.query(
      `SELECT 
        c.id as connection_id,
        u.id as user_id,
        u.first_name as nombre,
        u.last_name as apellido,
        u.headline,
        u.email,
        u.profile_picture_url
      FROM connections c
      INNER JOIN users u ON (
        CASE 
          WHEN c.sender_id = ? THEN c.receiver_id = u.id
          ELSE c.sender_id = u.id
        END
      )
      WHERE (c.sender_id = ? OR c.receiver_id = ?) AND c.status = "ACCEPTED"
      ORDER BY u.first_name, u.last_name`,
      [userId, userId, userId]
    );

    return connections;
  } catch (error) {
    console.error('Error en getConnections:', error);
    throw error;
  }
};

/**
 * Buscar usuarios
 */
const searchUsers = async (query, currentUserId, limit = 20) => {
  try {
    const searchTerm = `%${query}%`;
    const [users] = await db.query(
      `SELECT 
        u.id,
        u.first_name as nombre,
        u.last_name as apellido,
        u.headline,
        u.email,
        u.profile_picture_url,
        (SELECT status FROM connections WHERE 
          (sender_id = ? AND receiver_id = u.id) OR 
          (receiver_id = ? AND sender_id = u.id)
        ) as connection_status
      FROM users u
      WHERE u.id != ? 
        AND (
          u.first_name LIKE ? OR 
          u.last_name LIKE ? OR 
          u.headline LIKE ? OR
          u.email LIKE ?
        )
      LIMIT ?`,
      [currentUserId, currentUserId, currentUserId, searchTerm, searchTerm, searchTerm, searchTerm, limit]
    );

    return users;
  } catch (error) {
    console.error('Error en searchUsers:', error);
    throw error;
  }
};

module.exports = {
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  getPendingRequests,
  getConnections,
  searchUsers
};
