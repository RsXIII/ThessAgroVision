
<template>
  <div class="dashboard-content">
    <div class="welcome-section">
      <h2>{{ t('overview') }}</h2>
      <p>{{ t('description') }}</p>
    </div>
   
<!-- Farm Profile -->
<div class="farm-profile-card">

  <div class="farm-profile-header">
    <h3>{{ t('farmProfile') }}</h3>
  </div>

  <div class="farm-profile-grid">

    <div class="farm-profile-item">
      <span>{{ t('farmName') }}</span>
      <strong>{{ activeField ? activeField.name : t('notSet') }}</strong>
    </div>

    <div class="farm-profile-item">
      <span>{{ t('farmLocation') }}</span>
      <strong>
        {{
          activeField && activeField.latitude != null && activeField.longitude != null
            ? activeField.latitude + ', ' + activeField.longitude
            : t('notSet')
        }}
      </strong>
    </div>

    <div class="farm-profile-item">
      <span>{{ t('farmSize') }}</span>
      <strong>{{ formattedFarmSize }}</strong>
    </div>

  </div>

</div>

<div class="statistics-grid">

  <div class="dashboard-stat-card">
    <span>{{ t('totalFields') }}</span>
    <strong>{{ totalFields }}</strong>
    <small>{{ t('registeredFields') }}</small>
  </div>

  <div class="dashboard-stat-card">
    <span>{{ t('activeCrops') }}</span>
    <strong>{{ activeCrops }}</strong>
    <small>{{ t('growingCrops') }}</small>
  </div>

  <div class="dashboard-stat-card">
    <span>{{ t('scheduledIrrigations') }}</span>
    <strong>{{ scheduledIrrigations }}</strong>
    <small>{{ t('upcomingIrrigations') }}</small>
  </div>

  <div class="dashboard-stat-card">
    <span>{{ t('waterConsumption') }}</span>
    <strong>{{ totalWaterConsumption.toLocaleString() }} L</strong>
    <small>{{ t('completedIrrigation') }}</small>
  </div>

</div>

    <div class="dashboard-grid">


<div class="dashboard-grid">

  <!-- Active Field Heading -->
  <div v-if="activeField" class="field-heading">
    <h3>{{ activeField.name }}</h3>
    <span>{{ activeField.crop || t('noCrop') }}</span>
  </div>

  <!-- Loading -->
  <div v-if="loading" class="weather-message">
    {{ t('loading') }}
  </div>

  <!-- No active field -->
  <div v-else-if="!activeField" class="weather-message">
    <h3>{{ t('noActiveField') }}</h3>
    <p>{{ t('selectField') }}</p>
  </div>

  <!-- Weather Error -->
  <div v-else-if="errorMessage" class="weather-message error">
    <h3>{{ t('weatherUnavailable') }}</h3>
    <p>{{ errorMessage }}</p>
  </div>

  <!-- Weather and Forecast -->
  <template v-else-if="weatherData">

    <WeatherCard
      :temperature="weatherData.temperature"
      :condition="weatherData.condition"
      :humidity="weatherData.humidity"
      :wind-speed="weatherData.windSpeed"
      :precipitation-chance="weatherData.precipitationChance"
    />

    <ForecastCard
      :forecast="forecastData"
      :language="currentLanguage"
    />

  </template>

</div>

    </div>

<div class="recent-activity">

  <div class="activity-header">
    <h3>{{ t('recentActivity') }}</h3>
    <span>{{ t('latestRecords') }}</span>
  </div>

  <div v-if="recentActivity.length === 0" class="activity-empty">
    {{ t('noActivity') }}
  </div>

  <div
    v-for="item in recentActivity"
    :key="item.id"
    class="activity-item"
  >
    <div class="activity-info">
      <strong>{{ getActivityFieldName(item.fieldId) }}</strong>
      <span>{{ getActivityCropName(item.cropId) }}</span>
    </div>

    <div class="activity-details">
      <strong>{{ Number(item.waterAmount).toLocaleString() }} L</strong>
      <span>{{ item.date }} · {{ item.time }}</span>
    </div>

    <span
      class="activity-status"
      :class="item.status.toLowerCase()"
    >
      {{ translateStatus(item.status) }}
    </span>
  </div>

</div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

import WeatherCard from '../components/WeatherCard.vue'
import ForecastCard from '../components/ForecastCard.vue'

import {
  getFields,
  getSelectedFieldId
} from '../services/fieldService'

import {
  getWeatherByCoordinates
} from '../services/weatherService'

import { getCrops } from '../services/cropService'

import { getIrrigations } from '../services/irrigationService'
import { getSettings } from '../services/settingsService'

const currentLanguage = ref(getSettings().language || 'en')
const farmSettings = ref(getSettings())


const formattedFarmSize = computed(() => {
  const area = activeField.value?.area
  const size = Number(area)

  if (
    !activeField.value ||
    area === '' ||
    area === null ||
    area === undefined ||
    !Number.isFinite(size) ||
    size <= 0
  ) {
    return t('notSet')
  }

  return `${size.toLocaleString(
    currentLanguage.value === 'el' ? 'el-GR' : 'en-US',
    { maximumFractionDigits: 2 }
  )} ha`
})

const translations = {
  en: {
    overview: 'Overview',
    farmProfile: 'Farm Profile',
    farmName: 'Farm Name',
    farmLocation: 'Farm Location',
    farmOwner: 'Farm Owner',
    farmSize: 'Total Farm Area (ha)',
    notSet: 'Not specified',
    description: 'Monitor your agricultural activities in one place.',
    totalFields: 'Total Fields',
    registeredFields: 'Registered agricultural fields',
    activeCrops: 'Active Crops',
    growingCrops: 'Growing and ready for harvest',
    scheduledIrrigations: 'Scheduled Irrigations',
    upcomingIrrigations: 'Upcoming irrigation activities',
    waterConsumption: 'Water Consumption',
    completedIrrigation: 'Total completed irrigation',
    loading: 'Loading weather data...',
    noActiveField: 'No active field selected',
    selectField: 'Please select an agricultural field from Fields Management to view its weather conditions.',
    weatherUnavailable: 'Weather data unavailable',
    noCrop: 'No crop specified',
    recentActivity: 'Recent Irrigation Activity',
    latestRecords: 'Latest 5 records',
    noActivity: 'No irrigation activity recorded yet.',
    unknownField: 'Unknown Field',
    completed: 'Completed',
    scheduled: 'Scheduled',
    cancelled: 'Cancelled'
  },
  el: {
    overview: 'Επισκόπηση',
    farmProfile: 'Προφίλ Αγροκτήματος',
    farmName: 'Όνομα Αγροκτήματος',
    farmLocation: 'Τοποθεσία Αγροκτήματος',
    farmOwner: 'Ιδιοκτήτης Αγροκτήματος',
    farmSize: 'Συνολική Έκταση (ha)',
    notSet: 'Δεν έχει οριστεί',
    description: 'Παρακολουθήστε όλες τις αγροτικές σας δραστηριότητες σε ένα σημείο.',
    totalFields: 'Συνολικά Αγροτεμάχια',
    registeredFields: 'Καταχωρημένα αγροτεμάχια',
    activeCrops: 'Ενεργές Καλλιέργειες',
    growingCrops: 'Σε ανάπτυξη και έτοιμες για συγκομιδή',
    scheduledIrrigations: 'Προγραμματισμένες Αρδεύσεις',
    upcomingIrrigations: 'Επερχόμενες δραστηριότητες άρδευσης',
    waterConsumption: 'Κατανάλωση Νερού',
    completedIrrigation: 'Συνολική ολοκληρωμένη άρδευση',
    loading: 'Φόρτωση δεδομένων καιρού...',
    noActiveField: 'Δεν έχει επιλεγεί ενεργό αγροτεμάχιο',
    selectField: 'Επιλέξτε ένα αγροτεμάχιο από τη Διαχείριση Αγροτεμαχίων για να δείτε τις καιρικές συνθήκες.',
    weatherUnavailable: 'Τα δεδομένα καιρού δεν είναι διαθέσιμα',
    noCrop: 'Δεν έχει οριστεί καλλιέργεια',
    recentActivity: 'Πρόσφατη Δραστηριότητα Άρδευσης',
    latestRecords: 'Τελευταίες 5 εγγραφές',
    noActivity: 'Δεν έχουν καταγραφεί δραστηριότητες άρδευσης.',
    unknownField: 'Άγνωστο Αγροτεμάχιο',
    completed: 'Ολοκληρώθηκε',
    scheduled: 'Προγραμματισμένη',
    cancelled: 'Ακυρώθηκε'
  }
}

const t = (key) =>
  translations[currentLanguage.value]?.[key] ||
  translations.en[key] ||
  key

function translateStatus(status) {
  const statusTranslations = {
    Completed: 'completed',
    Scheduled: 'scheduled',
    Cancelled: 'cancelled'
  }

  const key = statusTranslations[status]

  return key ? t(key) : status
}
const activeField = ref(null)
const weatherData = ref(null)
const forecastData = ref([])

const loading = ref(true)
const errorMessage = ref('')

const fields = ref([])
const crops = ref([])
const irrigations = ref([])

function loadDashboardData() {
  fields.value = getFields()
  crops.value = getCrops()
  irrigations.value = getIrrigations()
}
const totalFields = computed(() => fields.value.length)

const activeCrops = computed(() =>
  crops.value.filter(crop =>
    ['Growing', 'Ready for Harvest'].includes(crop.status)
  ).length
)

const scheduledIrrigations = computed(() =>
  irrigations.value.filter(item =>
    item.status === 'Scheduled'
  ).length
)

const totalWaterConsumption = computed(() =>
  irrigations.value
    .filter(item => item.status === 'Completed')
    .reduce(
      (total, item) => total + Number(item.waterAmount || 0),
      0
    )
)

// Get the 5 most recent irrigation activities
const recentActivity = computed(() =>
  [...irrigations.value]
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime()
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime()

      return dateB - dateA
    })
    .slice(0, 5)
)

// Get field name by ID
function getActivityFieldName(fieldId) {
  const field = fields.value.find(item => item.id === fieldId)

  return field ? field.name : t('unknownField')
}

// Get crop name by ID
function getActivityCropName(cropId) {
  const crop = crops.value.find(item => item.id === cropId)

  return crop ? crop.name : t('noCrop')
}

// WMO weather code descriptions
function getWeatherCondition(code) {
  const conditions = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Freezing Drizzle',
    57: 'Dense Freezing Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Heavy Hail'
  }

  return conditions[code] || 'Unknown Conditions'
}

// Find the closest hourly forecast entry
function getCurrentPrecipitationChance(data) {
  const times = data.hourly?.time
  const probabilities = data.hourly?.precipitation_probability

  if (!times || !probabilities || !data.current?.time) {
    return null
  }

  const currentTime = new Date(data.current.time).getTime()

  if (!Number.isFinite(currentTime)) {
    return null
  }

  let closestIndex = -1
  let smallestDifference = Infinity

  times.forEach((time, index) => {
    const difference = Math.abs(
      new Date(time).getTime() - currentTime
    )

    if (difference < smallestDifference) {
      smallestDifference = difference
      closestIndex = index
    }
  })

  if (closestIndex === -1) {
    return null
  }

  return probabilities[closestIndex]
}

// Convert Open-Meteo daily data
function formatForecast(data) {
  const daily = data.daily

  if (!daily?.time?.length) {
    throw new Error('7-day forecast data is unavailable.')
  }

  return daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    maxTemperature: daily.temperature_2m_max[index],
    minTemperature: daily.temperature_2m_min[index],
    rainChance: daily.precipitation_probability_max[index] ?? 0
  }))
}

// Load weather for active field
async function loadWeather() {
  loading.value = true
  errorMessage.value = ''
  weatherData.value = null
  forecastData.value = []
  activeField.value = null

  try {
    const fields = getFields()
    const selectedFieldId = getSelectedFieldId()

    activeField.value = fields.find(
      field => field.id === selectedFieldId
    ) || null

    if (!activeField.value) {
      return
    }

    const latitude = Number(activeField.value.latitude)
    const longitude = Number(activeField.value.longitude)

    const data = await getWeatherByCoordinates(
      latitude,
      longitude
    )

    if (!data.current) {
      throw new Error('Current weather data is unavailable.')
    }

    const precipitationChance =
      getCurrentPrecipitationChance(data)

    if (!Number.isFinite(precipitationChance)) {
      throw new Error('Precipitation probability is unavailable.')
    }

    weatherData.value = {
      temperature: data.current.temperature_2m,
      condition: getWeatherCondition(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitationChance
    }

    forecastData.value = formatForecast(data)

  } catch (error) {
    console.error('Error loading weather:', error)

    weatherData.value = null
    forecastData.value = []

    errorMessage.value = currentLanguage.value === 'el'
  ? 'Δεν ήταν δυνατή η ανάκτηση των δεδομένων καιρού.'
  : error.message || 'Unable to retrieve weather data.'
  } finally {
    loading.value = false
  }
}
function refreshFarmSettings() {
  const settings = getSettings()

  farmSettings.value = settings
  currentLanguage.value = settings.language || 'en'
}
onMounted(() => {
  loadDashboardData()
  loadWeather()

  window.addEventListener(
    'agrovision-settings-updated',
    refreshFarmSettings
  )

  window.addEventListener(
    'storage',
    refreshFarmSettings
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'agrovision-settings-updated',
    refreshFarmSettings
  )

  window.removeEventListener(
    'storage',
    refreshFarmSettings
  )
})
</script>

<style scoped>
.dashboard-content {
  padding: 30px;
}

.welcome-section {
  margin-bottom: 25px;
}

.welcome-section h2 {
  font-size: 21px;
  color: #183b2b;
  margin: 0 0 8px;
}

.welcome-section p {
  font-size: 13px;
  color: #84918a;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  max-width: 750px;
}

.field-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.field-heading h3 {
  font-size: 15px;
  color: #183b2b;
  margin: 0;
}

.field-heading span {
  font-size: 12px;
  color: #84918a;
}

.weather-message {
  background: #ffffff;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 24px;
  color: #526258;
  font-size: 13px;
}

.weather-message h3 {
  color: #183b2b;
  font-size: 16px;
  margin: 0 0 8px;
}

.weather-message p {
  margin: 0;
  line-height: 1.6;
}

.weather-message.error {
  border-color: #e8caca;
}

.weather-message.error h3 {
  color: #b34b4b;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 25px;
}

.dashboard-stat-card {
  background: #ffffff;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-stat-card span {
  color: #84918a;
  font-size: 13px;
}

.dashboard-stat-card strong {
  color: #183b2b;
  font-size: 27px;
}

.dashboard-stat-card small {
  color: #84918a;
  font-size: 11px;
}

.recent-activity {
  background: #ffffff;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 22px;
  margin-top: 25px;
  max-width: 750px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.activity-header h3 {
  color: #183b2b;
  font-size: 16px;
  margin: 0;
}

.activity-header span {
  color: #84918a;
  font-size: 12px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #edf0ed;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-info,
.activity-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.activity-info strong,
.activity-details strong {
  color: #183b2b;
  font-size: 13px;
}

.activity-info span,
.activity-details span {
  color: #84918a;
  font-size: 11px;
}

.activity-status {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 20px;
}

.activity-status.completed {
  background: #d1fae5;
  color: #047857;
}

.activity-status.scheduled {
  background: #fff3cd;
  color: #9a6700;
}

.activity-status.cancelled {
  background: #fee2e2;
  color: #b91c1c;
}

.activity-empty {
  color: #84918a;
  font-size: 13px;
  padding: 20px 0;
}

@media (max-width: 1000px) {
  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .statistics-grid {
    grid-template-columns: 1fr 1fr;
  }

  .activity-item {
    flex-wrap: wrap;
  }

  .activity-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
.farm-profile-card {
  background: #ffffff;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 22px;
  margin-bottom: 25px;
}

.farm-profile-header {
  margin-bottom: 20px;
}

.farm-profile-header h3 {
  color: #183b2b;
  font-size: 16px;
  margin: 0;
}

.farm-profile-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.farm-profile-item {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
}

.farm-profile-item span {
  color: #84918a;
  font-size: 12px;
}

.farm-profile-item strong {
  color: #183b2b;
  font-size: 14px;
  overflow-wrap: anywhere;
}

@media (max-width: 1000px) {
  .farm-profile-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .farm-profile-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
