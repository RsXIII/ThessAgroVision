
<template>
  <section class="analytics-page">
    <div class="page-heading">
      <div>
        <h1>{{ t('title') }}</h1>
        <p>{{ t('subtitle') }}</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">{{ t('totalFields') }}</span>
        <strong>{{ totalFields }}</strong>
        <span class="stat-description">
          {{ formatArea(totalCultivatedArea) }} {{ t('inTotal') }}
        </span>
      </div>

      <div class="stat-card">
        <span class="stat-label">{{ t('totalCrops') }}</span>
        <strong>{{ crops.length }}</strong>
        <span class="stat-description">{{ t('registeredCrops') }}</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">{{ t('activeCrops') }}</span>
        <strong>{{ activeCrops }}</strong>
        <span class="stat-description">{{ t('growingOrReady') }}</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">{{ t('waterConsumption') }}</span>
        <strong>{{ totalWaterConsumption.toLocaleString() }} L</strong>
        <span class="stat-description">{{ t('completedIrrigations') }}</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">{{ t('completedIrrigations') }}</span>
        <strong>{{ completedIrrigations }}</strong>
        <span class="stat-description">{{ t('successfullyCompleted') }}</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">{{ t('scheduledIrrigations') }}</span>
        <strong>{{ scheduledIrrigations }}</strong>
        <span class="stat-description">{{ t('waitingCompletion') }}</span>
      </div>
    </div>

    <div class="analytics-grid">
      <div class="analytics-card">
        <div class="card-heading">
          <h2>{{ t('cropStatus') }}</h2>
          <span>{{ t('distribution') }}</span>
        </div>

        <div v-if="crops.length" class="distribution-list">
          <div
            v-for="item in cropStatusDistribution"
            :key="item.status"
            class="distribution-item"
          >
            <div class="distribution-info">
              <span>{{ translateStatus(item.status) }}</span>
              <strong>{{ item.count }}</strong>
            </div>

            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <p v-else class="empty-message">
          {{ t('noCropData') }}
        </p>
      </div>

      <div class="analytics-card">
        <div class="card-heading">
          <h2>{{ t('irrigationStatus') }}</h2>
          <span>{{ t('overview') }}</span>
        </div>

        <div v-if="irrigations.length" class="distribution-list">
          <div
            v-for="item in irrigationStatusDistribution"
            :key="item.status"
            class="distribution-item"
          >
            <div class="distribution-info">
              <span>{{ translateStatus(item.status) }}</span>
              <strong>{{ item.count }}</strong>
            </div>

            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <p v-else class="empty-message">
          {{ t('noIrrigationData') }}
        </p>
      </div>
    </div>

    <div class="analytics-card field-analytics">
      <div class="card-heading">
        <h2>{{ t('fieldPerformance') }}</h2>
        <span>{{ t('overviewPerField') }}</span>
      </div>

      <div v-if="fields.length" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ t('field') }}</th>
              <th>{{ t('area') }}</th>
              <th>{{ t('crops') }}</th>
              <th>{{ t('irrigations') }}</th>
              <th>{{ t('waterUsed') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="field in fieldPerformance" :key="field.id">
              <td>{{ field.name }}</td>
              <td>{{ formatArea(field.area) }}</td>
              <td>{{ field.cropCount }}</td>
              <td>{{ field.irrigationCount }}</td>
              <td>{{ field.waterUsed.toLocaleString() }} L</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="empty-message">
        {{ t('addField') }}
      </p>
    </div>

    <div class="analytics-card water-analytics">
      <div class="card-heading">
        <h2>{{ t('waterUsageTrends') }}</h2>
        <span>{{ t('lastSixMonths') }}</span>
      </div>

      <div v-if="totalWaterConsumption > 0" class="water-chart">
        <div
          v-for="month in monthlyWaterUsage"
          :key="month.key"
          class="chart-column"
        >
          <strong>{{ month.amount.toLocaleString() }} L</strong>

          <div class="chart-bar-container">
            <div
              class="chart-bar"
              :style="{ height: month.percentage + '%' }"
            ></div>
          </div>

          <span>{{ month.label }}</span>
        </div>
      </div>

      <p v-else class="empty-message">
        {{ t('completeIrrigation') }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import { getFields } from '../services/fieldService'
import { getCrops } from '../services/cropService'
import { getIrrigations } from '../services/irrigationService'
import {
  getSettings,
  formatArea as serviceFormatArea
} from '../services/settingsService'

const fields = ref([])
const crops = ref([])
const irrigations = ref([])

const settings = ref(getSettings())

const translations = {
  en: {
    title: 'Analytics & Reports',
    subtitle: 'Insights and performance overview of your farm',
    totalFields: 'Total Fields',
    totalCrops: 'Total Crops',
    activeCrops: 'Active Crops',
    waterConsumption: 'Water Consumption',
    completedIrrigations: 'Completed Irrigations',
    scheduledIrrigations: 'Scheduled Irrigations',
    inTotal: 'in total',
    registeredCrops: 'Registered crops',
    growingOrReady: 'Growing or ready for harvest',
    successfullyCompleted: 'Successfully completed',
    waitingCompletion: 'Waiting to be completed',
    cropStatus: 'Crop Status',
    irrigationStatus: 'Irrigation Status',
    distribution: 'Distribution',
    overview: 'Overview',
    noCropData: 'No crop data available yet.',
    noIrrigationData: 'No irrigation data available yet.',
    fieldPerformance: 'Field Performance',
    overviewPerField: 'Overview per field',
    field: 'Field',
    area: 'Area',
    crops: 'Crops',
    irrigations: 'Irrigations',
    waterUsed: 'Water Used',
    addField: 'Add a field to see its performance.',
    waterUsageTrends: 'Water Usage Trends',
    lastSixMonths: 'Last 6 months',
    completeIrrigation: 'Complete an irrigation to see water usage trends.',
    planned: 'Planned',
    growing: 'Growing',
    readyForHarvest: 'Ready for Harvest',
    harvested: 'Harvested',
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    hectares: 'ha',
    acres: 'acres'
  },

  el: {
    title: 'Αναλύσεις & Αναφορές',
    subtitle: 'Στατιστικά και επισκόπηση της απόδοσης της αγροτικής εκμετάλλευσης',
    totalFields: 'Συνολικά Αγροτεμάχια',
    totalCrops: 'Συνολικές Καλλιέργειες',
    activeCrops: 'Ενεργές Καλλιέργειες',
    waterConsumption: 'Κατανάλωση Νερού',
    completedIrrigations: 'Ολοκληρωμένες Αρδεύσεις',
    scheduledIrrigations: 'Προγραμματισμένες Αρδεύσεις',
    inTotal: 'συνολικά',
    registeredCrops: 'Καταχωρημένες καλλιέργειες',
    growingOrReady: 'Σε ανάπτυξη ή έτοιμες για συγκομιδή',
    successfullyCompleted: 'Ολοκληρώθηκαν επιτυχώς',
    waitingCompletion: 'Αναμένουν ολοκλήρωση',
    cropStatus: 'Κατάσταση Καλλιεργειών',
    irrigationStatus: 'Κατάσταση Αρδεύσεων',
    distribution: 'Κατανομή',
    overview: 'Επισκόπηση',
    noCropData: 'Δεν υπάρχουν ακόμη δεδομένα καλλιεργειών.',
    noIrrigationData: 'Δεν υπάρχουν ακόμη δεδομένα αρδεύσεων.',
    fieldPerformance: 'Απόδοση Αγροτεμαχίων',
    overviewPerField: 'Επισκόπηση ανά αγροτεμάχιο',
    field: 'Αγροτεμάχιο',
    area: 'Έκταση',
    crops: 'Καλλιέργειες',
    irrigations: 'Αρδεύσεις',
    waterUsed: 'Νερό που χρησιμοποιήθηκε',
    addField: 'Προσθέστε ένα αγροτεμάχιο για να δείτε την απόδοσή του.',
    waterUsageTrends: 'Τάσεις Κατανάλωσης Νερού',
    lastSixMonths: 'Τελευταίοι 6 μήνες',
    completeIrrigation: 'Ολοκληρώστε μια άρδευση για να δείτε τις τάσεις κατανάλωσης νερού.',
    planned: 'Προγραμματισμένη',
    growing: 'Σε ανάπτυξη',
    readyForHarvest: 'Έτοιμη για συγκομιδή',
    harvested: 'Συγκομισμένη',
    scheduled: 'Προγραμματισμένη',
    completed: 'Ολοκληρωμένη',
    cancelled: 'Ακυρωμένη',
    hectares: 'εκτάρια (ha)',
    acres: 'acres'
  }
}

const currentLanguage = computed(() =>
  settings.value.language === 'el' ? 'el' : 'en'
)

const locale = computed(() =>
  currentLanguage.value === 'el' ? 'el-GR' : 'en-US'
)

function t(key) {
  return translations[currentLanguage.value][key] || key
}

function translateStatus(status) {
  const statusKeys = {
    'Planned': 'planned',
    'Growing': 'growing',
    'Ready for Harvest': 'readyForHarvest',
    'Harvested': 'harvested',
    'Scheduled': 'scheduled',
    'Completed': 'completed',
    'Cancelled': 'cancelled'
  }

  const key = statusKeys[status]

  return key ? t(key) : status
}

function formatArea(area) {
  const formatted = serviceFormatArea(area)

  if (currentLanguage.value === 'en') {
    return formatted
  }

  return formatted
    .replace(/\s+ha$/, ` ${t('hectares')}`)
    .replace(/\s+acres$/, ` ${t('acres')}`)
}

function loadAnalyticsData() {
  fields.value = getFields()
  crops.value = getCrops()
  irrigations.value = getIrrigations()
}

function refreshSettings() {
  settings.value = getSettings()
}

function handleStorageChange(event) {
  if (!event.key || event.key === 'agrovision_settings') {
    refreshSettings()
  }

  if (
    !event.key ||
    event.key === 'agrovision_fields' ||
    event.key === 'agrovision_crops' ||
    event.key === 'agrovision_irrigations'
  ) {
    loadAnalyticsData()
  }
}

const totalFields = computed(() => fields.value.length)

const totalCultivatedArea = computed(() =>
  fields.value.reduce(
    (total, field) => total + Number(field.area || 0),
    0
  )
)

const activeCrops = computed(() =>
  crops.value.filter(crop =>
    ['Growing', 'Ready for Harvest'].includes(crop.status)
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

const completedIrrigations = computed(() =>
  irrigations.value.filter(
    item => item.status === 'Completed'
  ).length
)

const scheduledIrrigations = computed(() =>
  irrigations.value.filter(
    item => item.status === 'Scheduled'
  ).length
)

const cropStatuses = [
  'Planned',
  'Growing',
  'Ready for Harvest',
  'Harvested'
]

const cropStatusDistribution = computed(() =>
  cropStatuses.map(status => {
    const count = crops.value.filter(
      crop => crop.status === status
    ).length

    return {
      status,
      count,
      percentage: crops.value.length
        ? (count / crops.value.length) * 100
        : 0
    }
  })
)

const irrigationStatuses = [
  'Scheduled',
  'Completed',
  'Cancelled'
]

const irrigationStatusDistribution = computed(() =>
  irrigationStatuses.map(status => {
    const count = irrigations.value.filter(
      item => item.status === status
    ).length

    return {
      status,
      count,
      percentage: irrigations.value.length
        ? (count / irrigations.value.length) * 100
        : 0
    }
  })
)

const fieldPerformance = computed(() =>
  fields.value.map(field => {
    const fieldCrops = crops.value.filter(
      crop => crop.fieldId === field.id
    )

    const fieldIrrigations = irrigations.value.filter(
      item => item.fieldId === field.id
    )

    const completedWater = fieldIrrigations
      .filter(item => item.status === 'Completed')
      .reduce(
        (total, item) => total + Number(item.waterAmount || 0),
        0
      )

    return {
      id: field.id,
      name: field.name,
      area: Number(field.area || 0),
      cropCount: fieldCrops.length,
      irrigationCount: fieldIrrigations.length,
      waterUsed: completedWater
    }
  })
)

const monthlyWaterUsage = computed(() => {
  const now = new Date()
  const months = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    )

    const year = date.getFullYear()
    const month = date.getMonth()

    const amount = irrigations.value
      .filter(item => {
        if (item.status !== 'Completed' || !item.date) {
          return false
        }

        const irrigationDate = new Date(
          `${item.date}T12:00:00`
        )

        return (
          irrigationDate.getFullYear() === year &&
          irrigationDate.getMonth() === month
        )
      })
      .reduce(
        (total, item) => total + Number(item.waterAmount || 0),
        0
      )

    months.push({
      key: `${year}-${month}`,
      label: date.toLocaleDateString(locale.value, {
        month: 'short'
      }),
      amount
    })
  }

  const maximum = Math.max(
    ...months.map(month => month.amount),
    1
  )

  return months.map(month => ({
    ...month,
    percentage: month.amount
      ? Math.max((month.amount / maximum) * 100, 4)
      : 0
  }))
})

onMounted(() => {
  loadAnalyticsData()
  refreshSettings()

  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('focus', refreshSettings)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('focus', refreshSettings)
})
</script>

<style scoped>
.analytics-page {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card,
.analytics-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e8e8e8);
  border-radius: 12px;
  padding: 20px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-label {
  color: #858b94;
  font-size: 13px;
}

.stat-card strong {
  font-size: 26px;
  font-weight: 700;
}

.stat-description {
  color: #9298a1;
  font-size: 12px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.card-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.card-heading h2 {
  margin: 0;
  font-size: 17px;
}

.card-heading span {
  color: #9298a1;
  font-size: 12px;
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distribution-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 9px;
  font-size: 13px;
}

.distribution-info strong {
  font-weight: 600;
}

.progress-track {
  height: 8px;
  overflow: hidden;
  background: #edf0ed;
  border-radius: 20px;
}

.progress-fill {
  height: 100%;
  background: #4d9b70;
  border-radius: 20px;
  transition: width 0.3s ease;
}

.empty-message {
  color: #9298a1;
  font-size: 13px;
  padding: 12px 0;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid var(--border-color, #eeeeee);
  font-size: 13px;
  white-space: nowrap;
}

th {
  color: #858b94;
  font-weight: 600;
}

td {
  color: var(--text-color, #333333);
}

.water-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 16px;
  min-height: 210px;
  padding-top: 12px;
}

.chart-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  height: 200px;
}

.chart-column strong {
  font-size: 11px;
  color: #858b94;
}

.chart-bar-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 125px;
  background: #f0f3f0;
  border-radius: 7px;
  overflow: hidden;
}

.chart-bar {
  width: 55%;
  min-height: 0;
  background: #4d9b70;
  border-radius: 7px 7px 0 0;
  transition: height 0.3s ease;
}

.chart-column > span {
  color: #858b94;
  font-size: 12px;
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-card strong {
    font-size: 21px;
  }
}
</style>
