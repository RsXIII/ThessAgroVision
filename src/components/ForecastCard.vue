
<template>
  <section class="forecast-card">
    <div class="forecast-header">
      <div>
        <h2>{{ t.title }}</h2>
        <p>{{ t.subtitle }}</p>
      </div>

      <span class="forecast-status">{{ t.days }}</span>
    </div>

    <div class="forecast-list">
      <div
        v-for="(day, index) in forecast"
        :key="day.date"
        class="forecast-day"
      >
        <div class="day-info">
          <strong>{{ formatDay(day.date, index) }}</strong>
          <span>{{ formatDate(day.date) }}</span>
        </div>

        <div class="day-condition">
          <span>{{ getWeatherCondition(day.weatherCode) }}</span>
        </div>

        <div class="day-temperatures">
          <strong>{{ formatTemperature(day.maxTemperature) }}</strong>
          <span>{{ formatTemperature(day.minTemperature) }}</span>
        </div>

        <div class="day-rain">
          <span>{{ t.rain }}</span>
          <strong>{{ day.rainChance }}%</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  forecast: {
    type: Array,
    default: () => []
  },
  language: {
    type: String,
    default: 'en'
  },
  temperatureUnit: {
    type: String,
    default: 'celsius'
  }
})

const locale = computed(() =>
  props.language === 'el' ? 'el-GR' : 'en-US'
)

const t = computed(() => {
  if (props.language === 'el') {
    return {
      title: 'Πρόγνωση 7 Ημερών',
      subtitle: 'Πρόγνωση καιρού για το ενεργό αγροτεμάχιο',
      days: '7 Ημέρες',
      today: 'Σήμερα',
      rain: 'Βροχή',
      conditions: {
        0: 'Καθαρός ουρανός',
        1: 'Κυρίως αίθριος',
        2: 'Μερική συννεφιά',
        3: 'Συννεφιά',
        45: 'Ομίχλη',
        48: 'Παγωμένη ομίχλη',
        51: 'Ασθενές ψιλόβροχο',
        53: 'Ψιλόβροχο',
        55: 'Έντονο ψιλόβροχο',
        56: 'Παγωμένο ψιλόβροχο',
        57: 'Έντονο παγωμένο ψιλόβροχο',
        61: 'Ασθενής βροχή',
        63: 'Μέτρια βροχή',
        65: 'Ισχυρή βροχή',
        66: 'Παγωμένη βροχή',
        67: 'Ισχυρή παγωμένη βροχή',
        71: 'Ασθενής χιονόπτωση',
        73: 'Μέτρια χιονόπτωση',
        75: 'Ισχυρή χιονόπτωση',
        77: 'Κόκκοι χιονιού',
        80: 'Μπόρες',
        81: 'Μέτριες μπόρες',
        82: 'Ισχυρές μπόρες',
        85: 'Χιονομπόρες',
        86: 'Ισχυρές χιονομπόρες',
        95: 'Καταιγίδα',
        96: 'Καταιγίδα με χαλάζι',
        99: 'Ισχυρή καταιγίδα με χαλάζι'
      }
    }
  }

  return {
    title: '7-Day Forecast',
    subtitle: 'Weather forecast for your active field',
    days: '7 Days',
    today: 'Today',
    rain: 'Rain',
    conditions: {
      0: 'Clear Sky',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Rime Fog',
      51: 'Light Drizzle',
      53: 'Drizzle',
      55: 'Dense Drizzle',
      56: 'Freezing Drizzle',
      57: 'Dense Freezing Drizzle',
      61: 'Light Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      66: 'Freezing Rain',
      67: 'Heavy Freezing Rain',
      71: 'Light Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Rain Showers',
      81: 'Moderate Showers',
      82: 'Heavy Showers',
      85: 'Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Hail',
      99: 'Thunderstorm with Heavy Hail'
    }
  }
})

function formatTemperature(value) {
  const temperature = Number(value)

  if (!Number.isFinite(temperature)) {
    return '--'
  }

  const converted = props.temperatureUnit === 'fahrenheit'
    ? (temperature * 9 / 5) + 32
    : temperature

  const unit = props.temperatureUnit === 'fahrenheit' ? '°F' : '°C'

  return `${Math.round(converted)}${unit}`
}

function formatDay(date, index) {
  if (index === 0) {
    return t.value.today
  }

  return new Date(date + 'T12:00:00').toLocaleDateString(
    locale.value,
    { weekday: 'long' }
  )
}

function formatDate(date) {
  return new Date(date + 'T12:00:00').toLocaleDateString(
    locale.value,
    { day: '2-digit', month: 'short' }
  )
}

function getWeatherCondition(code) {
  return t.value.conditions[code] || (
    props.language === 'el' ? 'Άγνωστες συνθήκες' : 'Unknown'
  )
}
</script>

<style scoped>
.forecast-card {
  background: #ffffff;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
}

.forecast-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}

.forecast-header h2 {
  font-size: 17px;
  color: #183b2b;
  margin: 0;
}

.forecast-header p {
  font-size: 12px;
  color: #84918a;
  margin-top: 6px;
}

.forecast-status {
  font-size: 11px;
  color: #36734f;
  background: #eaf3ed;
  padding: 6px 10px;
  border-radius: 20px;
}

.forecast-list {
  display: flex;
  flex-direction: column;
}

.forecast-day {
  display: grid;
  grid-template-columns: 1.1fr 1.5fr 0.8fr 0.6fr;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #e5e9e6;
}

.day-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.day-info strong {
  font-size: 13px;
  color: #263b2e;
}

.day-info span,
.day-condition,
.day-rain span {
  font-size: 11px;
  color: #84918a;
}

.day-temperatures {
  display: flex;
  align-items: center;
  gap: 12px;
}

.day-temperatures strong {
  font-size: 15px;
  color: #183b2b;
}

.day-temperatures span {
  font-size: 13px;
  color: #84918a;
}

.day-rain {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.day-rain strong {
  font-size: 13px;
  color: #36734f;
}

@media (max-width: 550px) {
  .forecast-card {
    padding: 18px;
  }

  .forecast-day {
    grid-template-columns: 1fr 1.2fr 0.7fr 0.5fr;
    gap: 6px;
  }

  .day-condition {
    font-size: 10px;
  }

  .day-temperatures {
    gap: 6px;
  }
}
</style>
