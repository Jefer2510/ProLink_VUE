import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const useInteractions = () => {
  /**
   * Dar like a una publicación
   */
  const likePost = async (postId) => {
    try {
      const response = await axios.post(`${API_URL}/interactions/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error al dar like:', error);
      throw error;
    }
  };

  /**
   * Quitar like de una publicación
   */
  const unlikePost = async (postId) => {
    try {
      const response = await axios.delete(`${API_URL}/interactions/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error al quitar like:', error);
      throw error;
    }
  };

  /**
   * Obtener likes de una publicación
   */
  const getPostLikes = async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/interactions/${postId}/likes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener likes:', error);
      throw error;
    }
  };

  /**
   * Crear un comentario
   */
  const createComment = async (postId, content, parentCommentId = null) => {
    try {
      const response = await axios.post(`${API_URL}/interactions/${postId}/comments`, {
        content,
        parent_comment_id: parentCommentId
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw error;
    }
  };

  /**
   * Obtener comentarios de una publicación
   */
  const getPostComments = async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/interactions/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw error;
    }
  };

  /**
   * Eliminar un comentario
   */
  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`${API_URL}/interactions/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    }
  };

  return {
    likePost,
    unlikePost,
    getPostLikes,
    createComment,
    getPostComments,
    deleteComment
  };
};
