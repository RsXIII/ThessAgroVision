
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export async function getWeatherByCoordinates(latitude, longitude) {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error('Invalid geographic coordinates.')
  }

  const params = new URLSearchParams({
    latitude: latitude,
    longitude: longitude,

    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m'
    ].join(','),

    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m'
    ].join(','),

    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'precipitation_sum',
      'sunrise',
      'sunset'
    ].join(','),

    timezone: 'auto',
    forecast_days: '7',
    wind_speed_unit: 'kmh'
  })

  const response = await fetch(`${BASE_URL}?${params}`)

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  return await response.json()
}
