
<template>
  <section class="crops-page">
    
<div class="page-header">
  <div>
    <h1>{{ tr('title') }}</h1>
    <p>{{ tr('subtitle') }}</p>
  </div>

  <button class="add-button" @click="handleFormToggle">
    {{ showForm ? tr('cancel') : tr('addCrop') }}
  </button>
</div>

<div v-if="showForm" class="crop-form">
  <h2>{{ editingCropId ? tr('editCrop') : tr('addNewCrop') }}</h2>

  <form @submit.prevent="handleAddCrop">
    <div class="form-group">
      <label for="cropName">{{ tr('cropName') }}</label>
      <input
        id="cropName"
        v-model="form.name"
        type="text"
        placeholder="e.g. Tomato"
        required
      />
    </div>

    <div class="form-group">
      <label for="cropType">{{ tr('cropType') }}</label>
      <select id="cropType" v-model="form.type" required>
        <option value="" disabled>{{ tr('selectCropType') }}</option>
        <option value="Vegetable">{{ tr('vegetable') }}</option>
        <option value="Fruit">{{ tr('fruit') }}</option>
        <option value="Cereal">{{ tr('cereal') }}</option>
        <option value="Legume">{{ tr('legume') }}</option>
        <option value="Other">{{ tr('other') }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="variety">{{ tr('variety') }}</label>
      <input
        id="variety"
        v-model="form.variety"
        type="text"
        placeholder="e.g. Cherry Tomato"
      />
    </div>

    <div class="form-group">
      <label for="field">{{ tr('field') }}</label>
      <select id="field" v-model="form.fieldId" required>
        <option value="" disabled>{{ tr('selectField') }}</option>
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
      <label for="plantingDate">{{ tr('plantingDate') }}</label>
      <input
        id="plantingDate"
        v-model="form.plantingDate"
        type="date"
        required
      />
    </div>

    <div class="form-group">
      <label for="expectedHarvestDate">
        {{ tr('expectedHarvestDate') }}
      </label>
      <input
        id="expectedHarvestDate"
        v-model="form.expectedHarvestDate"
        type="date"
      />
    </div>

    <div class="form-group">
      <label for="area">{{ tr('cultivatedArea') }}</label>
      <input
        id="area"
        v-model.number="form.area"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="e.g. 2.5"
        required
      />
    </div>

    <div class="form-group">
      <label for="cropStatus">{{ tr('cropStatus') }}</label>
      <select id="cropStatus" v-model="form.status" required>
        <option value="Planned">{{ tr('planned') }}</option>
        <option value="Growing">{{ tr('growing') }}</option>
        <option value="Ready for Harvest">{{ tr('ready') }}</option>
        <option value="Harvested">{{ tr('harvested') }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="notes">{{ tr('notes') }}</label>
      <textarea
        id="notes"
        v-model="form.notes"
        rows="4"
        :placeholder="tr('additionalNotes')"
      ></textarea>
    </div>

    <button type="submit" class="save-button">
      {{ editingCropId ? tr('updateCrop') : tr('saveCrop') }}
    </button>
  </form>
</div>
 

<div class="crops-list">
  <div class="crops-toolbar">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="tr('search')"
      class="search-input"
    />

    <select v-model="statusFilter">
      <option value="All">{{ tr('allStatuses') }}</option>
      <option value="Planned">{{ tr('planned') }}</option>
      <option value="Growing">{{ tr('growing') }}</option>
      <option value="Ready for Harvest">{{ tr('ready') }}</option>
      <option value="Harvested">{{ tr('harvested') }}</option>
    </select>

    <select v-model="typeFilter">
      <option value="All">{{ tr('allTypes') }}</option>
      <option value="Vegetable">{{ tr('vegetable') }}</option>
      <option value="Fruit">{{ tr('fruit') }}</option>
      <option value="Cereal">{{ tr('cereal') }}</option>
      <option value="Legume">{{ tr('legume') }}</option>
      <option value="Other">{{ tr('other') }}</option>
    </select>

    <select v-model="fieldFilter">
      <option value="All">{{ tr('allFields') }}</option>
      <option
        v-for="field in fields"
        :key="field.id"
        :value="field.id"
      >
        {{ field.name }}
      </option>
    </select>
  </div>

  <h2>{{ tr('yourCrops') }} ({{ filteredCrops.length }})</h2>

  <div class="crop-stats">
    <div class="stat-card">
      <span>{{ tr('totalCrops') }}</span>
      <h2>{{ cropStats.total }}</h2>
    </div>

    <div class="stat-card">
      <span>{{ tr('planned') }}</span>
      <h2>{{ cropStats.planned }}</h2>
    </div>

    <div class="stat-card">
      <span>{{ tr('growing') }}</span>
      <h2>{{ cropStats.growing }}</h2>
    </div>

    <div class="stat-card">
      <span>{{ tr('ready') }}</span>
      <h2>{{ cropStats.ready }}</h2>
    </div>

    <div class="stat-card">
      <span>{{ tr('harvested') }}</span>
      <h2>{{ cropStats.harvested }}</h2>
    </div>
  </div>

  <div v-if="crops.length === 0" class="empty-state">
    <h3>{{ tr('noCrops') }}</h3>
    <p>{{ tr('addFirst') }}</p>
  </div>

  <div v-else class="crop-grid">
    <div
      v-for="crop in filteredCrops"
      :key="crop.id"
      class="crop-card"
      @click="openCropDetails(crop)"
    >
      <h3>{{ crop.name }}</h3>

      <p
        class="crop-status"
        :class="crop.status?.toLowerCase().replaceAll(' ', '-')"
      >
        {{ translateCropStatus(crop.status) }}
      </p>

      <p><strong>{{ tr('type') }}:</strong> {{ translateCropType(crop.type) }}</p>
      <p><strong>{{ tr('field') }}:</strong> {{ getFieldName(crop.fieldId) }}</p>
      <p><strong>{{ tr('planting') }}:</strong> {{ crop.plantingDate }}</p>
      <p><strong>{{ tr('area') }}:</strong> {{ crop.area }} ha</p>

      <div class="card-actions">
        <button
          class="edit-button"
          @click.stop="handleEditCrop(crop)"
        >
          {{ tr('edit') }}
        </button>

        <button
          class="delete-button"
          @click.stop="handleDeleteCrop(crop.id)"
        >
          {{ tr('delete') }}
        </button>
      </div>
    </div>
  </div>
</div>

  </section>


<div
  v-if="selectedCrop"
  class="modal-overlay"
  @click.self="closeCropDetails"
>
  <div class="crop-modal">
    <div class="modal-header">
      <div>
        <h2>{{ selectedCrop.name }}</h2>
        <p>{{ translateCropType(selectedCrop.type) }}</p>
      </div>

      <button
        class="close-button"
        @click="closeCropDetails"
      >
        &times;
      </button>
    </div>

    <div class="modal-content">
      <p>
        <strong>{{ tr('variety') }}:</strong>
        {{ selectedCrop.variety || tr('notSpecified') }}
      </p>

      <p>
        <strong>{{ tr('field') }}:</strong>
        {{ getFieldName(selectedCrop.fieldId) }}
      </p>

      <p>
        <strong>{{ tr('area') }}:</strong>
        {{ selectedCrop.area }} ha
      </p>

      <p>
        <strong>{{ tr('planting') }}:</strong>
        {{ selectedCrop.plantingDate || tr('notSpecified') }}
      </p>

      <p>
        <strong>{{ tr('expectedHarvest') }}:</strong>
        {{ selectedCrop.expectedHarvestDate || tr('notSpecified') }}
      </p>

      <p>
        <strong>{{ tr('status') }}:</strong>
        {{ translateCropStatus(selectedCrop.status) }}
      </p>

      <div class="modal-notes">
        <strong>{{ tr('notes') }}:</strong>
        <p>{{ selectedCrop.notes || tr('noNotes') }}</p>
      </div>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { currentLanguage } from '../services/languageService'
import {
  getCrops,
  saveCrop,
  updateCrop,
  deleteCrop
} from '../services/cropService'
import { getFields } from '../services/fieldService'

const translations = {
  en: {
    title: 'Crops Management',
    subtitle: 'Manage and monitor your crops.',
    cancel: 'Cancel',
    addCrop: '+ Add Crop',
    editCrop: 'Edit Crop',
    addNewCrop: 'Add New Crop',
    cropName: 'Crop Name',
    cropType: 'Crop Type',
    selectCropType: 'Select crop type',
    variety: 'Variety',
    field: 'Field',
    selectField: 'Select field',
    plantingDate: 'Planting Date',
    expectedHarvestDate: 'Expected Harvest Date',
    cultivatedArea: 'Cultivated Area (ha)',
    cropStatus: 'Crop Status',
    notes: 'Notes',
    additionalNotes: 'Additional information about this crop...',
    updateCrop: 'Update Crop',
    saveCrop: 'Save Crop',
    search: 'Search crops...',
    allStatuses: 'All Statuses',
    allTypes: 'All Types',
    allFields: 'All Fields',
    yourCrops: 'Your Crops',
    totalCrops: 'Total Crops',
    planned: 'Planned',
    growing: 'Growing',
    ready: 'Ready for Harvest',
    harvested: 'Harvested',
    noCrops: 'No crops registered yet',
    addFirst: 'Add your first crop to start managing your cultivation.',
    type: 'Type',
    planting: 'Planting Date',
    area: 'Area',
    edit: 'Edit',
    delete: 'Delete',
    notSpecified: 'Not specified',
    expectedHarvest: 'Expected Harvest',
    status: 'Status',
    noNotes: 'No additional notes.',
    unknownField: 'Unknown Field',
    confirmDelete: 'Are you sure you want to delete this crop?',
    vegetable: 'Vegetable',
    fruit: 'Fruit',
    cereal: 'Cereal',
    legume: 'Legume',
    other: 'Other'
  },

  el: {
    title: 'Διαχείριση Καλλιεργειών',
    subtitle: 'Διαχειριστείτε και παρακολουθήστε τις καλλιέργειές σας.',
    cancel: 'Ακύρωση',
    addCrop: '+ Προσθήκη Καλλιέργειας',
    editCrop: 'Επεξεργασία Καλλιέργειας',
    addNewCrop: 'Νέα Καλλιέργεια',
    cropName: 'Όνομα Καλλιέργειας',
    cropType: 'Τύπος Καλλιέργειας',
    selectCropType: 'Επιλέξτε τύπο καλλιέργειας',
    variety: 'Ποικιλία',
    field: 'Αγροτεμάχιο',
    selectField: 'Επιλέξτε αγροτεμάχιο',
    plantingDate: 'Ημερομηνία Φύτευσης',
    expectedHarvestDate: 'Αναμενόμενη Ημερομηνία Συγκομιδής',
    cultivatedArea: 'Καλλιεργούμενη Έκταση (ha)',
    cropStatus: 'Κατάσταση Καλλιέργειας',
    notes: 'Σημειώσεις',
    additionalNotes: 'Πρόσθετες πληροφορίες για αυτή την καλλιέργεια...',
    updateCrop: 'Ενημέρωση Καλλιέργειας',
    saveCrop: 'Αποθήκευση Καλλιέργειας',
    search: 'Αναζήτηση καλλιεργειών...',
    allStatuses: 'Όλες οι Καταστάσεις',
    allTypes: 'Όλοι οι Τύποι',
    allFields: 'Όλα τα Αγροτεμάχια',
    yourCrops: 'Οι Καλλιέργειές σας',
    totalCrops: 'Σύνολο Καλλιεργειών',
    planned: 'Προγραμματισμένες',
    growing: 'Σε Ανάπτυξη',
    ready: 'Έτοιμες για Συγκομιδή',
    harvested: 'Συγκομισμένες',
    noCrops: 'Δεν υπάρχουν καταχωρημένες καλλιέργειες',
    addFirst: 'Προσθέστε την πρώτη σας καλλιέργεια για να ξεκινήσετε τη διαχείρισή της.',
    type: 'Τύπος',
    planting: 'Ημερομηνία Φύτευσης',
    area: 'Έκταση',
    edit: 'Επεξεργασία',
    delete: 'Διαγραφή',
    notSpecified: 'Δεν έχει οριστεί',
    expectedHarvest: 'Αναμενόμενη Συγκομιδή',
    status: 'Κατάσταση',
    noNotes: 'Δεν υπάρχουν πρόσθετες σημειώσεις.',
    unknownField: 'Άγνωστο Αγροτεμάχιο',
    confirmDelete: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την καλλιέργεια;',
    vegetable: 'Λαχανικό',
    fruit: 'Φρούτο',
    cereal: 'Δημητριακό',
    legume: 'Όσπριο',
    other: 'Άλλο'
  }
}

const cropTypeTranslations = {
  Vegetable: 'vegetable',
  Fruit: 'fruit',
  Cereal: 'cereal',
  Legume: 'legume',
  Other: 'other'
}

const cropStatusTranslations = {
  Planned: 'planned',
  Growing: 'growing',
  'Ready for Harvest': 'ready',
  Harvested: 'harvested'
}

function tr(key) {
  return translations[currentLanguage.value]?.[key]
    || translations.en[key]
    || key
}

function translateCropType(type) {
  const key = cropTypeTranslations[type]
  return key ? tr(key) : type
}

function translateCropStatus(status) {
  const key = cropStatusTranslations[status || 'Growing']
  return key ? tr(key) : status
}

const crops = ref([])
const fields = ref([])
const showForm = ref(false)
const editingCropId = ref(null)
const selectedCrop = ref(null)
const searchQuery = ref('')
const statusFilter = ref('All')
const typeFilter = ref('All')
const fieldFilter = ref('All')
const emptyForm = () => ({
  name: '',
  type: '',
  variety: '',
  fieldId: '',
  plantingDate: '',
  expectedHarvestDate: '',
  area: null,
  status: 'Growing',
  notes: ''
})

const form = ref(emptyForm())

const cropStats = computed(() => ({
  total: crops.value.length,

  planned: crops.value.filter(
    crop => (crop.status || 'Growing') === 'Planned'
  ).length,

  growing: crops.value.filter(
    crop => (crop.status || 'Growing') === 'Growing'
  ).length,

  ready: crops.value.filter(
    crop => crop.status === 'Ready for Harvest'
  ).length,

  harvested: crops.value.filter(
    crop => crop.status === 'Harvested'
  ).length
}))
const filteredCrops = computed(() => {
  return crops.value.filter(crop => {
    const query = searchQuery.value.toLowerCase().trim()

    const matchesSearch =
      crop.name.toLowerCase().includes(query) ||
      (crop.variety || '').toLowerCase().includes(query)

    const matchesStatus =
      statusFilter.value === 'All' ||
      (crop.status || 'Growing') === statusFilter.value

    const matchesType =
      typeFilter.value === 'All' ||
      crop.type === typeFilter.value

    const matchesField =
      fieldFilter.value === 'All' ||
      crop.fieldId === fieldFilter.value

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesField
    )
  })
})
onMounted(() => {
  crops.value = getCrops()
  fields.value = getFields()
})

function handleAddCrop() {
  if (editingCropId.value) {
    const updatedCrop = updateCrop(editingCropId.value, form.value)

    crops.value = crops.value.map(crop =>
      crop.id === editingCropId.value ? updatedCrop : crop
    )
  } else {
    const newCrop = saveCrop(form.value)
    crops.value.push(newCrop)
  }

  cancelEdit()
}
function handleEditCrop(crop) {
  editingCropId.value = crop.id

  form.value = {
  name: crop.name,
  type: crop.type,
  variety: crop.variety || '',
  fieldId: crop.fieldId,
  plantingDate: crop.plantingDate,
  expectedHarvestDate: crop.expectedHarvestDate || '',
  area: crop.area,
  status: crop.status || 'Growing',
  notes: crop.notes || ''
}

  showForm.value = true
}

function cancelEdit() {
  editingCropId.value = null
  form.value = emptyForm()
  showForm.value = false
}

function handleDeleteCrop(id) {
 const confirmed = window.confirm(
  tr('confirmDelete')
)

  if (!confirmed) return

  deleteCrop(id)

  crops.value = crops.value.filter(crop => crop.id !== id)
}

function getFieldName(fieldId) {
  const field = fields.value.find(field => field.id === fieldId)
  return field ? field.name : tr('unknownField')
}
function handleFormToggle() {
  if (showForm.value) {
    cancelEdit()
  } else {
    editingCropId.value = null
    form.value = emptyForm()
    showForm.value = true
  }
}
function openCropDetails(crop) {
  selectedCrop.value = crop
}

function closeCropDetails() {
  selectedCrop.value = null
}
</script>

<style scoped>
.crops-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0;
}

.page-header p {
  color: #888;
  margin-top: 10px;
  line-height: 1.6;
}

.add-button,
.save-button {
  background: #c69320;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
}

.crop-form {
  background: var(--card-bg, #fff);
  padding: 24px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.form-group textarea {
  resize: vertical;
  font-family: inherit;
}
.crops-list h2 {
  margin-bottom: 20px;
}

.empty-state {
  padding: 35px;
  text-align: center;
  background: var(--card-bg, #fff);
  border-radius: 10px;
  color: #888;
}

.crop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.crop-card {
  background: var(--card-bg, #fff);
  padding: 20px;
  border-radius: 10px;
}

.delete-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.edit-button {
  background: #c69320;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button {
  margin-top: 0;
}
.crop-status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin: 8px 0 12px;
}

.crop-status.planned {
  background: #e3e8ef;
  color: #526174;
}

.crop-status.growing {
  background: #d9f0df;
  color: #26733b;
}

.crop-status.ready-for-harvest {
  background: #fff0c2;
  color: #936600;
}

.crop-status.harvested {
  background: #dce7f8;
  color: #315b96;
}

.crop-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 18px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--card-bg, #fff);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
}

.stat-card span {
  display: block;
  color: #888;
  font-size: 13px;
  margin-bottom: 10px;
}

.stat-card h2 {
  font-size: 28px;
  margin: 0;
  font-weight: 600;
}

.crop-card {
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.crop-modal {
  background: var(--card-bg, #fff);
  color: var(--text-color, #222);
  width: 100%;
  max-width: 550px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 12px;
  padding: 25px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0 0 5px;
}

.modal-header p {
  margin: 0;
  color: #888;
}

.close-button {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
}

.modal-content p {
  margin: 14px 0;
}

.modal-notes {
  margin-top: 20px;
  padding: 15px;
  background: rgba(128, 128, 128, 0.08);
  border-radius: 8px;
}

.modal-notes p {
  margin-bottom: 0;
}
.crops-toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 25px;
}

.crops-toolbar input,
.crops-toolbar select {
  width: 100%;
  padding: 11px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background: var(--card-bg, #fff);
  color: inherit;
  font-size: 14px;
}

.search-input {
  min-width: 0;
}

.crops-toolbar input:focus,
.crops-toolbar select:focus {
  outline: none;
  border-color: #c69320;
}
</style>
