const db = require('../config/database');

/**
 * Crear una nueva publicación
 * @param {number} userId - ID del usuario que crea la publicación
 * @param {string} content - Contenido de la publicación
 * @param {string|null} imageUrl - URL de la imagen (opcional)
 * @returns {Promise<object>} - Resultado de la inserción
 */
const createPost = async (userId, content, imageUrl = null) => {
  try {
    const [result] = await db.query(
      'INSERT INTO posts (user_id, content, image_url, created_at) VALUES (?, ?, ?, NOW())',
      [userId, content, imageUrl]
    );

    return {
      success: true,
      postId: result.insertId,
      affectedRows: result.affectedRows
    };
  } catch (error) {
    console.error('Error en createPost:', error);
    throw error;
  }
};

/**
 * Obtener las publicaciones del feed con información del autor
 * @param {number} limit - Número máximo de publicaciones a obtener (default: 20)
 * @returns {Promise<Array>} - Array de publicaciones con datos del autor
 */
const getFeedPosts = async (limit = 20) => {
  try {
    const [posts] = await db.query(
      `SELECT 
        p.id,
        p.content,
        p.image_url,
        p.created_at,
        u.id as user_id,
        u.first_name as nombre,
        u.last_name as apellido,
        u.email,
        u.headline,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ?`,
      [limit]
    );

    return posts;
  } catch (error) {
    console.error('Error en getFeedPosts:', error);
    throw error;
  }
};

/**
 * Obtener una publicación por ID con información del autor
 * @param {number} postId - ID de la publicación
 * @returns {Promise<object|null>} - Publicación con datos del autor o null
 */
const getPostById = async (postId) => {
  try {
    const [posts] = await db.query(
      `SELECT 
        p.id,
        p.content,
        p.image_url,
        p.created_at,
        u.id as user_id,
        u.first_name as nombre,
        u.last_name as apellido,
        u.email,
        u.headline
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.id = ?`,
      [postId]
    );

    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error en getPostById:', error);
    throw error;
  }
};

/**
 * Obtener publicaciones de un usuario específico
 * @param {number} userId - ID del usuario
 * @param {number} limit - Número máximo de publicaciones (default: 20)
 * @returns {Promise<Array>} - Array de publicaciones del usuario
 */
const getPostsByUserId = async (userId, limit = 20) => {
  try {
    const [posts] = await db.query(
      `SELECT 
        p.id,
        p.content,
        p.image_url,
        p.created_at,
        u.id as user_id,
        u.first_name as nombre,
        u.last_name as apellido,
        u.email,
        u.headline
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ?`,
      [userId, limit]
    );

    return posts;
  } catch (error) {
    console.error('Error en getPostsByUserId:', error);
    throw error;
  }
};

/**
 * Eliminar una publicación
 * @param {number} postId - ID de la publicación a eliminar
 * @param {number} userId - ID del usuario (para verificar propiedad)
 * @returns {Promise<object>} - Resultado de la eliminación
 */
const deletePost = async (postId, userId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM posts WHERE id = ? AND user_id = ?',
      [postId, userId]
    );

    return {
      success: result.affectedRows > 0,
      affectedRows: result.affectedRows
    };
  } catch (error) {
    console.error('Error en deletePost:', error);
    throw error;
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getPostById,
  getPostsByUserId,
  deletePost
};
