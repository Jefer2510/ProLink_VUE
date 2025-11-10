const db = require('../config/database');

/**
 * Registrar vista de perfil
 */
const recordProfileView = async (profileId, viewerId) => {
  try {
    // No registrar si el usuario ve su propio perfil
    if (profileId === viewerId) return { success: false };

    await db.query(
      'INSERT INTO profile_views (profile_id, viewer_id, viewed_at) VALUES (?, ?, NOW())',
      [profileId, viewerId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error en recordProfileView:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas del perfil
 */
const getProfileStats = async (userId) => {
  try {
    // Vistas de perfil en los últimos 30 días
    const [profileViews] = await db.query(
      `SELECT COUNT(*) as total_views,
              COUNT(DISTINCT viewer_id) as unique_viewers
       FROM profile_views
       WHERE profile_id = ? AND viewed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [userId]
    );

    // Total de conexiones
    const [connections] = await db.query(
      `SELECT COUNT(*) as total_connections
       FROM connections
       WHERE (sender_id = ? OR receiver_id = ?) AND status = 'ACCEPTED'`,
      [userId, userId]
    );

    // Engagement en posts (últimos 30 días)
    const [postEngagement] = await db.query(
      `SELECT 
         COUNT(DISTINCT p.id) as total_posts,
         COALESCE(SUM((SELECT COUNT(*) FROM likes WHERE post_id = p.id)), 0) as total_likes,
         COALESCE(SUM((SELECT COUNT(*) FROM comments WHERE post_id = p.id)), 0) as total_comments
       FROM posts p
       WHERE p.user_id = ? AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [userId]
    );

    // Posición en el ranking (por engagement)
    const [ranking] = await db.query(
      `SELECT COUNT(*) + 1 as position
       FROM (
         SELECT p.user_id, 
                COUNT(l.id) + COUNT(c.id) as engagement
         FROM posts p
         LEFT JOIN likes l ON p.id = l.post_id
         LEFT JOIN comments c ON p.id = c.post_id
         WHERE p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         GROUP BY p.user_id
         HAVING engagement > (
           SELECT COUNT(l2.id) + COUNT(c2.id)
           FROM posts p2
           LEFT JOIN likes l2 ON p2.id = l2.post_id
           LEFT JOIN comments c2 ON p2.id = c2.post_id
           WHERE p2.user_id = ?
           AND p2.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         )
       ) as user_rankings`,
      [userId]
    );

    return {
      profileViews: profileViews[0],
      connections: connections[0].total_connections,
      postEngagement: postEngagement[0],
      ranking: ranking[0].position
    };
  } catch (error) {
    console.error('Error en getProfileStats:', error);
    throw error;
  }
};

/**
 * Obtener quién vio tu perfil
 */
const getProfileViewers = async (userId, limit = 10) => {
  try {
    const [viewers] = await db.query(
      `SELECT 
         u.id,
         u.first_name as nombre,
         u.last_name as apellido,
         u.headline,
         u.profile_picture_url,
         pv.viewed_at,
         COUNT(*) as view_count
       FROM profile_views pv
       INNER JOIN users u ON pv.viewer_id = u.id
       WHERE pv.profile_id = ?
       GROUP BY u.id, pv.viewed_at
       ORDER BY pv.viewed_at DESC
       LIMIT ?`,
      [userId, limit]
    );

    return viewers;
  } catch (error) {
    console.error('Error en getProfileViewers:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de posts por día
 */
const getPostAnalytics = async (userId, days = 30) => {
  try {
    const [analytics] = await db.query(
      `SELECT 
         DATE(p.created_at) as date,
         COUNT(p.id) as post_count,
         COALESCE(SUM((SELECT COUNT(*) FROM likes WHERE post_id = p.id)), 0) as likes,
         COALESCE(SUM((SELECT COUNT(*) FROM comments WHERE post_id = p.id)), 0) as comments
       FROM posts p
       WHERE p.user_id = ? AND p.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(p.created_at)
       ORDER BY date DESC`,
      [userId, days]
    );

    return analytics;
  } catch (error) {
    console.error('Error en getPostAnalytics:', error);
    throw error;
  }
};

/**
 * Obtener mejor hora para postear (basado en engagement)
 */
const getBestPostingTime = async (userId) => {
  try {
    const [bestTimes] = await db.query(
      `SELECT 
         HOUR(p.created_at) as hour,
         COUNT(p.id) as post_count,
         AVG((SELECT COUNT(*) FROM likes WHERE post_id = p.id) + 
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id)) as avg_engagement
       FROM posts p
       WHERE p.user_id = ?
       GROUP BY HOUR(p.created_at)
       ORDER BY avg_engagement DESC
       LIMIT 3`,
      [userId]
    );

    return bestTimes;
  } catch (error) {
    console.error('Error en getBestPostingTime:', error);
    throw error;
  }
};

/**
 * Obtener crecimiento de red (conexiones por mes)
 */
const getNetworkGrowth = async (userId, months = 6) => {
  try {
    const [growth] = await db.query(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') as month,
         COUNT(*) as new_connections
       FROM connections
       WHERE (sender_id = ? OR receiver_id = ?) 
         AND status = 'ACCEPTED'
         AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month DESC`,
      [userId, userId, months]
    );

    return growth;
  } catch (error) {
    console.error('Error en getNetworkGrowth:', error);
    throw error;
  }
};

module.exports = {
  recordProfileView,
  getProfileStats,
  getProfileViewers,
  getPostAnalytics,
  getBestPostingTime,
  getNetworkGrowth
};
