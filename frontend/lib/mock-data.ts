// Mock data for IoT sensors
export interface Sensor {
  id: string
  name: string
  location: string
  temperature: number
  humidity: number
  status: 'online' | 'offline'
  lastUpdate: Date
  minTemp: number
  maxTemp: number
}

export interface TemperatureReading {
  timestamp: Date
  temperature: number
  humidity: number
  sensorId: string
}

export interface Alert {
  id: string
  type: 'high_temp' | 'low_temp' | 'sensor_offline' | 'humidity_alert'
  message: string
  sensorId: string
  sensorName: string
  timestamp: Date
  severity: 'warning' | 'critical' | 'info'
  acknowledged: boolean
}

// Generate sensors
export const sensors: Sensor[] = [
  {
    id: 'sensor-1',
    name: 'Sensor Principal',
    location: 'Sala de estar',
    temperature: 22.5,
    humidity: 45,
    status: 'online',
    lastUpdate: new Date(),
    minTemp: 18.2,
    maxTemp: 24.8,
  },
  {
    id: 'sensor-2',
    name: 'Sensor Dormitorio',
    location: 'Dormitorio principal',
    temperature: 21.3,
    humidity: 52,
    status: 'online',
    lastUpdate: new Date(Date.now() - 120000),
    minTemp: 19.1,
    maxTemp: 23.5,
  },
  {
    id: 'sensor-3',
    name: 'Sensor Cocina',
    location: 'Cocina',
    temperature: 24.8,
    humidity: 38,
    status: 'online',
    lastUpdate: new Date(Date.now() - 60000),
    minTemp: 20.5,
    maxTemp: 28.2,
  },
  {
    id: 'sensor-4',
    name: 'Sensor Exterior',
    location: 'Jardín',
    temperature: 18.2,
    humidity: 68,
    status: 'online',
    lastUpdate: new Date(Date.now() - 300000),
    minTemp: 12.4,
    maxTemp: 22.1,
  },
  {
    id: 'sensor-5',
    name: 'Sensor Garaje',
    location: 'Garaje',
    temperature: 19.7,
    humidity: 55,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 3600000),
    minTemp: 14.2,
    maxTemp: 21.8,
  },
  {
    id: 'sensor-6',
    name: 'Sensor Baño',
    location: 'Baño principal',
    temperature: 23.1,
    humidity: 72,
    status: 'online',
    lastUpdate: new Date(Date.now() - 180000),
    minTemp: 21.0,
    maxTemp: 26.5,
  },
]

// Generate temperature history for charts
export function generateTemperatureHistory(hours: number = 24): TemperatureReading[] {
  const readings: TemperatureReading[] = []
  const now = Date.now()
  const interval = (hours * 60 * 60 * 1000) / 100 // 100 data points

  for (let i = 100; i >= 0; i--) {
    const timestamp = new Date(now - i * interval)
    const baseTemp = 21 + Math.sin(i / 10) * 3
    const noise = (Math.random() - 0.5) * 2

    readings.push({
      timestamp,
      temperature: Math.round((baseTemp + noise) * 10) / 10,
      humidity: Math.round(45 + Math.sin(i / 15) * 15 + (Math.random() - 0.5) * 10),
      sensorId: 'sensor-1',
    })
  }

  return readings
}

// Generate alerts
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'high_temp',
    message: 'Temperatura superior al umbral configurado',
    sensorId: 'sensor-3',
    sensorName: 'Sensor Cocina',
    timestamp: new Date(Date.now() - 1800000),
    severity: 'warning',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'sensor_offline',
    message: 'Sensor sin conexión',
    sensorId: 'sensor-5',
    sensorName: 'Sensor Garaje',
    timestamp: new Date(Date.now() - 3600000),
    severity: 'critical',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    type: 'humidity_alert',
    message: 'Humedad alta detectada',
    sensorId: 'sensor-6',
    sensorName: 'Sensor Baño',
    timestamp: new Date(Date.now() - 7200000),
    severity: 'info',
    acknowledged: true,
  },
]

// Analytics data
export interface DailyStats {
  date: string
  avgTemp: number
  minTemp: number
  maxTemp: number
  avgHumidity: number
  energyConsumption: number
}

export function generateDailyStats(days: number = 30): DailyStats[] {
  const stats: DailyStats[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const baseTemp = 21 + Math.sin(i / 7) * 2
    stats.push({
      date: date.toISOString().split('T')[0],
      avgTemp: Math.round((baseTemp + (Math.random() - 0.5) * 2) * 10) / 10,
      minTemp: Math.round((baseTemp - 3 + (Math.random() - 0.5)) * 10) / 10,
      maxTemp: Math.round((baseTemp + 4 + (Math.random() - 0.5)) * 10) / 10,
      avgHumidity: Math.round(50 + Math.sin(i / 5) * 10 + (Math.random() - 0.5) * 5),
      energyConsumption: Math.round((2.5 + Math.random() * 1.5) * 100) / 100,
    })
  }

  return stats
}

// Rooms for the house map
export interface Room {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  sensorId?: string
}

export const rooms: Room[] = [
  { id: 'room-1', name: 'Sala de estar', x: 10, y: 10, width: 120, height: 80, sensorId: 'sensor-1' },
  { id: 'room-2', name: 'Dormitorio', x: 140, y: 10, width: 100, height: 80, sensorId: 'sensor-2' },
  { id: 'room-3', name: 'Cocina', x: 10, y: 100, width: 80, height: 70, sensorId: 'sensor-3' },
  { id: 'room-4', name: 'Baño', x: 100, y: 100, width: 60, height: 70, sensorId: 'sensor-6' },
  { id: 'room-5', name: 'Garaje', x: 170, y: 100, width: 70, height: 70, sensorId: 'sensor-5' },
]
