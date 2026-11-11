
<template>
  <section class="weather-card">
    <div class="card-header">
      <div>
        <h2>{{ currentLanguage === 'el' ? 'Επισκόπηση Καιρού' : 'Weather Overview' }}</h2>
        <p>{{ currentLanguage === 'el' ? 'Τρέχουσες καιρικές συνθήκες' : 'Current weather conditions' }}</p>
      </div>

      <span class="weather-status">
        {{ currentLanguage === 'el' ? 'Τώρα' : 'Current' }}
      </span>
    </div>

    <div class="main-weather">
      <div>
        <span class="temperature">{{ temperature }}°C</span>
        <p class="condition">{{ translatedCondition }}</p>
      </div>
    </div>

    <div class="weather-details">
      <div class="weather-detail">
        <span class="detail-label">
          {{ currentLanguage === 'el' ? 'Υγρασία' : 'Humidity' }}
        </span>
        <strong>{{ humidity }}%</strong>
      </div>

      <div class="weather-detail">
        <span class="detail-label">
          {{ currentLanguage === 'el' ? 'Ταχύτητα ανέμου' : 'Wind Speed' }}
        </span>
        <strong>{{ windSpeed }} km/h</strong>
      </div>

      <div class="weather-detail">
        <span class="detail-label">
          {{ currentLanguage === 'el' ? 'Πιθανότητα βροχής' : 'Rain Chance' }}
        </span>
        <strong>{{ precipitationChance }}%</strong>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getSettings } from '../services/settingsService'

const props = defineProps({
  temperature: {
    type: Number,
    default: 24,
  },
  condition: {
    type: String,
    default: 'Partly Cloudy',
  },
  humidity: {
    type: Number,
    default: 65,
  },
  windSpeed: {
    type: Number,
    default: 12,
  },
  precipitationChance: {
    type: Number,
    default: 20,
  },
})

const settings = ref(getSettings())

const currentLanguage = computed(() =>
  settings.value.language === 'el' ? 'el' : 'en'
)

function updateSettings() {
  settings.value = getSettings()
}

function handleStorageChange(event) {
  if (event.key === 'agrovision_settings') {
    updateSettings()
  }
}

onMounted(() => {
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('focus', updateSettings)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('focus', updateSettings)
})

const conditionTranslations = {
  'clear sky': 'Αίθριος καιρός',
  'mainly clear': 'Κυρίως αίθριος',
  'partly cloudy': 'Μερική συννεφιά',
  'overcast': 'Συννεφιά',
  'fog': 'Ομίχλη',
  'depositing rime fog': 'Ομίχλη',
  'drizzle': 'Ψιχάλα',
  'freezing drizzle': 'Παγωμένη ψιχάλα',
  'rain': 'Βροχή',
  'freezing rain': 'Παγωμένη βροχή',
  'snow': 'Χιονόπτωση',
  'snow grains': 'Κόκκοι χιονιού',
  'rain showers': 'Μπόρες',
  'snow showers': 'Χιονοπτώσεις',
  'thunderstorm': 'Καταιγίδα',
  'thunderstorm with hail': 'Καταιγίδα με χαλάζι',
}

const translatedCondition = computed(() => {
  if (currentLanguage.value !== 'el') {
    return props.condition
  }

  const normalized = props.condition.trim().toLowerCase()

  return conditionTranslations[normalized] || props.condition
})
</script>

<style scoped>
.weather-card {
  background-color: #ffffff;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h2 {
  font-size: 17px;
  color: #183b2b;
  margin: 0;
}

.card-header p {
  font-size: 12px;
  color: #84918a;
  margin-top: 6px;
}

.weather-status {
  font-size: 11px;
  color: #36734f;
  background-color: #eaf3ed;
  padding: 6px 10px;
  border-radius: 20px;
}

.main-weather {
  margin: 25px 0;
}

.temperature {
  font-size: 42px;
  font-weight: 700;
  color: #183b2b;
}

.condition {
  font-size: 14px;
  color: #84918a;
  margin-top: 4px;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  border-top: 1px solid #e5e9e6;
  padding-top: 20px;
}

.weather-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-size: 11px;
  color: #84918a;
}

.weather-detail strong {
  font-size: 15px;
  color: #263b2e;
}
</style>
