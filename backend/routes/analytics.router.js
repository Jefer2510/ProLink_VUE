const express = require('express');
const { authenticateToken } = require('./auth.router');
const {
  recordProfileView,
  getProfileStats,
  getProfileViewers,
  getPostAnalytics,
  getBestPostingTime,
  getNetworkGrowth
} = require('../models/analytics.model');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * POST /view/:profileId - Registrar vista de perfil
 */
router.post('/view/:profileId', async (req, res) => {
  try {
    const profileId = parseInt(req.params.profileId);
    const viewerId = req.user.userId;

    await recordProfileView(profileId, viewerId);

    res.json({ message: 'Vista registrada' });
  } catch (error) {
    console.error('Error al registrar vista:', error);
    res.status(500).json({ message: 'Error al registrar vista' });
  }
});

/**
 * GET /stats - Obtener estadísticas del perfil
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await getProfileStats(userId);

    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

/**
 * GET /viewers - Obtener quién vio tu perfil
 */
router.get('/viewers', async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const viewers = await getProfileViewers(userId, limit);

    res.json({
      viewers,
      count: viewers.length
    });
  } catch (error) {
    console.error('Error al obtener viewers:', error);
    res.status(500).json({ message: 'Error al obtener viewers' });
  }
});

/**
 * GET /posts - Obtener analytics de posts
 */
router.get('/posts', async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 30;

    const analytics = await getPostAnalytics(userId, days);

    res.json({
      analytics,
      count: analytics.length
    });
  } catch (error) {
    console.error('Error al obtener analytics:', error);
    res.status(500).json({ message: 'Error al obtener analytics' });
  }
});

/**
 * GET /best-time - Obtener mejor hora para postear
 */
router.get('/best-time', async (req, res) => {
  try {
    const userId = req.user.userId;
    const bestTimes = await getBestPostingTime(userId);

    res.json({
      bestTimes,
      recommendation: bestTimes.length > 0 
        ? `${bestTimes[0].hour}:00 - ${bestTimes[0].hour + 1}:00` 
        : 'No hay suficientes datos'
    });
  } catch (error) {
    console.error('Error al obtener mejor hora:', error);
    res.status(500).json({ message: 'Error al obtener mejor hora' });
  }
});

/**
 * GET /network-growth - Obtener crecimiento de red
 */
router.get('/network-growth', async (req, res) => {
  try {
    const userId = req.user.userId;
    const months = parseInt(req.query.months) || 6;

    const growth = await getNetworkGrowth(userId, months);

    res.json({
      growth,
      count: growth.length
    });
  } catch (error) {
    console.error('Error al obtener crecimiento:', error);
    res.status(500).json({ message: 'Error al obtener crecimiento' });
  }
});

module.exports = router;
