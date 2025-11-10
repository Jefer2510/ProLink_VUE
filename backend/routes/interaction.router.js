const express = require('express');
const { authenticateToken } = require('./auth.router');
const {
  createLike,
  removeLike,
  getPostLikes,
  createComment,
  getPostComments,
  deleteComment
} = require('../models/interaction.model');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * POST /:postId/like - Dar like a una publicación
 */
router.post('/:postId/like', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user.userId;

    const result = await createLike(postId, userId);

    res.status(201).json({
      message: 'Like agregado',
      likeId: result.likeId
    });
  } catch (error) {
    console.error('Error al dar like:', error);
    res.status(500).json({ message: error.message || 'Error al dar like' });
  }
});

/**
 * DELETE /:postId/like - Quitar like
 */
router.delete('/:postId/like', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user.userId;

    const result = await removeLike(postId, userId);

    if (!result.success) {
      return res.status(404).json({ message: 'Like no encontrado' });
    }

    res.json({ message: 'Like eliminado' });
  } catch (error) {
    console.error('Error al quitar like:', error);
    res.status(500).json({ message: 'Error al quitar like' });
  }
});

/**
 * GET /:postId/likes - Obtener likes de una publicación
 */
router.get('/:postId/likes', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const likes = await getPostLikes(postId);

    res.json({
      count: likes.length,
      likes
    });
  } catch (error) {
    console.error('Error al obtener likes:', error);
    res.status(500).json({ message: 'Error al obtener likes' });
  }
});

/**
 * POST /:postId/comments - Crear un comentario
 */
router.post('/:postId/comments', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user.userId;
    const { content, parent_comment_id } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    const result = await createComment(postId, userId, content.trim(), parent_comment_id || null);

    res.status(201).json({
      message: 'Comentario creado',
      commentId: result.commentId
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ message: 'Error al crear comentario' });
  }
});

/**
 * GET /:postId/comments - Obtener comentarios
 */
router.get('/:postId/comments', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const comments = await getPostComments(postId);

    res.json({
      count: comments.length,
      comments
    });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
});

/**
 * DELETE /comments/:commentId - Eliminar comentario
 */
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.userId;

    const result = await deleteComment(commentId, userId);

    if (!result.success) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ message: 'Error al eliminar comentario' });
  }
});

module.exports = router;
