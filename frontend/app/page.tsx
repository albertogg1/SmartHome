'use client'

import * as React from 'react'
import { MetricCard } from '@/components/dashboard/metric-card'
import { TemperatureChart } from '@/components/dashboard/temperature-chart'
import { SensorsTable } from '@/components/dashboard/sensors-table'
import { AlertsSection } from '@/components/dashboard/alerts-section'
import { HouseMap } from '@/components/dashboard/house-map'
import { sensors } from '@/lib/mock-data'

export default function DashboardPage() {
  const [currentTemp, setCurrentTemp] = React.useState(22.5)
  const [currentHumidity, setCurrentHumidity] = React.useState(45)

  // Simulate real-time temperature updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp((prev) => Math.round((prev + (Math.random() - 0.5) * 0.3) * 10) / 10)
      setCurrentHumidity((prev) => Math.round(prev + (Math.random() - 0.5) * 2))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const onlineSensors = sensors.filter((s) => s.status === 'online')
  const maxTemp = Math.max(...sensors.map((s) => s.maxTemp))
  const minTemp = Math.min(...sensors.map((s) => s.minTemp))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Monitorización en tiempo real de tu hogar inteligente
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <MetricCard
          title="Temperatura Actual"
          value={currentTemp}
          unit="°C"
          icon="temperature"
          trend="up"
          trendValue="+0.3°C"
        />
        <MetricCard
          title="Humedad"
          value={currentHumidity}
          unit="%"
          icon="humidity"
        />
        <MetricCard
          title="Temp. Máxima"
          value={maxTemp}
          unit="°C"
          icon="max"
        />
        <MetricCard
          title="Temp. Mínima"
          value={minTemp}
          unit="°C"
          icon="min"
        />
        <MetricCard
          title="Sensores"
          value={`${onlineSensors.length}/${sensors.length}`}
          icon="status"
          status={onlineSensors.length === sensors.length ? 'online' : 'offline'}
        />
      </div>

      {/* Main Chart */}
      <TemperatureChart />

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SensorsTable />
        </div>
        <div className="space-y-6">
          <AlertsSection />
          <HouseMap />
        </div>
      </div>
    </div>
  )
}
