const db = require('../config/database');

/**
 * Agregar skill al perfil
 */
const addSkill = async (userId, skillName) => {
  try {
    const [result] = await db.query(
      'INSERT INTO user_skills (user_id, skill_name, created_at) VALUES (?, ?, NOW())',
      [userId, skillName]
    );

    return { success: true, skillId: result.insertId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Ya tienes esta skill');
    }
    console.error('Error en addSkill:', error);
    throw error;
  }
};

/**
 * Eliminar skill del perfil
 */
const removeSkill = async (skillId, userId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM user_skills WHERE id = ? AND user_id = ?',
      [skillId, userId]
    );

    return { success: result.affectedRows > 0 };
  } catch (error) {
    console.error('Error en removeSkill:', error);
    throw error;
  }
};

/**
 * Obtener skills de un usuario
 */
const getUserSkills = async (userId) => {
  try {
    const [skills] = await db.query(
      `SELECT 
        us.id,
        us.skill_name,
        us.created_at,
        (SELECT COUNT(*) FROM endorsements WHERE skill_id = us.id) as endorsement_count
      FROM user_skills us
      WHERE us.user_id = ?
      ORDER BY endorsement_count DESC, us.created_at DESC`,
      [userId]
    );

    return skills;
  } catch (error) {
    console.error('Error en getUserSkills:', error);
    throw error;
  }
};

/**
 * Endorsar una skill
 */
const endorseSkill = async (skillId, endorserId) => {
  try {
    // Verificar que la skill existe y no es del mismo usuario
    const [skill] = await db.query(
      'SELECT user_id FROM user_skills WHERE id = ?',
      [skillId]
    );

    if (skill.length === 0) {
      throw new Error('Skill no encontrada');
    }

    if (skill[0].user_id === endorserId) {
      throw new Error('No puedes endorsar tus propias skills');
    }

    const [result] = await db.query(
      'INSERT INTO endorsements (skill_id, endorser_id, created_at) VALUES (?, ?, NOW())',
      [skillId, endorserId]
    );

    return { success: true, endorsementId: result.insertId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Ya endorsaste esta skill');
    }
    console.error('Error en endorseSkill:', error);
    throw error;
  }
};

/**
 * Remover endorsement
 */
const removeEndorsement = async (skillId, endorserId) => {
  try {
    const [result] = await db.query(
      'DELETE FROM endorsements WHERE skill_id = ? AND endorser_id = ?',
      [skillId, endorserId]
    );

    return { success: result.affectedRows > 0 };
  } catch (error) {
    console.error('Error en removeEndorsement:', error);
    throw error;
  }
};

/**
 * Obtener quién ha endorsado una skill
 */
const getSkillEndorsers = async (skillId) => {
  try {
    const [endorsers] = await db.query(
      `SELECT 
        e.id as endorsement_id,
        e.created_at,
        u.id as user_id,
        u.first_name as nombre,
        u.last_name as apellido,
        u.headline,
        u.profile_picture_url
      FROM endorsements e
      INNER JOIN users u ON e.endorser_id = u.id
      WHERE e.skill_id = ?
      ORDER BY e.created_at DESC`,
      [skillId]
    );

    return endorsers;
  } catch (error) {
    console.error('Error en getSkillEndorsers:', error);
    throw error;
  }
};

/**
 * Obtener skills más populares
 */
const getTrendingSkills = async (limit = 10) => {
  try {
    const [skills] = await db.query(
      `SELECT 
        us.skill_name,
        COUNT(DISTINCT us.user_id) as user_count,
        COUNT(e.id) as endorsement_count
      FROM user_skills us
      LEFT JOIN endorsements e ON us.id = e.skill_id
      GROUP BY us.skill_name
      ORDER BY user_count DESC, endorsement_count DESC
      LIMIT ?`,
      [limit]
    );

    return skills;
  } catch (error) {
    console.error('Error en getTrendingSkills:', error);
    throw error;
  }
};

module.exports = {
  addSkill,
  removeSkill,
  getUserSkills,
  endorseSkill,
  removeEndorsement,
  getSkillEndorsers,
  getTrendingSkills
};
