const db = require('../config/database');

/**
 * Obtener nivel y puntos del usuario
 */
const getUserLevel = async (userId) => {
  try {
    const [result] = await db.query(
      `SELECT points, level, 
              (SELECT COUNT(*) FROM user_achievements WHERE user_id = ?) as total_achievements
       FROM users
       WHERE id = ?`,
      [userId, userId]
    );

    if (result.length === 0) return null;

    const user = result[0];
    const currentLevel = user.level || 1;
    const pointsForNextLevel = currentLevel * 100; // 100, 200, 300...
    const progress = ((user.points % pointsForNextLevel) / pointsForNextLevel) * 100;

    return {
      points: user.points || 0,
      level: currentLevel,
      pointsForNextLevel,
      progress: Math.round(progress),
      totalAchievements: user.total_achievements
    };
  } catch (error) {
    console.error('Error en getUserLevel:', error);
    throw error;
  }
};

/**
 * Agregar puntos al usuario
 */
const addPoints = async (userId, points, reason) => {
  try {
    // Obtener puntos actuales
    const [current] = await db.query(
      'SELECT points, level FROM users WHERE id = ?',
      [userId]
    );

    if (current.length === 0) return { success: false };

    const currentPoints = (current[0].points || 0) + points;
    const currentLevel = current[0].level || 1;
    
    // Calcular nuevo nivel
    const newLevel = Math.floor(currentPoints / 100) + 1;

    // Actualizar puntos y nivel
    await db.query(
      'UPDATE users SET points = ?, level = ? WHERE id = ?',
      [currentPoints, newLevel, userId]
    );

    // Registrar en historial
    await db.query(
      'INSERT INTO point_history (user_id, points, reason, created_at) VALUES (?, ?, ?, NOW())',
      [userId, points, reason]
    );

    const leveledUp = newLevel > currentLevel;

    return {
      success: true,
      points: currentPoints,
      level: newLevel,
      leveledUp,
      pointsAdded: points
    };
  } catch (error) {
    console.error('Error en addPoints:', error);
    throw error;
  }
};

/**
 * Desbloquear achievement
 */
const unlockAchievement = async (userId, achievementType) => {
  try {
    // Verificar si ya tiene el achievement
    const [existing] = await db.query(
      'SELECT id FROM user_achievements WHERE user_id = ? AND achievement_type = ?',
      [userId, achievementType]
    );

    if (existing.length > 0) {
      return { success: false, alreadyUnlocked: true };
    }

    // Obtener datos del achievement
    const achievements = {
      'FIRST_POST': { name: 'Primera Publicación', points: 10, icon: '📝' },
      'FIRST_CONNECTION': { name: 'Primera Conexión', points: 10, icon: '🤝' },
      'FIRST_LIKE': { name: 'Primer Like', points: 5, icon: '❤️' },
      'FIRST_COMMENT': { name: 'Primer Comentario', points: 5, icon: '💬' },
      'POPULAR': { name: 'Popular', description: '100 likes', points: 50, icon: '🌟' },
      'NETWORKER': { name: 'Networker', description: '50 conexiones', points: 100, icon: '🌐' },
      'INFLUENCER': { name: 'Influencer', description: '1000 vistas de perfil', points: 200, icon: '👑' },
      'CONTENT_CREATOR': { name: 'Creador de Contenido', description: '50 posts', points: 100, icon: '✍️' },
      'ENGAGING': { name: 'Comprometido', description: '100 comentarios', points: 75, icon: '💬' },
      'SKILLED': { name: 'Habilidoso', description: '10 skills endorsadas', points: 50, icon: '⭐' }
    };

    const achievement = achievements[achievementType];
    if (!achievement) {
      throw new Error('Achievement no encontrado');
    }

    // Desbloquear achievement
    await db.query(
      'INSERT INTO user_achievements (user_id, achievement_type, name, icon, unlocked_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, achievementType, achievement.name, achievement.icon]
    );

    // Agregar puntos
    await addPoints(userId, achievement.points, `Achievement: ${achievement.name}`);

    return {
      success: true,
      achievement: {
        ...achievement,
        type: achievementType
      }
    };
  } catch (error) {
    console.error('Error en unlockAchievement:', error);
    throw error;
  }
};

/**
 * Obtener achievements del usuario
 */
const getUserAchievements = async (userId) => {
  try {
    const [achievements] = await db.query(
      `SELECT achievement_type, name, icon, unlocked_at
       FROM user_achievements
       WHERE user_id = ?
       ORDER BY unlocked_at DESC`,
      [userId]
    );

    return achievements;
  } catch (error) {
    console.error('Error en getUserAchievements:', error);
    throw error;
  }
};

/**
 * Obtener leaderboard (ranking)
 */
const getLeaderboard = async (limit = 10, period = 'all') => {
  try {
    let dateFilter = '';
    if (period === 'week') {
      dateFilter = 'WHERE ph.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (period === 'month') {
      dateFilter = 'WHERE ph.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    }

    const [leaderboard] = await db.query(
      `SELECT 
         u.id,
         u.first_name as nombre,
         u.last_name as apellido,
         u.headline,
         u.profile_picture_url,
         u.level,
         u.points,
         (SELECT COUNT(*) FROM user_achievements WHERE user_id = u.id) as achievements_count
       FROM users u
       ORDER BY u.points DESC, u.level DESC
       LIMIT ?`,
      [limit]
    );

    return leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  } catch (error) {
    console.error('Error en getLeaderboard:', error);
    throw error;
  }
};

/**
 * Verificar y desbloquear achievements automáticamente
 */
const checkAchievements = async (userId) => {
  try {
    const achievements = [];

    // Verificar posts
    const [posts] = await db.query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
      [userId]
    );
    if (posts[0].count === 1) {
      const result = await unlockAchievement(userId, 'FIRST_POST');
      if (result.success) achievements.push(result.achievement);
    }
    if (posts[0].count >= 50) {
      const result = await unlockAchievement(userId, 'CONTENT_CREATOR');
      if (result.success) achievements.push(result.achievement);
    }

    // Verificar conexiones
    const [connections] = await db.query(
      'SELECT COUNT(*) as count FROM connections WHERE (sender_id = ? OR receiver_id = ?) AND status = "ACCEPTED"',
      [userId, userId]
    );
    if (connections[0].count === 1) {
      const result = await unlockAchievement(userId, 'FIRST_CONNECTION');
      if (result.success) achievements.push(result.achievement);
    }
    if (connections[0].count >= 50) {
      const result = await unlockAchievement(userId, 'NETWORKER');
      if (result.success) achievements.push(result.achievement);
    }

    // Verificar likes recibidos
    const [likes] = await db.query(
      'SELECT COUNT(*) as count FROM likes l INNER JOIN posts p ON l.post_id = p.id WHERE p.user_id = ?',
      [userId]
    );
    if (likes[0].count >= 100) {
      const result = await unlockAchievement(userId, 'POPULAR');
      if (result.success) achievements.push(result.achievement);
    }

    return achievements;
  } catch (error) {
    console.error('Error en checkAchievements:', error);
    return [];
  }
};

module.exports = {
  getUserLevel,
  addPoints,
  unlockAchievement,
  getUserAchievements,
  getLeaderboard,
  checkAchievements
};
