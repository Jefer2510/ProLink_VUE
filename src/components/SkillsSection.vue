<template>
  <div class="skills-section">
    <div class="section-header">
      <h3>⭐ Skills</h3>
      <button v-if="isOwnProfile" @click="showAddSkill = true" class="add-btn">+ Agregar</button>
    </div>

    <!-- Add Skill Form -->
    <div v-if="showAddSkill && isOwnProfile" class="add-skill-form">
      <input 
        v-model="newSkillName"
        @keyup.enter="addNewSkill"
        type="text"
        placeholder="Ej: React.js, Python, Marketing Digital..."
        class="skill-input"
      />
      <button @click="addNewSkill" :disabled="!newSkillName.trim()" class="save-btn">Guardar</button>
      <button @click="showAddSkill = false; newSkillName = ''" class="cancel-btn">Cancelar</button>
    </div>

    <!-- Skills List -->
    <div v-if="loading && userSkills.length === 0" class="loading">
      <div class="spinner"></div>
    </div>

    <div v-else-if="userSkills.length > 0" class="skills-list">
      <div v-for="skill in userSkills" :key="skill.id" class="skill-item">
        <div class="skill-info">
          <div class="skill-name">{{ skill.skill_name }}</div>
          <div class="endorsement-count">
            <span class="icon">⭐</span>
            {{ skill.endorsement_count }} endorsement{{ skill.endorsement_count !== 1 ? 's' : '' }}
          </div>
          <div v-if="skill.has_endorsed" class="endorsed-badge">
            <span class="check">✓</span> Has endorsado
          </div>
        </div>

        <div class="skill-actions">
          <button 
            v-if="!isOwnProfile && !skill.has_endorsed"
            @click="endorseThisSkill(skill.id)"
            :disabled="loading"
            class="endorse-btn"
          >
            👍 Endorse
          </button>
          <button 
            v-if="!isOwnProfile && skill.has_endorsed"
            @click="removeThisEndorsement(skill.id)"
            :disabled="loading"
            class="un-endorse-btn"
          >
            Remover
          </button>
          <button 
            v-if="isOwnProfile"
            @click="removeThisSkill(skill.id)"
            :disabled="loading"
            class="remove-btn"
          >
            ✕
          </button>
          <button 
            @click="showEndorsers(skill.id)"
            class="view-endorsers-btn"
            v-if="skill.endorsement_count > 0"
          >
            Ver endorsers
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p v-if="isOwnProfile">No has agregado skills aún</p>
      <p v-else>Este usuario no ha agregado skills</p>
    </div>

    <!-- Endorsers Modal -->
    <div v-if="showEndorsersModal" class="modal-overlay" @click="closeEndorsersModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Endorsers de esta Skill</h3>
          <button @click="closeEndorsersModal" class="close-btn">✕</button>
        </div>
        
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>

        <div v-else class="endorsers-list">
          <div v-for="endorser in skillEndorsers" :key="endorser.endorser_id" class="endorser-item">
            <div class="endorser-avatar">{{ getInitials(endorser.nombre, endorser.apellido) }}</div>
            <div class="endorser-info">
              <div class="endorser-name">{{ endorser.nombre }} {{ endorser.apellido }}</div>
              <div class="endorsed-date">{{ formatDate(endorser.endorsed_at) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trending Skills Widget -->
    <div v-if="showTrending" class="trending-skills">
      <h4>🔥 Skills Trending</h4>
      <div class="trending-list">
        <div v-for="skill in trendingSkills" :key="skill.skill_name" class="trending-item">
          <span class="trending-name">{{ skill.skill_name }}</span>
          <span class="trending-count">{{ skill.user_count }} usuarios</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSkills } from '../composables/useSkills';

const props = defineProps({
  userId: {
    type: Number,
    required: true
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  },
  showTrending: {
    type: Boolean,
    default: false
  }
});

const { 
  userSkills, 
  trendingSkills,
  skillEndorsers,
  loading,
  addSkill,
  removeSkill,
  getUserSkills,
  endorseSkill,
  removeEndorsement,
  getSkillEndorsers,
  getTrendingSkills
} = useSkills();

const showAddSkill = ref(false);
const newSkillName = ref('');
const showEndorsersModal = ref(false);

const addNewSkill = async () => {
  if (!newSkillName.value.trim()) return;
  
  try {
    await addSkill(newSkillName.value);
    newSkillName.value = '';
    showAddSkill.value = false;
    await getUserSkills(props.userId);
  } catch (err) {
    alert(err.response?.data?.error || 'Error al agregar skill');
  }
};

const removeThisSkill = async (skillId) => {
  if (!confirm('¿Eliminar esta skill?')) return;
  
  try {
    await removeSkill(skillId);
    await getUserSkills(props.userId);
  } catch (err) {
    alert('Error al eliminar skill');
  }
};

const endorseThisSkill = async (skillId) => {
  try {
    await endorseSkill(skillId);
    await getUserSkills(props.userId);
  } catch (err) {
    alert(err.response?.data?.error || 'Error al endorsar');
  }
};

const removeThisEndorsement = async (skillId) => {
  try {
    await removeEndorsement(skillId);
    await getUserSkills(props.userId);
  } catch (err) {
    alert('Error al remover endorsement');
  }
};

const showEndorsers = async (skillId) => {
  showEndorsersModal.value = true;
  await getSkillEndorsers(skillId);
};

const closeEndorsersModal = () => {
  showEndorsersModal.value = false;
};

const getInitials = (nombre, apellido) => {
  return `${nombre[0]}${apellido[0]}`.toUpperCase();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

onMounted(async () => {
  await getUserSkills(props.userId);
  if (props.showTrending) {
    await getTrendingSkills(10);
  }
});
</script>

<style scoped>
.skills-section {
  background: rgba(26, 22, 37, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #e9d5ff;
  margin: 0;
}

.add-btn {
  padding: 8px 16px;
  background: #a855f7;
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #7e22ce;
}

.add-skill-form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.skill-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.skill-input:focus {
  border-color: #a855f7;
}

.save-btn {
  padding: 10px 20px;
  background: #a855f7;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 10px 20px;
  background: rgba(26, 22, 37, 0.9);
  color: #c4b5fd;
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s;
}

.skill-item:hover {
  background: #e7f3ff;
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-weight: 600;
  font-size: 16px;
  color: #e9d5ff;
  margin-bottom: 6px;
}

.endorsement-count {
  font-size: 14px;
  color: #c4b5fd;
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon {
  color: #ffa500;
}

.endorsed-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: #d4edda;
  color: #155724;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
}

.check {
  color: #28a745;
}

.skill-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.endorse-btn,
.un-endorse-btn,
.view-endorsers-btn {
  padding: 8px 16px;
  background: rgba(26, 22, 37, 0.9);
  border: 1px solid #a855f7;
  color: #a855f7;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.endorse-btn:hover {
  background: #a855f7;
  color: white;
}

.un-endorse-btn {
  border-color: #a78bfa;
  color: #a78bfa;
}

.remove-btn {
  width: 32px;
  height: 32px;
  background: rgba(26, 22, 37, 0.9);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 50%;
  color: #a78bfa;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fee;
  border-color: #c33;
  color: #c33;
}

.trending-skills {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(168, 85, 247, 0.2);
}

.trending-skills h4 {
  font-size: 16px;
  font-weight: 600;
  color: #e9d5ff;
  margin: 0 0 16px 0;
}

.trending-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.trending-name {
  font-weight: 500;
  color: #e9d5ff;
}

.trending-count {
  color: #c4b5fd;
  font-size: 13px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a78bfa;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(168, 85, 247, 0.15);
  border-top: 3px solid #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(26, 22, 37, 0.9);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #e9d5ff;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  color: #a78bfa;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #e9d5ff;
}

.endorsers-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.endorser-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.endorser-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #7e22ce);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.endorser-info {
  flex: 1;
}

.endorser-name {
  font-weight: 600;
  color: #e9d5ff;
  font-size: 14px;
}

.endorsed-date {
  font-size: 12px;
  color: #a78bfa;
  margin-top: 2px;
}
</style>
