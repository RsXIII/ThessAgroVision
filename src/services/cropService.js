
const CROPS_KEY = 'agrovision_crops'

export function getCrops() {
  try {
    const storedCrops = localStorage.getItem(CROPS_KEY)
    return storedCrops ? JSON.parse(storedCrops) : []
  } catch (error) {
    console.error('Error loading crops:', error)
    return []
  }
}

export function saveCrop(crop) {
  const crops = getCrops()

  const now = new Date().toISOString()

  const newCrop = {
    ...crop,
    id: crypto.randomUUID(),
    name: crop.name.trim(),
    createdAt: now,
    updatedAt: now
  }

  crops.push(newCrop)

  localStorage.setItem(CROPS_KEY, JSON.stringify(crops))

  return newCrop
}

export function updateCrop(id, updatedData) {
  const crops = getCrops()

  const updatedCrops = crops.map(crop =>
    crop.id === id
      ? {
          ...crop,
          ...updatedData,
          name: updatedData.name.trim(),
          updatedAt: new Date().toISOString()
        }
      : crop
  )

  localStorage.setItem(CROPS_KEY, JSON.stringify(updatedCrops))

  return updatedCrops.find(crop => crop.id === id) || null
}

export function deleteCrop(id) {
  const crops = getCrops()

  const updatedCrops = crops.filter(crop => crop.id !== id)

  localStorage.setItem(CROPS_KEY, JSON.stringify(updatedCrops))
}
