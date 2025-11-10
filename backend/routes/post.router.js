const express = require('express');
const { authenticateToken } = require('./auth.router');
const { createPost, getFeedPosts, getPostById, getPostsByUserId, deletePost } = require('../models/post.model');

const router = express.Router();

// Todas las rutas están protegidas con authenticateToken
router.use(authenticateToken);

/**
 * POST / - Crear una nueva publicación
 * Body: { content, image_url }
 */
router.post('/', async (req, res) => {
  try {
    const { content, image_url } = req.body;
    const userId = req.user.userId; // Extraído del token JWT

    // Validación
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    // Crear publicación usando el modelo
    const result = await createPost(userId, content.trim(), image_url || null);

    res.status(201).json({
      message: 'Publicación creada exitosamente',
      post: {
        id: result.postId,
        content: content.trim(),
        image_url: image_url || null,
        user_id: userId
      }
    });

  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ 
      message: 'Error al crear la publicación', 
      error: error.message 
    });
  }
});

/**
 * GET /feed - Obtener feed de publicaciones
 * Query params: limit (opcional, default: 20)
 */
router.get('/feed', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Validar límite
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'El límite debe estar entre 1 y 100' });
    }

    // Obtener publicaciones usando el modelo
    const posts = await getFeedPosts(limit);

    res.json({
      message: 'Feed obtenido exitosamente',
      count: posts.length,
      posts
    });

  } catch (error) {
    console.error('Error al obtener feed:', error);
    res.status(500).json({ 
      message: 'Error al obtener el feed', 
      error: error.message 
    });
  }
});

/**
 * GET /:id - Obtener una publicación por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: 'ID de publicación inválido' });
    }

    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    res.json({
      message: 'Publicación obtenida exitosamente',
      post
    });

  } catch (error) {
    console.error('Error al obtener publicación:', error);
    res.status(500).json({ 
      message: 'Error al obtener la publicación', 
      error: error.message 
    });
  }
});

/**
 * GET /user/:userId - Obtener publicaciones de un usuario específico
 * Query params: limit (opcional, default: 20)
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit) || 20;

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'El límite debe estar entre 1 y 100' });
    }

    const posts = await getPostsByUserId(userId, limit);

    res.json({
      message: 'Publicaciones del usuario obtenidas exitosamente',
      count: posts.length,
      posts
    });

  } catch (error) {
    console.error('Error al obtener publicaciones del usuario:', error);
    res.status(500).json({ 
      message: 'Error al obtener las publicaciones del usuario', 
      error: error.message 
    });
  }
});

/**
 * DELETE /:id - Eliminar una publicación
 * Solo el autor puede eliminar su propia publicación
 */
router.delete('/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.userId; // Del token JWT

    if (isNaN(postId)) {
      return res.status(400).json({ message: 'ID de publicación inválido' });
    }

    const result = await deletePost(postId, userId);

    if (!result.success) {
      return res.status(404).json({ 
        message: 'Publicación no encontrada o no tienes permiso para eliminarla' 
      });
    }

    res.json({
      message: 'Publicación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({ 
      message: 'Error al eliminar la publicación', 
      error: error.message 
    });
  }
});

module.exports = router;
