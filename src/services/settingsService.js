
const SETTINGS_KEY = 'agrovision_settings'

export const defaultSettings = {
  farmName: '',
  farmLocation: '',
  farmOwner: '',
  farmSize: 0,
  areaUnit: 'hectares',
  waterUnit: 'liters',
  temperatureUnit: 'celsius',
  language: 'en',
  dateFormat: 'DD/MM/YYYY',
  timezone: 'Europe/Athens'
}

export function getSettings() {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_KEY)

    if (!storedSettings) {
      return { ...defaultSettings }
    }

    return {
      ...defaultSettings,
      ...JSON.parse(storedSettings)
    }
  } catch (error) {
    console.error('Error loading settings:', error)
    return { ...defaultSettings }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    )

    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

export function formatArea(area) {
  const value = Number(area) || 0
  const settings = getSettings()

  if (settings.areaUnit === 'acres') {
    return `${(value * 2.4710538).toLocaleString(undefined, {
      maximumFractionDigits: 2
    })} acres`
  }

  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 2
  })} ha`
}
