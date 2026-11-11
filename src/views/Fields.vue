

<template>
  <div class="fields-page">
    <div class="page-heading">
      <div>
        <h2>{{ tr('heading') }}</h2>
        <p>{{ tr('subtitle') }}</p>
      </div>

      <span class="field-count">
        {{ fields.length }} {{ tr('fieldsCount') }}
      </span>
    </div>

    <div class="fields-layout">
      <!-- Field Form -->
      <section class="form-card">
        <h3>
          {{ editingId ? tr('editField') : tr('addField') }}
        </h3>

        <form @submit.prevent="handleSave">
          <div class="form-group">
            <label>{{ tr('fieldName') }} *</label>
            <input
              v-model="form.name"
              type="text"
              :placeholder="tr('fieldNamePlaceholder')"
              required
            />
          </div>

          <div class="form-group">
            <label>{{ tr('cropType') }}</label>
            <input
              v-model="form.crop"
              type="text"
              :placeholder="tr('cropPlaceholder')"
            />
          </div>

          <div class="form-group">
            <label>{{ tr('area') }} *</label>
            <input
              v-model.number="form.area"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="5.5"
              required
            />
          </div>

          <div class="coordinates-heading">
            <h4>{{ tr('coordinates') }}</h4>
          </div>

          <div class="map-section">
            <div class="map-toolbar">
              <span>{{ tr('selectLocation') }}</span>

              <div class="map-switch">
                <button
                  type="button"
                  :class="{ active: mapLayer === 'osm' }"
                  @click="mapLayer = 'osm'"
                >
                  {{ tr('streetMap') }}
                </button>

                <button
                  type="button"
                  :class="{ active: mapLayer === 'satellite' }"
                  @click="mapLayer = 'satellite'"
                >
                  {{ tr('satellite') }}
                </button>
              </div>
            </div>

            <p class="map-instruction">
              {{ tr('mapInstruction') }}
            </p>

            <div class="map-container">
              <l-map
                v-model:zoom="mapZoom"
                :center="mapCenter"
                :use-global-leaflet="false"
                @click="handleMapClick"
              >
                <l-tile-layer
                  :url="tileUrl"
                  :attribution="tileAttribution"
                  layer-type="base"
                  name="Base Layer"
                />

                <l-marker
                  v-if="markerPosition"
                  :lat-lng="markerPosition"
                />
              </l-map>
            </div>
          </div>

          <div class="coordinates-grid">
            <div class="form-group">
              <label>{{ tr('latitude') }} *</label>
              <input
                v-model="form.latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                placeholder="40.6401"
                required
              />
            </div>

            <div class="form-group">
              <label>{{ tr('longitude') }} *</label>
              <input
                v-model="form.longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                placeholder="22.9444"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>{{ tr('description') }}</label>
            <textarea
              v-model="form.description"
              :placeholder="tr('descriptionPlaceholder')"
              rows="3"
            ></textarea>
          </div>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <div class="form-actions">
            <button type="submit" class="primary-button">
              {{ editingId ? tr('updateField') : tr('saveField') }}
            </button>

            <button
              v-if="editingId"
              type="button"
              class="secondary-button"
              @click="resetForm"
            >
              {{ tr('cancel') }}
            </button>
          </div>
        </form>
      </section>

      <!-- Fields List -->
      <section class="fields-list">
        <div class="list-heading">
          <h3>{{ tr('yourFields') }}</h3>
          <span>{{ fields.length }} {{ tr('registered') }}</span>
        </div>

        <div v-if="fields.length === 0" class="empty-state">
          <h4>{{ tr('noFields') }}</h4>
          <p>{{ tr('addFirstField') }}</p>
        </div>

        <div
          v-for="field in fields"
          :key="field.id"
          class="field-card"
          :class="{ selected: selectedFieldId === field.id }"
        >
          <div class="field-card-header">
            <div>
              <h4>{{ field.name }}</h4>
              <span class="crop-label">
                {{ field.crop || tr('noCrop') }}
              </span>
            </div>

            <span
              v-if="selectedFieldId === field.id"
              class="active-label"
            >
              {{ tr('active') }}
            </span>
          </div>

          <div class="field-details">
            <div>
              <span>{{ tr('areaLabel') }}</span>
              <strong>{{ formatArea(field.area) }}</strong>
            </div>

            <div>
              <span>{{ tr('latitude') }}</span>
              <strong>{{ field.latitude }}</strong>
            </div>

            <div>
              <span>{{ tr('longitude') }}</span>
              <strong>{{ field.longitude }}</strong>
            </div>
          </div>

          <p v-if="field.description" class="field-description">
            {{ field.description }}
          </p>

          <div class="field-actions">
            <button
              type="button"
              class="select-button"
              :disabled="selectedFieldId === field.id"
              @click="selectField(field.id)"
            >
              {{
                selectedFieldId === field.id
                  ? tr('selected')
                  : tr('selectField')
              }}
            </button>

            <button
              type="button"
              class="edit-button"
              @click="editField(field)"
            >
              {{ tr('edit') }}
            </button>

            <button
              type="button"
              class="delete-button"
              @click="removeField(field.id)"
            >
              {{ tr('delete') }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { currentLanguage } from '../services/languageService'
import { formatArea } from '../services/settingsService'

import {
  LMap,
  LTileLayer,
  LMarker
} from '@vue-leaflet/vue-leaflet'

import {
  getFields,
  saveField,
  deleteField,
  getSelectedFieldId,
  setSelectedFieldId
} from '../services/fieldService'
const fieldTranslations = {
  en: {
    heading: 'Fields Management',
    subtitle: 'Manage and monitor your agricultural fields.',
    fieldsCount: 'Fields',
    editField: 'Edit Field',
    addField: 'Add New Field',
    fieldName: 'Field Name',
    fieldNamePlaceholder: 'e.g. North Field',
    cropType: 'Crop Type',
    cropPlaceholder: 'e.g. Wheat, Corn, Olive',
    area: 'Area (hectares)',
    coordinates: 'Geographic Coordinates',
    selectLocation: 'Select Field Location',
    streetMap: 'Street Map',
    satellite: 'Satellite',
    mapInstruction: 'Click anywhere on the map to select your field location.',
    latitude: 'Latitude',
    longitude: 'Longitude',
    description: 'Description',
    descriptionPlaceholder: 'Additional information about this field...',
    updateField: 'Update Field',
    saveField: 'Save Field',
    cancel: 'Cancel',
    yourFields: 'Your Agricultural Fields',
    registered: 'registered',
    noFields: 'No fields registered yet',
    addFirstField: 'Add your first agricultural field using the form.',
    noCrop: 'No crop specified',
    active: 'Active',
    areaLabel: 'Area',
    selected: 'Selected',
    selectField: 'Select Field',
    edit: 'Edit',
    delete: 'Delete',
    fieldNameRequired: 'Field name is required.',
    areaInvalid: 'Area must be greater than zero.',
    deleteConfirm: 'Are you sure you want to delete this field?'
  },

  el: {
    heading: 'Διαχείριση Αγροτεμαχίων',
    subtitle: 'Διαχειριστείτε και παρακολουθήστε τα αγροτεμάχιά σας.',
    fieldsCount: 'Αγροτεμάχια',
    editField: 'Επεξεργασία Αγροτεμαχίου',
    addField: 'Προσθήκη Νέου Αγροτεμαχίου',
    fieldName: 'Όνομα Αγροτεμαχίου',
    fieldNamePlaceholder: 'π.χ. Βόρειο Αγροτεμάχιο',
    cropType: 'Τύπος Καλλιέργειας',
    cropPlaceholder: 'π.χ. Σιτάρι, Καλαμπόκι, Ελιά',
    area: 'Έκταση (εκτάρια)',
    coordinates: 'Γεωγραφικές Συντεταγμένες',
    selectLocation: 'Επιλογή Τοποθεσίας Αγροτεμαχίου',
    streetMap: 'Οδικός Χάρτης',
    satellite: 'Δορυφόρος',
    mapInstruction: 'Κάντε κλικ στον χάρτη για να επιλέξετε την τοποθεσία του αγροτεμαχίου.',
    latitude: 'Γεωγραφικό Πλάτος',
    longitude: 'Γεωγραφικό Μήκος',
    description: 'Περιγραφή',
    descriptionPlaceholder: 'Πρόσθετες πληροφορίες για αυτό το αγροτεμάχιο...',
    updateField: 'Ενημέρωση Αγροτεμαχίου',
    saveField: 'Αποθήκευση Αγροτεμαχίου',
    cancel: 'Ακύρωση',
    yourFields: 'Τα Αγροτεμάχιά σας',
    registered: 'καταχωρημένα',
    noFields: 'Δεν υπάρχουν ακόμη καταχωρημένα αγροτεμάχια',
    addFirstField: 'Προσθέστε το πρώτο σας αγροτεμάχιο χρησιμοποιώντας τη φόρμα.',
    noCrop: 'Δεν έχει οριστεί καλλιέργεια',
    active: 'Ενεργό',
    areaLabel: 'Έκταση',
    selected: 'Επιλεγμένο',
    selectField: 'Επιλογή Αγροτεμαχίου',
    edit: 'Επεξεργασία',
    delete: 'Διαγραφή',
    fieldNameRequired: 'Το όνομα του αγροτεμαχίου είναι υποχρεωτικό.',
    areaInvalid: 'Η έκταση πρέπει να είναι μεγαλύτερη από μηδέν.',
    deleteConfirm: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το αγροτεμάχιο;'
  }
}

function tr(key) {
  return fieldTranslations[currentLanguage.value]?.[key]
    || fieldTranslations.en[key]
    || key
}
const fields = ref([])
const selectedFieldId = ref(null)
const editingId = ref(null)
const errorMessage = ref('')
// Map configuration
const mapCenter = ref([40.6401, 22.9444])
const mapZoom = ref(7)

const mapLayer = ref('osm')

// Map tile providers
const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

const tileUrl = computed(() => {
  return mapLayer.value === 'satellite'
    ? satelliteUrl
    : osmUrl
})

const tileAttribution = computed(() => {
  return mapLayer.value === 'satellite'
    ? 'Tiles © Esri'
    : '&copy; OpenStreetMap contributors'
})

// Marker position
const markerPosition = computed(() => {
  if (
    form.value.latitude === '' ||
    form.value.longitude === ''
  ) {
    return null
  }

  const lat = Number(form.value.latitude)
  const lng = Number(form.value.longitude)

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 || lat > 90 ||
    lng < -180 || lng > 180
  ) {
    return null
  }

  return [lat, lng]
})

// Handle map click
function handleMapClick(event) {
  const lat = event.latlng.lat
  const lng = event.latlng.lng

  form.value.latitude = lat.toFixed(6)
  form.value.longitude = lng.toFixed(6)

  mapCenter.value = [lat, lng]
  mapZoom.value = 13
}
const emptyForm = () => ({
  name: '',
  crop: '',
  area: '',
  latitude: '',
  longitude: '',
  description: ''
})

const form = ref(emptyForm())

function loadFields() {
  fields.value = getFields()
  selectedFieldId.value = getSelectedFieldId()

  if (!fields.value.some(field => field.id === selectedFieldId.value)) {
    selectedFieldId.value = null
  }
}

function resetForm() {
  form.value = emptyForm()
  editingId.value = null
  errorMessage.value = ''
}

function handleSave() {
  errorMessage.value = ''

  try {
    if (!form.value.name.trim()) {
      throw new Error('fieldNameRequired')
    }

    if (!Number.isFinite(Number(form.value.area)) || Number(form.value.area) <= 0) {
      throw new Error('areaInvalid')
    }

    saveField({
      ...form.value,
      id: editingId.value || undefined
    })

    loadFields()
    resetForm()

  } catch (error) {
   errorMessage.value = tr(error.message)
  }
}

function selectField(fieldId) {
  try {
    setSelectedFieldId(fieldId)
    selectedFieldId.value = fieldId
  } catch (error) {
    errorMessage.value = error.message
  }
}

function editField(field) {
  editingId.value = field.id

  form.value = {
    name: field.name,
    crop: field.crop || '',
    area: field.area,
    latitude: field.latitude,
    longitude: field.longitude,
    description: field.description || ''
  }

  // Center map on the selected field
  const lat = Number(field.latitude)
  const lng = Number(field.longitude)

  if (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  ) {
    mapCenter.value = [lat, lng]
    mapZoom.value = 13
  }

  errorMessage.value = ''
}
function removeField(fieldId) {
  const confirmed = window.confirm(tr('deleteConfirm'))

  if (!confirmed) return

  deleteField(fieldId)

  loadFields()

  if (editingId.value === fieldId) {
    resetForm()
  }
}

onMounted(() => {
  loadFields()
})
</script>

<style scoped>
.fields-page {
  padding: 30px;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.page-heading h2 {
  font-size: 22px;
  color: #183b2b;
  margin: 0 0 8px;
}

.page-heading p {
  font-size: 13px;
  color: #84918a;
  margin: 0;
}

.field-count {
  background: #eaf3ed;
  color: #36734f;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.fields-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.5fr);
  gap: 22px;
  align-items: start;
}

.form-card,
.field-card {
  background: white;
  border: 1px solid #e5e9e6;
  border-radius: 12px;
  padding: 24px;
}

.form-card h3,
.list-heading h3 {
  color: #183b2b;
  font-size: 17px;
  margin: 0 0 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 17px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #526258;
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dfe6e1;
  border-radius: 7px;
  padding: 11px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4d7954;
}

.form-group textarea {
  resize: vertical;
}

.coordinates-heading h4 {
  color: #263b2e;
  font-size: 13px;
  margin: 22px 0 14px;
}

.coordinates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-actions,
.field-actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 7px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
}

.primary-button,
.select-button {
  background: #36734f;
  color: white;
}

.primary-button:hover,
.select-button:hover {
  background: #285c3d;
}

.secondary-button,
.edit-button {
  background: #eaf0eb;
  color: #355b40;
}

.delete-button {
  background: #f9eeee;
  color: #b34b4b;
}

button:disabled {
  opacity: 0.65;
  cursor: default;
}

.error-message {
  color: #b34b4b;
  font-size: 12px;
  margin-bottom: 12px;
}

.list-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-heading h3 {
  margin-bottom: 18px;
}

.list-heading span {
  color: #84918a;
  font-size: 12px;
}

.field-card {
  margin-bottom: 14px;
}

.field-card.selected {
  border-color: #4d7954;
}

.field-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.field-card-header h4 {
  color: #183b2b;
  font-size: 16px;
  margin: 0 0 7px;
}

.crop-label {
  color: #84918a;
  font-size: 12px;
}

.active-label {
  background: #eaf3ed;
  color: #36734f;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 10px;
  font-weight: 600;
}

.field-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 18px 0;
  margin-top: 15px;
  border-top: 1px solid #e5e9e6;
}

.field-details div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-details span {
  font-size: 10px;
  color: #84918a;
}

.field-details strong {
  font-size: 12px;
  color: #263b2e;
  overflow-wrap: anywhere;
}

.field-description {
  font-size: 12px;
  color: #84918a;
  line-height: 1.5;
  margin-bottom: 15px;
}

.empty-state {
  background: white;
  border: 1px dashed #dfe6e1;
  border-radius: 12px;
  padding: 35px 20px;
  text-align: center;
}

.empty-state h4 {
  color: #355b40;
  margin: 0 0 8px;
}

.empty-state p {
  color: #84918a;
  font-size: 12px;
  margin: 0;
}

/* Map Section */
.map-section {
  margin-bottom: 20px;
}

.map-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.map-toolbar > span {
  font-size: 12px;
  font-weight: 600;
  color: #526258;
}

.map-switch {
  display: flex;
  gap: 5px;
  background: #eaf0eb;
  padding: 4px;
  border-radius: 8px;
}

.map-switch button {
  background: transparent;
  color: #526258;
  padding: 8px 12px;
  font-size: 11px;
}

.map-switch button.active {
  background: #36734f;
  color: white;
}

.map-instruction {
  font-size: 11px;
  color: #84918a;
  margin: 0 0 10px;
}

.map-container {
  width: 100%;
  height: 350px;
  border: 1px solid #dfe6e1;
  border-radius: 9px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

@media (max-width: 900px) {
  .fields-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 550px) {
  .fields-page {
    padding: 18px;
  }

  .coordinates-grid {
    grid-template-columns: 1fr;
  }

  .field-details {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
