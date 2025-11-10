const express = require('express');
const { authenticateToken } = require('./auth.router');
const {
  addSkill,
  removeSkill,
  getUserSkills,
  endorseSkill,
  removeEndorsement,
  getSkillEndorsers,
  getTrendingSkills
} = require('../models/skill.model');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * POST / - Agregar skill al perfil
 */
router.post('/', async (req, res) => {
  try {
    const { skillName } = req.body;
    const userId = req.user.userId;

    if (!skillName || skillName.trim() === '') {
      return res.status(400).json({ message: 'skillName es requerido' });
    }

    const result = await addSkill(userId, skillName.trim());

    res.status(201).json({
      message: 'Skill agregada',
      skillId: result.skillId
    });
  } catch (error) {
    console.error('Error al agregar skill:', error);
    res.status(500).json({ message: error.message || 'Error al agregar skill' });
  }
});

/**
 * DELETE /:skillId - Eliminar skill
 */
router.delete('/:skillId', async (req, res) => {
  try {
    const skillId = parseInt(req.params.skillId);
    const userId = req.user.userId;

    const result = await removeSkill(skillId, userId);

    if (!result.success) {
      return res.status(404).json({ message: 'Skill no encontrada' });
    }

    res.json({ message: 'Skill eliminada' });
  } catch (error) {
    console.error('Error al eliminar skill:', error);
    res.status(500).json({ message: 'Error al eliminar skill' });
  }
});

/**
 * GET /user/:userId - Obtener skills de un usuario
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const skills = await getUserSkills(userId);

    res.json({
      skills,
      count: skills.length
    });
  } catch (error) {
    console.error('Error al obtener skills:', error);
    res.status(500).json({ message: 'Error al obtener skills' });
  }
});

/**
 * POST /:skillId/endorse - Endorsar una skill
 */
router.post('/:skillId/endorse', async (req, res) => {
  try {
    const skillId = parseInt(req.params.skillId);
    const endorserId = req.user.userId;

    const result = await endorseSkill(skillId, endorserId);

    res.status(201).json({
      message: 'Skill endorsada',
      endorsementId: result.endorsementId
    });
  } catch (error) {
    console.error('Error al endorsar:', error);
    res.status(500).json({ message: error.message || 'Error al endorsar skill' });
  }
});

/**
 * DELETE /:skillId/endorse - Remover endorsement
 */
router.delete('/:skillId/endorse', async (req, res) => {
  try {
    const skillId = parseInt(req.params.skillId);
    const endorserId = req.user.userId;

    const result = await removeEndorsement(skillId, endorserId);

    if (!result.success) {
      return res.status(404).json({ message: 'Endorsement no encontrado' });
    }

    res.json({ message: 'Endorsement eliminado' });
  } catch (error) {
    console.error('Error al remover endorsement:', error);
    res.status(500).json({ message: 'Error al remover endorsement' });
  }
});

/**
 * GET /:skillId/endorsers - Ver quién ha endorsado una skill
 */
router.get('/:skillId/endorsers', async (req, res) => {
  try {
    const skillId = parseInt(req.params.skillId);
    const endorsers = await getSkillEndorsers(skillId);

    res.json({
      endorsers,
      count: endorsers.length
    });
  } catch (error) {
    console.error('Error al obtener endorsers:', error);
    res.status(500).json({ message: 'Error al obtener endorsers' });
  }
});

/**
 * GET /trending - Obtener skills más populares
 */
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skills = await getTrendingSkills(limit);

    res.json({
      skills,
      count: skills.length
    });
  } catch (error) {
    console.error('Error al obtener trending skills:', error);
    res.status(500).json({ message: 'Error al obtener trending skills' });
  }
});

module.exports = router;
