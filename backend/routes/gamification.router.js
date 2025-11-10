const express = require('express');
const { authenticateToken } = require('./auth.router');
const {
  getUserLevel,
  addPoints,
  unlockAchievement,
  getUserAchievements,
  getLeaderboard,
  checkAchievements
} = require('../models/gamification.model');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * GET /level - Obtener nivel y puntos del usuario
 */
router.get('/level', async (req, res) => {
  try {
    const userId = req.user.userId;
    const levelData = await getUserLevel(userId);

    res.json(levelData);
  } catch (error) {
    console.error('Error al obtener nivel:', error);
    res.status(500).json({ message: 'Error al obtener nivel' });
  }
});

/**
 * GET /achievements - Obtener achievements del usuario
 */
router.get('/achievements', async (req, res) => {
  try {
    const userId = req.user.userId;
    const achievements = await getUserAchievements(userId);

    res.json({
      achievements,
      count: achievements.length
    });
  } catch (error) {
    console.error('Error al obtener achievements:', error);
    res.status(500).json({ message: 'Error al obtener achievements' });
  }
});

/**
 * GET /leaderboard - Obtener ranking de usuarios
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const period = req.query.period || 'all'; // all, week, month

    const leaderboard = await getLeaderboard(limit, period);

    res.json({
      leaderboard,
      count: leaderboard.length
    });
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    res.status(500).json({ message: 'Error al obtener leaderboard' });
  }
});

/**
 * POST /check - Verificar y desbloquear achievements
 */
router.post('/check', async (req, res) => {
  try {
    const userId = req.user.userId;
    const newAchievements = await checkAchievements(userId);

    res.json({
      message: 'Achievements verificados',
      newAchievements,
      count: newAchievements.length
    });
  } catch (error) {
    console.error('Error al verificar achievements:', error);
    res.status(500).json({ message: 'Error al verificar achievements' });
  }
});

/**
 * POST /unlock/:achievementType - Desbloquear achievement manualmente (testing)
 */
router.post('/unlock/:achievementType', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { achievementType } = req.params;

    const result = await unlockAchievement(userId, achievementType);

    if (!result.success) {
      if (result.alreadyUnlocked) {
        return res.status(400).json({ message: 'Achievement ya desbloqueado' });
      }
      return res.status(400).json({ message: 'No se pudo desbloquear' });
    }

    res.json({
      message: 'Achievement desbloqueado!',
      achievement: result.achievement
    });
  } catch (error) {
    console.error('Error al desbloquear achievement:', error);
    res.status(500).json({ message: error.message || 'Error al desbloquear achievement' });
  }
});

module.exports = router;
