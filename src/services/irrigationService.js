
const IRRIGATIONS_KEY = 'agrovision_irrigations'

export function getIrrigations() {
  try {
    const storedIrrigations = localStorage.getItem(IRRIGATIONS_KEY)

    return storedIrrigations
      ? JSON.parse(storedIrrigations)
      : []
  } catch (error) {
    console.error('Error loading irrigations:', error)
    return []
  }
}

function persistIrrigations(irrigations) {
  localStorage.setItem(
    IRRIGATIONS_KEY,
    JSON.stringify(irrigations)
  )
}

export function saveIrrigation(irrigationData) {
  const irrigations = getIrrigations()

  const newIrrigation = {
    id: crypto.randomUUID(),
    fieldId: irrigationData.fieldId,
    cropId: irrigationData.cropId,
    date: irrigationData.date,
    time: irrigationData.time,
    waterAmount: Number(irrigationData.waterAmount),
    status: irrigationData.status || 'Scheduled',
    notes: irrigationData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  irrigations.push(newIrrigation)

  persistIrrigations(irrigations)

  return newIrrigation
}

export function updateIrrigation(id, updatedData) {
  const irrigations = getIrrigations()

  const updatedIrrigations = irrigations.map(irrigation =>
    irrigation.id === id
      ? {
          ...irrigation,
          ...updatedData,
          waterAmount: Number(updatedData.waterAmount),
          updatedAt: new Date().toISOString()
        }
      : irrigation
  )

  persistIrrigations(updatedIrrigations)
}

export function deleteIrrigation(id) {
  const irrigations = getIrrigations()

  const updatedIrrigations = irrigations.filter(
    irrigation => irrigation.id !== id
  )

  persistIrrigations(updatedIrrigations)
}
