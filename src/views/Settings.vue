
<template>
  <section class="settings-page">
    <div class="page-heading">
      <div>
        <h1>{{ t('settingsTitle') }}</h1>
        <p>{{ t('settingsSubtitle') }}</p>
      </div>
    </div>

    
    <!-- Measurement Units -->
    <div class="settings-card">
      <div class="card-heading">
        <div>
          <h2>{{ t('measurementUnits') }}</h2>
          <p>{{ t('measurementUnitsSubtitle') }}</p>
        </div>
        <span class="section-icon">📏</span>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="areaUnit">{{ t('areaUnit') }}</label>
          <select id="areaUnit" v-model="settings.areaUnit">
            <option value="hectares">{{ t('hectares') }}</option>
            <option value="acres">{{ t('acres') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="waterUnit">{{ t('waterUnit') }}</label>
          <select id="waterUnit" v-model="settings.waterUnit">
            <option value="liters">{{ t('liters') }}</option>
            <option value="cubicMeters">{{ t('cubicMeters') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="temperatureUnit">{{ t('temperature') }}</label>
          <select
            id="temperatureUnit"
            v-model="settings.temperatureUnit"
          >
            <option value="celsius">{{ t('celsius') }}</option>
            <option value="fahrenheit">{{ t('fahrenheit') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Regional Settings -->
    <div class="settings-card">
      <div class="card-heading">
        <div>
          <h2>{{ t('regionalSettings') }}</h2>
          <p>{{ t('regionalSettingsSubtitle') }}</p>
        </div>
        <span class="section-icon">🌍</span>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="language">{{ t('language') }}</label>
          <select id="language" v-model="settings.language">
            <option value="en">English</option>
            <option value="el">Ελληνικά</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dateFormat">{{ t('dateFormat') }}</label>
          <select id="dateFormat" v-model="settings.dateFormat">
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div class="form-group">
          <label for="timezone">{{ t('timeZone') }}</label>
          <select id="timezone" v-model="settings.timezone">
            <option value="Europe/Athens">Europe/Athens</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Europe/Berlin">Europe/Berlin</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="settings-card">
      <div class="card-heading">
        <div>
          <h2>{{ t('dataManagement') }}</h2>
          <p>{{ t('dataManagementSubtitle') }}</p>
        </div>
        <span class="section-icon">💾</span>
      </div>

      <div class="data-management">
        <div>
          <strong>{{ t('applicationStorage') }}</strong>
          <p>{{ t('storageDescription') }}</p>
        </div>

        <span class="storage-status">{{ t('localStorage') }}</span>
      </div>

      <div class="data-management danger-zone">
        <div>
          <strong>{{ t('resetSettings') }}</strong>
          <p>{{ t('resetSettingsDescription') }}</p>
        </div>

        <button
          class="reset-button"
          type="button"
          @click="resetSettings"
        >
          {{ t('resetSettings') }}
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="settings-actions">
      <span v-if="saveMessage" class="save-message">
        {{ saveMessage }}
      </span>

      <button
        class="save-button"
        type="button"
        @click="saveSettings"
      >
        {{ t('saveChanges') }}
      </button>
    </div>
  </section>
</template>



<script setup>
import { reactive, ref, onMounted } from 'vue'

import {
  getSettings,
  saveSettings as persistSettings,
  defaultSettings
} from '../services/settingsService'

import { setLanguage, t } from '../services/languageService'

const settings = reactive(getSettings())

const saveMessage = ref('')

function loadSettings() {
  Object.assign(settings, getSettings())
}

function saveSettings() {
  const success = persistSettings({ ...settings })

  if (!success) {
    saveMessage.value = t('settingsSaveError')
    return
  }

  setLanguage(settings.language)

  saveMessage.value = t('settingsSaved')
}

function resetSettings() {
  const confirmed = window.confirm(
  t('confirmResetSettings')
)

  if (!confirmed) return

  Object.assign(settings, defaultSettings)

  saveSettings()
}

onMounted(() => {
  loadSettings()
})
</script>


<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-heading h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
}

.page-heading p {
  margin: 0;
  color: #8a8f98;
  font-size: 14px;
}

.settings-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e8e8e8);
  border-radius: 12px;
  padding: 24px;
}

.card-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-heading h2 {
  margin: 0 0 7px;
  font-size: 17px;
}

.card-heading p {
  margin: 0;
  color: #9298a1;
  font-size: 13px;
}

.section-icon {
  font-size: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color, #333333);
}

.form-group input,
.form-group select {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid var(--border-color, #dedede);
  border-radius: 8px;
  background: var(--card-bg, #ffffff);
  color: var(--text-color, #333333);
  font-size: 13px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4d9b70;
}

.data-management {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-color, #eeeeee);
}

.data-management strong {
  font-size: 14px;
}

.data-management p {
  margin: 7px 0 0;
  color: #9298a1;
  font-size: 12px;
}

.storage-status {
  padding: 7px 12px;
  background: #eaf5ed;
  color: #43875d;
  border-radius: 20px;
  font-size: 12px;
  white-space: nowrap;
}

.danger-zone {
  border-bottom: none;
  margin-top: 8px;
}

.reset-button {
  padding: 10px 14px;
  border: 1px solid #d96b6b;
  border-radius: 7px;
  background: transparent;
  color: #c94e4e;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
}

.save-button {
  padding: 12px 24px;
  background: #4d9b70;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.save-button:hover {
  background: #3d825c;
}

.save-message {
  color: #4d9b70;
  font-size: 13px;
}

@media (max-width: 650px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .settings-card {
    padding: 18px;
  }

  .data-management {
    align-items: flex-start;
    flex-direction: column;
  }

  .settings-actions {
    align-items: flex-end;
    flex-direction: column;
  }
}
</style>
