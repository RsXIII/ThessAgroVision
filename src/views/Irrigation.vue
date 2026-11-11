
<template>
  <section class="irrigation-page">

    <div class="page-header">
      <div>
        <h1>{{ t('irrigationTitle') }}</h1>
        <p>{{ t('irrigationSubtitle') }}</p>
      </div>

      <button class="primary-btn" @click="openForm()">
        + {{ t('scheduleIrrigation') }}
      </button>
    </div>

    <!-- Statistics -->

    <div class="stats-grid">
      <div class="stat-card">
        <span>{{ t('totalIrrigations') }}</span>
        <strong>{{ irrigations.length }}</strong>
      </div>

      <div class="stat-card">
        <span>{{ t('scheduled') }}</span>
        <strong>{{ scheduledCount }}</strong>
      </div>

      <div class="stat-card">
        <span>{{ t('completed') }}</span>
        <strong>{{ completedCount }}</strong>
      </div>

      <div class="stat-card">
        <span>{{ t('totalWaterUsed') }}</span>
        <strong>{{ totalWater.toLocaleString() }} L</strong>
      </div>
    </div>

    <!-- Irrigation Form -->

    <div v-if="showForm" class="irrigation-form card">

      <div class="form-header">
        <h2>
          {{ editingId ? t('editIrrigation') : t('scheduleNewIrrigation') }}
        </h2>
        <button class="close-btn" @click="closeForm">✕</button>
      </div>

      <form @submit.prevent="handleSubmit">

        <div class="form-grid">

          <div class="form-group">
            <label>{{ t('field') }}</label>
            <select v-model="form.fieldId" required>
              <option value="" disabled>{{ t('selectField') }}</option>
              <option
                v-for="field in fields"
                :key="field.id"
                :value="field.id"
              >
                {{ field.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ t('crop') }}</label>
            <select
              v-model="form.cropId"
              required
              :disabled="!form.fieldId || availableCrops.length === 0"
            >
              <option value="" disabled>{{ t('selectCrop') }}</option>
              <option
                v-for="crop in availableCrops"
                :key="crop.id"
                :value="crop.id"
              >
                {{ crop.name }}
              </option>
            </select>

            <small v-if="form.fieldId && availableCrops.length === 0">
              {{ t('noCropsForField') }}
            </small>
          </div>

          <div class="form-group">
            <label>{{ t('date') }}</label>
            <input
              type="date"
              v-model="form.date"
              required
            />
          </div>

          <div class="form-group">
            <label>{{ t('time') }}</label>
            <input
              type="time"
              v-model="form.time"
              required
            />
          </div>

          <div class="form-group">
            <label>{{ t('waterAmount') }}</label>
            <input
              type="number"
              v-model.number="form.waterAmount"
              min="1"
              step="1"
              placeholder="e.g. 500"
              required
            />
          </div>

          <div class="form-group">
            <label>{{ t('status') }}</label>
            <select v-model="form.status">
              <option value="Scheduled">{{ t('scheduled') }}</option>
              <option value="Completed">{{ t('completed') }}</option>
              <option value="Cancelled">{{ t('cancelled') }}</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label>{{ t('notes') }}</label>
            <textarea
              v-model="form.notes"
              :placeholder="t('irrigationNotesPlaceholder')"
              rows="3"
            ></textarea>
          </div>

        </div>

        <div class="form-actions">
          <button type="button" class="secondary-btn" @click="closeForm">
            {{ t('cancel') }}
          </button>

          <button type="submit" class="primary-btn">
            {{ editingId ? t('updateIrrigation') : t('saveIrrigation') }}
          </button>
        </div>

      </form>
    </div>

    <!-- Irrigation History -->

    <div class="history-section card">

      <div class="history-header">
        <div>
          <h2>{{ t('irrigationHistory') }}</h2>
          <p>{{ t('irrigationHistorySubtitle') }}</p>
        </div>

        <select v-model="statusFilter" class="filter-select">
          <option value="All">{{ t('allStatuses') }}</option>
          <option value="Scheduled">{{ t('scheduled') }}</option>
          <option value="Completed">{{ t('completed') }}</option>
          <option value="Cancelled">{{ t('cancelled') }}</option>
        </select>
      </div>

      <div v-if="filteredIrrigations.length === 0" class="empty-state">
        <h3>{{ t('noIrrigationRecords') }}</h3>
        <p>{{ t('scheduleFirstIrrigation') }}</p>
      </div>

      <div v-else class="table-wrapper">

        <table>
          <thead>
            <tr>
              <th>{{ t('field') }}</th>
              <th>{{ t('crop') }}</th>
              <th>{{ t('date') }}</th>
              <th>{{ t('time') }}</th>
              <th>{{ t('waterAmount') }}</th>
              <th>{{ t('status') }}</th>
              <th>{{ t('actions') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="irrigation in filteredIrrigations"
              :key="irrigation.id"
            >
              <td>{{ getFieldName(irrigation.fieldId) }}</td>
              <td>{{ getCropName(irrigation.cropId) }}</td>
              <td>{{ irrigation.date }}</td>
              <td>{{ irrigation.time }}</td>
              <td>{{ irrigation.waterAmount.toLocaleString() }} L</td>

              <td>
                <span
                  class="status-badge"
                  :class="irrigation.status.toLowerCase()"
                >
                  {{ t(
                    irrigation.status === 'Scheduled'
                      ? 'scheduled'
                      : irrigation.status === 'Completed'
                        ? 'completed'
                        : 'cancelled'
                  ) }}
                </span>
              </td>

              <td class="actions">
                <button
                  class="edit-btn"
                  @click="openForm(irrigation)"
                >
                  {{ t('edit') }}
                </button>

                <button
                  class="delete-btn"
                  @click="removeIrrigation(irrigation.id)"
                >
                  {{ t('delete') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

  </section>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { t } from '../services/languageService'
import { getFields } from '../services/fieldService'
import { getCrops } from '../services/cropService'

import {
  getIrrigations,
  saveIrrigation,
  updateIrrigation,
  deleteIrrigation
} from '../services/irrigationService'

// Data

const fields = ref([])
const crops = ref([])
const irrigations = ref([])

const showForm = ref(false)
const editingId = ref(null)
const statusFilter = ref('All')

// Local date

function getToday() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Form

const emptyForm = () => ({
  fieldId: '',
  cropId: '',
  date: getToday(),
  time: '08:00',
  waterAmount: '',
  status: 'Scheduled',
  notes: ''
})

const form = ref(emptyForm())

// Load data

function loadData() {
  fields.value = getFields()
  crops.value = getCrops()
  irrigations.value = getIrrigations()
}

// Available crops for selected field

const availableCrops = computed(() => {
  if (!form.value.fieldId) return []

  return crops.value.filter(
    crop => crop.fieldId === form.value.fieldId
  )
})

// Statistics

const scheduledCount = computed(() =>
  irrigations.value.filter(
    item => item.status === 'Scheduled'
  ).length
)

const completedCount = computed(() =>
  irrigations.value.filter(
    item => item.status === 'Completed'
  ).length
)

const totalWater = computed(() =>
  irrigations.value
    .filter(item => item.status === 'Completed')
    .reduce((total, item) => total + Number(item.waterAmount || 0), 0)
)

// Filter

const filteredIrrigations = computed(() => {
  return [...irrigations.value]
    .filter(item =>
      statusFilter.value === 'All' ||
      item.status === statusFilter.value
    )
    .sort((a, b) => {
      const dateA = `${a.date}T${a.time}`
      const dateB = `${b.date}T${b.time}`

      return dateB.localeCompare(dateA)
    })
})

// Names

function getFieldName(fieldId) {
  const field = fields.value.find(
    item => item.id === fieldId
  )

  return field ? field.name : 'Unknown Field'
}

function getCropName(cropId) {
  const crop = crops.value.find(
    item => item.id === cropId
  )

  return crop ? crop.name : 'Unknown Crop'
}

// Open form

function openForm(irrigation = null) {
  if (fields.value.length === 0) {
    alert('Please create a field first.')
    return
  }

  if (crops.value.length === 0) {
    alert('Please register a crop first.')
    return
  }

  if (irrigation) {
    editingId.value = irrigation.id

    form.value = {
      fieldId: irrigation.fieldId,
      cropId: irrigation.cropId,
      date: irrigation.date,
      time: irrigation.time,
      waterAmount: irrigation.waterAmount,
      status: irrigation.status,
      notes: irrigation.notes || ''
    }
  } else {
    editingId.value = null
    form.value = emptyForm()
  }

  showForm.value = true
}

// Close form

function closeForm() {
  showForm.value = false
  editingId.value = null
  form.value = emptyForm()
}

// Save / Update

function handleSubmit() {
  const validCrop = crops.value.find(
    crop =>
      crop.id === form.value.cropId &&
      crop.fieldId === form.value.fieldId
  )

  if (!validCrop) {
    alert('Please select a valid crop for this field.')
    return
  }

  if (!Number.isFinite(Number(form.value.waterAmount)) ||
      Number(form.value.waterAmount) <= 0) {
    alert('Please enter a valid water amount.')
    return
  }

  const data = {
    ...form.value,
    waterAmount: Number(form.value.waterAmount)
  }

  if (editingId.value) {
    updateIrrigation(editingId.value, data)
  } else {
    saveIrrigation(data)
  }

  loadData()
  closeForm()
}

// Delete

function removeIrrigation(id) {
  const confirmed = confirm(
    'Are you sure you want to delete this irrigation record?'
  )

  if (!confirmed) return

  deleteIrrigation(id)
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.irrigation-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--text-color, #1f2937);
}

.page-header,
.history-header,
.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 26px;
}

.page-header p,
.history-header p {
  margin: 0;
  color: #888;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.stat-card,
.card {
  background: var(--card-background, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  padding: 22px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-card span {
  color: #888;
  font-size: 14px;
}

.stat-card strong {
  font-size: 26px;
  color: #16a36a;
}

.primary-btn,
.secondary-btn,
.edit-btn,
.delete-btn {
  border: none;
  border-radius: 7px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.primary-btn {
  background: #16a36a;
  color: white;
}

.primary-btn:hover {
  background: #128653;
}

.secondary-btn {
  background: #e5e7eb;
  color: #333;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.form-header {
  margin-bottom: 24px;
}

.form-header h2,
.history-header h2 {
  margin: 0 0 6px;
  font-size: 19px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea,
.filter-select {
  width: 100%;
  padding: 11px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 7px;
  background: var(--input-background, #fff);
  color: inherit;
  font: inherit;
  box-sizing: border-box;
}

.form-group small {
  color: #d97706;
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.history-header {
  margin-bottom: 24px;
}

.filter-select {
  max-width: 180px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid var(--border-color, #eee);
  font-size: 14px;
}

th {
  color: #888;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.scheduled {
  background: #fff3cd;
  color: #9a6700;
}

.status-badge.completed {
  background: #d1fae5;
  color: #047857;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #b91c1c;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn {
  background: #e0edff;
  color: #2563eb;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .page-header,
  .history-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
