

<template>
  <div class="weather-page">
    <div class="page-header">
      <div>
        <h2>{{ tr('weather') }}</h2>
        <p>{{ tr('subtitle') }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="weather-message">
      {{ tr('loading') }}
    </div>

    <!-- No active field -->
    <div v-else-if="!activeField" class="weather-message">
      <h3>{{ tr('noActiveField') }}</h3>
      <p>{{ tr('selectFieldMessage') }}</p>
    </div>

    <!-- API error -->
    <div v-else-if="errorMessage" class="weather-message error">
      <h3>{{ tr('unavailable') }}</h3>
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Weather Content -->
    <template v-else-if="weatherData">

      <div class="field-heading">
        <div>
          <h3>{{ activeField.name }}</h3>
          <span>{{ activeField.crop || tr('noCrop') }}</span>
        </div>

        <span class="field-location">
          {{ activeField.location || tr('fieldLocation') }}
        </span>
      </div>

      <!-- Current Weather -->
      <section class="weather-section">
        <div class="section-heading">
          <h3>{{ tr('currentWeather') }}</h3>
          <span>{{ tr('liveConditions') }}</span>
        </div>

        <WeatherCard
          :temperature="weatherData.temperature"
          :condition="weatherData.condition"
          :humidity="weatherData.humidity"
          :wind-speed="weatherData.windSpeed"
          :precipitation-chance="weatherData.precipitationChance"
        />
      </section>

      <!-- Hourly Forecast -->
      <section class="weather-section">
        <div class="section-heading">
          <h3>{{ tr('hourlyForecast') }}</h3>
          <span>{{ tr('next24Hours') }}</span>
        </div>

        <div v-if="hourlyForecast.length" class="hourly-list">
          <div
            v-for="hour in hourlyForecast"
            :key="hour.time"
            class="hourly-item"
          >
            <span class="hour-time">
              {{ formatHour(hour.time) }}
            </span>

            <strong class="hour-temperature">
              {{ Math.round(hour.temperature) }}°C
            </strong>

            <span class="hour-condition">
              {{ getWeatherCondition(hour.weatherCode) }}
            </span>

            <span class="hour-rain">
              {{ tr('rain') }}: {{ hour.rainChance ?? '--' }}%
            </span>
          </div>
        </div>

        <div v-else class="weather-message">
          {{ tr('hourlyUnavailable') }}
        </div>
      </section>

      <!-- Daily Forecast -->
      <section class="weather-section">
        <div class="section-heading">
          <h3>{{ tr('weeklyForecast') }}</h3>
          <span>{{ tr('weeklyOverview') }}</span>
        </div>

       <ForecastCard
  :forecast="forecastData"
  :language="currentLanguage"
/>
      </section>

      <!-- Additional Weather Information -->
      <section class="weather-section">
        <div class="section-heading">
          <h3>{{ tr('weatherDetails') }}</h3>
          <span>{{ tr('additionalInfo') }}</span>
        </div>

        <div class="details-grid">

          <div class="detail-card">
            <span>{{ tr('feelsLike') }}</span>
            <strong>
              {{ Math.round(weatherData.apparentTemperature) }}°C
            </strong>
          </div>

          <div class="detail-card">
            <span>{{ tr('humidity') }}</span>
            <strong>{{ weatherData.humidity }}%</strong>
          </div>

          <div class="detail-card">
            <span>{{ tr('windSpeed') }}</span>
            <strong>{{ weatherData.windSpeed }} km/h</strong>
          </div>

          <div class="detail-card">
            <span>{{ tr('windDirection') }}</span>
            <strong>{{ weatherData.windDirection }}°</strong>
          </div>

          <div class="detail-card">
            <span>{{ tr('precipitation') }}</span>
            <strong>{{ weatherData.precipitation }} mm</strong>
          </div>

          <div class="detail-card">
            <span>{{ tr('rainProbability') }}</span>
            <strong>{{ weatherData.precipitationChance }}%</strong>
          </div>

          <div class="detail-card">
            <span>{{ tr('sunrise') }}</span>
            <strong>{{ formatTime(weatherData.sunrise) }}</strong>
          </div>

          <div class="detail-card">
            <span>{{ tr('sunset') }}</span>
            <strong>{{ formatTime(weatherData.sunset) }}</strong>
          </div>

        </div>
      </section>

    </template>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'

import { currentLanguage } from '../services/languageService'

import WeatherCard from '../components/WeatherCard.vue'
import ForecastCard from '../components/ForecastCard.vue'

import {
  getFields,
  getSelectedFieldId
} from '../services/fieldService'

import {
  getWeatherByCoordinates
} from '../services/weatherService'

const translations = {
  en: {
    weather: 'Weather',
    subtitle: 'Weather conditions and forecasts for your agricultural field.',
    loading: 'Loading weather data...',
    noActiveField: 'No active field selected',
    selectFieldMessage: 'Please select an agricultural field from Fields Management to view its weather conditions.',
    unavailable: 'Weather data unavailable',
    noCrop: 'No crop specified',
    fieldLocation: 'Field location',
    currentWeather: 'Current Weather',
    liveConditions: 'Live conditions',
    hourlyForecast: 'Hourly Forecast',
    next24Hours: 'Next 24 hours',
    rain: 'Rain',
    hourlyUnavailable: 'Hourly forecast is unavailable.',
    weeklyForecast: '7-Day Forecast',
    weeklyOverview: 'Weekly overview',
    weatherDetails: 'Weather Details',
    additionalInfo: 'Additional information',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
    precipitation: 'Precipitation',
    rainProbability: 'Rain Probability',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    forecastUnavailable: '7-day forecast data is unavailable.',
    currentUnavailable: 'Current weather data is unavailable.',
    precipitationUnavailable: 'Precipitation probability is unavailable.',
    retrievalError: 'Unable to retrieve weather data.',

    conditions: {
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
      99: 'Thunderstorm with Heavy Hail',
      unknown: 'Unknown Conditions'
    }
  },

  el: {
    weather: 'Καιρός',
    subtitle: 'Καιρικές συνθήκες και προβλέψεις για το αγροτεμάχιό σας.',
    loading: 'Φόρτωση καιρικών δεδομένων...',
    noActiveField: 'Δεν έχει επιλεγεί ενεργό αγροτεμάχιο',
    selectFieldMessage: 'Παρακαλώ επιλέξτε ένα αγροτεμάχιο από τη Διαχείριση Αγροτεμαχίων για να δείτε τις καιρικές συνθήκες.',
    unavailable: 'Μη διαθέσιμα καιρικά δεδομένα',
    noCrop: 'Δεν έχει οριστεί καλλιέργεια',
    fieldLocation: 'Τοποθεσία αγροτεμαχίου',
    currentWeather: 'Τρέχων Καιρός',
    liveConditions: 'Τρέχουσες συνθήκες',
    hourlyForecast: 'Ωριαία Πρόγνωση',
    next24Hours: 'Επόμενες 24 ώρες',
    rain: 'Βροχή',
    hourlyUnavailable: 'Η ωριαία πρόγνωση δεν είναι διαθέσιμη.',
    weeklyForecast: 'Πρόγνωση 7 Ημερών',
    weeklyOverview: 'Εβδομαδιαία επισκόπηση',
    weatherDetails: 'Λεπτομέρειες Καιρού',
    additionalInfo: 'Πρόσθετες πληροφορίες',
    feelsLike: 'Αισθητή Θερμοκρασία',
    humidity: 'Υγρασία',
    windSpeed: 'Ταχύτητα Ανέμου',
    windDirection: 'Κατεύθυνση Ανέμου',
    precipitation: 'Υετός',
    rainProbability: 'Πιθανότητα Βροχής',
    sunrise: 'Ανατολή Ηλίου',
    sunset: 'Δύση Ηλίου',
    forecastUnavailable: 'Τα δεδομένα πρόγνωσης 7 ημερών δεν είναι διαθέσιμα.',
    currentUnavailable: 'Τα τρέχοντα καιρικά δεδομένα δεν είναι διαθέσιμα.',
    precipitationUnavailable: 'Η πιθανότητα υετού δεν είναι διαθέσιμη.',
    retrievalError: 'Δεν ήταν δυνατή η ανάκτηση των καιρικών δεδομένων.',

    conditions: {
      0: 'Αίθριος Ουρανός',
      1: 'Κυρίως Αίθριος',
      2: 'Μερική Νέφωση',
      3: 'Συννεφιά',
      45: 'Ομίχλη',
      48: 'Παγωμένη Ομίχλη',
      51: 'Ασθενής Ψιχάλα',
      53: 'Μέτρια Ψιχάλα',
      55: 'Έντονη Ψιχάλα',
      56: 'Παγωμένη Ψιχάλα',
      57: 'Έντονη Παγωμένη Ψιχάλα',
      61: 'Ασθενής Βροχή',
      63: 'Μέτρια Βροχή',
      65: 'Ισχυρή Βροχή',
      66: 'Παγωμένη Βροχή',
      67: 'Ισχυρή Παγωμένη Βροχή',
      71: 'Ασθενής Χιονόπτωση',
      73: 'Μέτρια Χιονόπτωση',
      75: 'Ισχυρή Χιονόπτωση',
      77: 'Κόκκοι Χιονιού',
      80: 'Ασθενείς Μπόρες',
      81: 'Μέτριες Μπόρες',
      82: 'Ισχυρές Μπόρες',
      85: 'Ασθενείς Χιονομπόρες',
      86: 'Ισχυρές Χιονομπόρες',
      95: 'Καταιγίδα',
      96: 'Καταιγίδα με Χαλάζι',
      99: 'Ισχυρή Καταιγίδα με Χαλάζι',
      unknown: 'Άγνωστες Συνθήκες'
    }
  }
}

function tr(key) {
  return translations[currentLanguage.value]?.[key]
    || translations.en[key]
    || key
}

function getWeatherCondition(code) {
  const conditions = translations[currentLanguage.value]?.conditions
    || translations.en.conditions

  return conditions[code] || conditions.unknown
}

const activeField = ref(null)
const weatherData = ref(null)
const forecastData = ref([])
const hourlyForecast = ref([])

const loading = ref(true)
const errorMessage = ref('')

// Current precipitation probability
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

// Format daily forecast
function formatForecast(data) {
  const daily = data.daily

  if (!daily?.time?.length) {
    throw new Error('forecastUnavailable')
  }

  return daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    maxTemperature: daily.temperature_2m_max[index],
    minTemperature: daily.temperature_2m_min[index],
    rainChance: daily.precipitation_probability_max[index] ?? 0
  }))
}

// Format hourly forecast
function formatHourlyForecast(data) {
  const hourly = data.hourly

  if (
    !hourly?.time?.length ||
    !data.current?.time
  ) {
    return []
  }

  const currentTime = new Date(data.current.time).getTime()

  if (!Number.isFinite(currentTime)) {
    return []
  }

  const startIndex = hourly.time.findIndex(time => {
    return new Date(time).getTime() >= currentTime
  })

  if (startIndex === -1) {
    return []
  }

  return hourly.time
    .slice(startIndex, startIndex + 24)
    .map((time, index) => {
      const actualIndex = startIndex + index

      return {
        time,
        temperature: hourly.temperature_2m[actualIndex],
        weatherCode: hourly.weather_code[actualIndex],
        rainChance:
          hourly.precipitation_probability[actualIndex]
      }
    })
}

// Format hour
function formatHour(time) {
  return new Date(time).toLocaleTimeString(
    currentLanguage.value === 'el' ? 'el-GR' : 'en-GB',
    {
      hour: '2-digit',
      minute: '2-digit'
    }
  )
}

// Format sunrise and sunset
function formatTime(time) {
  if (!time) return '--'

  return new Date(time).toLocaleTimeString(
    currentLanguage.value === 'el' ? 'el-GR' : 'en-GB',
    {
      hour: '2-digit',
      minute: '2-digit'
    }
  )
}

// Load weather for active field
async function loadWeather() {
  loading.value = true
  errorMessage.value = ''

  weatherData.value = null
  forecastData.value = []
  hourlyForecast.value = []
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
      throw new Error('currentUnavailable')
    }

    const precipitationChance =
      getCurrentPrecipitationChance(data)

    if (!Number.isFinite(precipitationChance)) {
      throw new Error('precipitationUnavailable')
    }

    weatherData.value = {
      temperature: data.current.temperature_2m,
      condition: getWeatherCondition(data.current.weather_code),
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      precipitation: data.current.precipitation,
      precipitationChance,
      sunrise: data.daily?.sunrise?.[0],
      sunset: data.daily?.sunset?.[0]
    }

    forecastData.value = formatForecast(data)
    hourlyForecast.value = formatHourlyForecast(data)

  } catch (error) {
    console.error('Error loading weather:', error)

    weatherData.value = null
    forecastData.value = []
    hourlyForecast.value = []

    errorMessage.value = tr(error.message) === error.message
      ? tr('retrievalError')
      : tr(error.message)

  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadWeather()
})
</script>


<style scoped>
.weather-page {
  padding: 30px;
}

.page-header {
  margin-bottom: 25px;
}

.page-header h2 {
  font-size: 21px;
  color: #183b2b;
  margin: 0 0 8px;
}

.page-header p {
  font-size: 13px;
  color: #84918a;
  margin: 0;
}

.field-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}

.field-heading h3 {
  font-size: 16px;
  color: #183b2b;
  margin: 0 0 5px;
}

.field-heading span {
  font-size: 12px;
  color: #84918a;
}

.field-location {
  text-align: right;
}

.weather-section {
  margin-bottom: 30px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-heading h3 {
  font-size: 16px;
  color: #183b2b;
  margin: 0;
}

.section-heading span {
  font-size: 11px;
  color: #84918a;
}

.hourly-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 2px 12px;
}

.hourly-item {
  min-width: 115px;
  background: #ffffff;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.hour-time {
  font-size: 12px;
  color: #84918a;
}

.hour-temperature {
  font-size: 21px;
  color: #183b2b;
}

.hour-condition {
  font-size: 11px;
  color: #526258;
  min-height: 28px;
}

.hour-rain {
  font-size: 11px;
  color: #36734f;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
}

.detail-card {
  background: #ffffff;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-card span {
  font-size: 11px;
  color: #84918a;
}

.detail-card strong {
  font-size: 17px;
  color: #183b2b;
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

@media (max-width: 900px) {
  .details-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 550px) {
  .weather-page {
    padding: 18px;
  }

  .field-heading {
    align-items: flex-start;
  }

  .section-heading {
    align-items: flex-start;
    gap: 10px;
  }

  .details-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .detail-card {
    padding: 14px;
  }
}
</style>
