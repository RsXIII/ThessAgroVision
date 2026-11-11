
const FIELDS_KEY = 'agrovision_fields'
const SELECTED_FIELD_KEY = 'agrovision_selected_field'

export function getFields() {
  try {
    const storedFields = localStorage.getItem(FIELDS_KEY)

    return storedFields ? JSON.parse(storedFields) : []
  } catch (error) {
    console.error('Error loading fields:', error)
    return []
  }
}

export function saveField(field) {
  if (!field.name || !field.name.trim()) {
    throw new Error('Field name is required.')
  }

  if (
    !Number.isFinite(Number(field.latitude)) ||
    !Number.isFinite(Number(field.longitude)) ||
    Number(field.latitude) < -90 ||
    Number(field.latitude) > 90 ||
    Number(field.longitude) < -180 ||
    Number(field.longitude) > 180
  ) {
    throw new Error('Valid geographic coordinates are required.')
  }

  const fields = getFields()

  const existingIndex = fields.findIndex(
    item => item.id === field.id
  )

  const updatedField = {
    ...field,
    id: field.id || crypto.randomUUID(),
    name: field.name.trim(),
    latitude: Number(field.latitude),
    longitude: Number(field.longitude),
    area: Number(field.area),
    updatedAt: new Date().toISOString()
  }

  if (existingIndex >= 0) {
    fields[existingIndex] = updatedField
  } else {
    updatedField.createdAt = new Date().toISOString()
    fields.push(updatedField)
  }

  localStorage.setItem(FIELDS_KEY, JSON.stringify(fields))

  return updatedField
}

export function deleteField(fieldId) {
  const fields = getFields()

  const updatedFields = fields.filter(
    field => field.id !== fieldId
  )

  localStorage.setItem(FIELDS_KEY, JSON.stringify(updatedFields))

  if (getSelectedFieldId() === fieldId) {
    localStorage.removeItem(SELECTED_FIELD_KEY)
  }
}

export function getSelectedFieldId() {
  return localStorage.getItem(SELECTED_FIELD_KEY)
}

export function setSelectedFieldId(fieldId) {
  const fields = getFields()

  const exists = fields.some(field => field.id === fieldId)

  if (!exists) {
    throw new Error('Selected field does not exist.')
  }

  localStorage.setItem(SELECTED_FIELD_KEY, fieldId)
}
