const db = require('../config/database');

/**
 * Crear un like en una publicación
 */
const createLike = async (postId, userId) => {
  try {
    const [result] = await db.query(
      'INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, NOW())',
      [postId, userId]
    );

    return { success: true, likeId: result.insertId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Ya diste like a esta publicación');
    }
    console.error('Error en createLike:', error);
    throw error;
  }
};

/**
 * Eliminar un like
 */
const removeLike = async (postId, userId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    return { success: result.affectedRows > 0 };
  } catch (error) {
    console.error('Error en removeLike:', error);
    throw error;
  }
};

/**
 * Obtener likes de una publicación
 */
const getPostLikes = async (postId) => {
  try {
    const [likes] = await db.query(
      `SELECT 
        l.id,
        l.created_at,
        u.id as user_id,
  u.nombre as nombre,
  u.apellido as apellido
      FROM likes l
      INNER JOIN users u ON l.user_id = u.id
      WHERE l.post_id = ?
      ORDER BY l.created_at DESC`,
      [postId]
    );

    return likes;
  } catch (error) {
    console.error('Error en getPostLikes:', error);
    throw error;
  }
};

/**
 * Crear un comentario
 */
const createComment = async (postId, userId, content, parentCommentId = null) => {
  try {
    const [result] = await db.query(
      'INSERT INTO comments (post_id, user_id, content, parent_comment_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [postId, userId, content, parentCommentId]
    );

    return { success: true, commentId: result.insertId };
  } catch (error) {
    console.error('Error en createComment:', error);
    throw error;
  }
};

/**
 * Obtener comentarios de una publicación
 */
const getPostComments = async (postId) => {
  try {
    const [comments] = await db.query(
      `SELECT 
        c.id,
        c.content,
        c.parent_comment_id,
        c.created_at,
        u.id as user_id,
  u.nombre as nombre,
  u.apellido as apellido,
        u.headline
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC`,
      [postId]
    );

    return comments;
  } catch (error) {
    console.error('Error en getPostComments:', error);
    throw error;
  }
};

/**
 * Eliminar un comentario
 */
const deleteComment = async (commentId, userId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM comments WHERE id = ? AND user_id = ?',
      [commentId, userId]
    );

    return { success: result.affectedRows > 0 };
  } catch (error) {
    console.error('Error en deleteComment:', error);
    throw error;
  }
};

module.exports = {
  createLike,
  removeLike,
  getPostLikes,
  createComment,
  getPostComments,
  deleteComment
};
