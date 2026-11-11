
import { ref } from 'vue'
import { getSettings } from './settingsService'

export const currentLanguage = ref(
  getSettings().language === 'el' ? 'el' : 'en'
)

const translations = {
  en: {
    mainMenu: 'MAIN MENU',
    system: 'SYSTEM',
    dashboard: 'Dashboard',
    fields: 'Fields',
    weather: 'Weather',
    crops: 'Crops',
    irrigation: 'Irrigation',
    analytics: 'Analytics',
    settings: 'Settings',
    welcomeBack: 'Welcome back to AgroVision',
    search: 'Search...',
    notifications: 'Notifications',
    administrator: 'Administrator',
    farmManager: 'Farm Manager',

// Irrigation
irrigationTitle: 'Irrigation Management',
irrigationSubtitle: 'Manage irrigation schedules, water consumption and history.',
scheduleIrrigation: 'Schedule Irrigation',
totalIrrigations: 'Total Irrigations',
scheduled: 'Scheduled',
completed: 'Completed',
totalWaterUsed: 'Total Water Used',
editIrrigation: 'Edit Irrigation',
scheduleNewIrrigation: 'Schedule New Irrigation',
field: 'Field',
selectField: 'Select field',
crop: 'Crop',
selectCrop: 'Select crop',
noCropsForField: 'No crops registered for this field.',
date: 'Date',
time: 'Time',
waterAmount: 'Water Amount (Liters)',
status: 'Status',
cancelled: 'Cancelled',
notes: 'Notes',
irrigationNotesPlaceholder: 'Additional irrigation notes...',
cancel: 'Cancel',
updateIrrigation: 'Update Irrigation',
saveIrrigation: 'Save Irrigation',
irrigationHistory: 'Irrigation History',
irrigationHistorySubtitle: 'View and manage all irrigation activities.',
allStatuses: 'All Statuses',
noIrrigationRecords: 'No irrigation records found',
scheduleFirstIrrigation: 'Schedule your first irrigation to get started.',
actions: 'Actions',
edit: 'Edit',
delete: 'Delete',

// Settings
settingsTitle: 'Settings',
settingsSubtitle: 'Manage your farm and application preferences.',
farmInformation: 'Farm Information',
farmInformationSubtitle: 'Configure your farm details.',
farmName: 'Farm Name',
farmLocation: 'Farm Location',
farmOwner: 'Farm Owner',
totalFarmArea: 'Total Farm Area (hectares)',
enterFarmName: 'Enter farm name',
enterFarmLocation: 'Enter farm location',
enterOwnerName: 'Enter owner name',
enterFarmArea: 'Enter farm area',
measurementUnits: 'Measurement Units',
measurementUnitsSubtitle: 'Choose how agricultural data is displayed.',
areaUnit: 'Area Unit',
hectares: 'Hectares (ha)',
acres: 'Acres',
waterUnit: 'Water Unit',
liters: 'Liters (L)',
cubicMeters: 'Cubic meters (m³)',
temperature: 'Temperature',
celsius: 'Celsius (°C)',
fahrenheit: 'Fahrenheit (°F)',
regionalSettings: 'Regional Settings',
regionalSettingsSubtitle: 'Configure regional preferences.',
language: 'Language',
dateFormat: 'Date Format',
timeZone: 'Time Zone',
dataManagement: 'Data Management',
dataManagementSubtitle: 'Manage your application data.',
applicationStorage: 'Application Storage',
storageDescription: 'Your farm data is stored locally in your browser.',
localStorage: 'Local Storage',
resetSettings: 'Reset Settings',
resetSettingsDescription: 'Restore all preferences to their default values.',
saveChanges: 'Save Changes',
settingsSaved: 'Settings saved successfully!',
settingsSaveError: 'Unable to save settings.',
confirmResetSettings: 'Are you sure you want to reset all settings?'
  },

  el: {
    mainMenu: 'ΚΥΡΙΟ ΜΕΝΟΥ',
    system: 'ΣΥΣΤΗΜΑ',
    dashboard: 'Πίνακας Ελέγχου',
    fields: 'Αγροτεμάχια',
    weather: 'Καιρός',
    crops: 'Καλλιέργειες',
    irrigation: 'Άρδευση',
    analytics: 'Αναλύσεις',
    settings: 'Ρυθμίσεις',
    welcomeBack: 'Καλώς ήρθατε στο AgroVision',
    search: 'Αναζήτηση...',
    notifications: 'Ειδοποιήσεις',
    administrator: 'Διαχειριστής',
    farmManager: 'Υπεύθυνος Αγροκτήματος',

// Άρδευση
irrigationTitle: 'Διαχείριση Άρδευσης',
irrigationSubtitle: 'Διαχειριστείτε τα προγράμματα άρδευσης, την κατανάλωση νερού και το ιστορικό.',
scheduleIrrigation: 'Προγραμματισμός Άρδευσης',
totalIrrigations: 'Συνολικές Αρδεύσεις',
scheduled: 'Προγραμματισμένες',
completed: 'Ολοκληρωμένες',
totalWaterUsed: 'Συνολική Κατανάλωση Νερού',
editIrrigation: 'Επεξεργασία Άρδευσης',
scheduleNewIrrigation: 'Προγραμματισμός Νέας Άρδευσης',
field: 'Αγροτεμάχιο',
selectField: 'Επιλέξτε αγροτεμάχιο',
crop: 'Καλλιέργεια',
selectCrop: 'Επιλέξτε καλλιέργεια',
noCropsForField: 'Δεν υπάρχουν καταχωρημένες καλλιέργειες σε αυτό το αγροτεμάχιο.',
date: 'Ημερομηνία',
time: 'Ώρα',
waterAmount: 'Ποσότητα Νερού (Λίτρα)',
status: 'Κατάσταση',
cancelled: 'Ακυρωμένη',
notes: 'Σημειώσεις',
irrigationNotesPlaceholder: 'Πρόσθετες σημειώσεις άρδευσης...',
cancel: 'Ακύρωση',
updateIrrigation: 'Ενημέρωση Άρδευσης',
saveIrrigation: 'Αποθήκευση Άρδευσης',
irrigationHistory: 'Ιστορικό Αρδεύσεων',
irrigationHistorySubtitle: 'Προβολή και διαχείριση όλων των δραστηριοτήτων άρδευσης.',
allStatuses: 'Όλες οι Καταστάσεις',
noIrrigationRecords: 'Δεν βρέθηκαν εγγραφές άρδευσης',
scheduleFirstIrrigation: 'Προγραμματίστε την πρώτη σας άρδευση για να ξεκινήσετε.',
actions: 'Ενέργειες',
edit: 'Επεξεργασία',
delete: 'Διαγραφή',

// Ρυθμίσεις
settingsTitle: 'Ρυθμίσεις',
settingsSubtitle: 'Διαχειριστείτε το αγρόκτημα και τις προτιμήσεις της εφαρμογής σας.',
farmInformation: 'Πληροφορίες Αγροκτήματος',
farmInformationSubtitle: 'Ρυθμίστε τα στοιχεία του αγροκτήματός σας.',
farmName: 'Όνομα Αγροκτήματος',
farmLocation: 'Τοποθεσία Αγροκτήματος',
farmOwner: 'Ιδιοκτήτης Αγροκτήματος',
totalFarmArea: 'Συνολική Έκταση Αγροκτήματος (εκτάρια)',
enterFarmName: 'Εισάγετε όνομα αγροκτήματος',
enterFarmLocation: 'Εισάγετε τοποθεσία αγροκτήματος',
enterOwnerName: 'Εισάγετε όνομα ιδιοκτήτη',
enterFarmArea: 'Εισάγετε την έκταση του αγροκτήματος',
measurementUnits: 'Μονάδες Μέτρησης',
measurementUnitsSubtitle: 'Επιλέξτε πώς εμφανίζονται τα αγροτικά δεδομένα.',
areaUnit: 'Μονάδα Επιφάνειας',
hectares: 'Εκτάρια (ha)',
acres: 'Στρέμματα (acres)',
waterUnit: 'Μονάδα Νερού',
liters: 'Λίτρα (L)',
cubicMeters: 'Κυβικά μέτρα (m³)',
temperature: 'Θερμοκρασία',
celsius: 'Κελσίου (°C)',
fahrenheit: 'Φαρενάιτ (°F)',
regionalSettings: 'Τοπικές Ρυθμίσεις',
regionalSettingsSubtitle: 'Ρυθμίστε τις τοπικές προτιμήσεις.',
language: 'Γλώσσα',
dateFormat: 'Μορφή Ημερομηνίας',
timeZone: 'Ζώνη Ώρας',
dataManagement: 'Διαχείριση Δεδομένων',
dataManagementSubtitle: 'Διαχειριστείτε τα δεδομένα της εφαρμογής σας.',
applicationStorage: 'Αποθήκευση Εφαρμογής',
storageDescription: 'Τα δεδομένα του αγροκτήματός σας αποθηκεύονται τοπικά στον περιηγητή σας.',
localStorage: 'Τοπική Αποθήκευση',
resetSettings: 'Επαναφορά Ρυθμίσεων',
resetSettingsDescription: 'Επαναφορά όλων των προτιμήσεων στις προεπιλεγμένες τιμές.',
saveChanges: 'Αποθήκευση Αλλαγών',
settingsSaved: 'Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς!',
settingsSaveError: 'Αδυναμία αποθήκευσης ρυθμίσεων.',
confirmResetSettings: 'Είστε βέβαιοι ότι θέλετε να επαναφέρετε όλες τις ρυθμίσεις;'
  }
}

export function t(key) {
  return translations[currentLanguage.value]?.[key]
    || translations.en[key]
    || key
}

export function setLanguage(language) {
  if (!['en', 'el'].includes(language)) {
    return
  }

  currentLanguage.value = language

  window.dispatchEvent(
    new Event('agrovision-settings-updated')
  )
}
