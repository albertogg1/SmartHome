'use client'

import * as React from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Thermometer,
  Droplets,
  Zap,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { generateDailyStats, sensors } from '@/lib/mock-data'

type TimeRange = '7d' | '30d' | '90d'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('30d')
  const [selectedSensor, setSelectedSensor] = React.useState('all')
  const [stats, setStats] = React.useState(generateDailyStats(30))

  React.useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    setStats(generateDailyStats(days))
  }, [timeRange])

  const avgTemp =
    stats.reduce((acc, s) => acc + s.avgTemp, 0) / stats.length
  const avgHumidity =
    stats.reduce((acc, s) => acc + s.avgHumidity, 0) / stats.length
  const totalEnergy = stats.reduce((acc, s) => acc + s.energyConsumption, 0)
  const maxTemp = Math.max(...stats.map((s) => s.maxTemp))

  const chartData = stats.map((s) => ({
    ...s,
    date: new Date(s.date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    }),
  }))

  // Weekly averages for the bar chart
  const weeklyData = React.useMemo(() => {
    const weeks: { week: string; avgTemp: number; avgHumidity: number }[] = []
    for (let i = 0; i < stats.length; i += 7) {
      const weekStats = stats.slice(i, i + 7)
      if (weekStats.length > 0) {
        weeks.push({
          week: `Sem ${Math.floor(i / 7) + 1}`,
          avgTemp:
            Math.round(
              (weekStats.reduce((acc, s) => acc + s.avgTemp, 0) /
                weekStats.length) *
                10
            ) / 10,
          avgHumidity: Math.round(
            weekStats.reduce((acc, s) => acc + s.avgHumidity, 0) /
              weekStats.length
          ),
        })
      }
    }
    return weeks
  }, [stats])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Analíticas
          </h2>
          <p className="text-sm text-muted-foreground">
            Estadísticas históricas y consumo energético
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedSensor} onValueChange={setSelectedSensor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los sensores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los sensores</SelectItem>
              {sensors.map((sensor) => (
                <SelectItem key={sensor.id} value={sensor.id}>
                  {sensor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                onClick={() => setTimeRange(range)}
                className={cn(
                  'h-8 px-3 text-xs font-medium transition-all',
                  timeRange === range
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Temp. Promedio
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {avgTemp.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground">°C</span>
                </p>
                <p className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  +0.3°C vs periodo anterior
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Thermometer className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Humedad Promedio
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {avgHumidity.toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground">%</span>
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  Rango óptimo: 40-60%
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/10">
                <Droplets className="h-5 w-5 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Consumo Estimado
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {totalEnergy.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground">kWh</span>
                </p>
                <p className="flex items-center gap-1 text-xs text-warning">
                  <Zap className="h-3 w-3" />
                  {(totalEnergy * 0.15).toFixed(2)} EUR aprox.
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                <Zap className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Temp. Máxima
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {maxTemp.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground">°C</span>
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Registrada este periodo
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <Thermometer className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold lg:text-lg">
            Historial de Temperatura y Humedad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.17 195)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.7 0.17 195)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.6 0.18 145)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.6 0.18 145)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 260)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="oklch(0.5 0 0)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.5 0 0)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.17 0.015 260)',
                    border: '1px solid oklch(0.25 0.015 260)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'oklch(0.65 0 0)' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="avgTemp"
                  name="Temperatura (°C)"
                  stroke="oklch(0.7 0.17 195)"
                  strokeWidth={2}
                  fill="url(#tempGradient)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="avgHumidity"
                  name="Humedad (%)"
                  stroke="oklch(0.6 0.18 145)"
                  strokeWidth={2}
                  fill="url(#humidityGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Averages */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold lg:text-lg">
              Promedios Semanales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 260)" vertical={false} />
                  <XAxis
                    dataKey="week"
                    stroke="oklch(0.5 0 0)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.5 0 0)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.17 0.015 260)',
                      border: '1px solid oklch(0.25 0.015 260)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="avgTemp"
                    name="Temperatura (°C)"
                    fill="oklch(0.7 0.17 195)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Energy Consumption */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold lg:text-lg">
              Consumo Energético Diario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 260)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="oklch(0.5 0 0)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.5 0 0)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.17 0.015 260)',
                      border: '1px solid oklch(0.25 0.015 260)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value} kWh`, 'Consumo']}
                  />
                  <Line
                    type="monotone"
                    dataKey="energyConsumption"
                    name="Consumo (kWh)"
                    stroke="oklch(0.75 0.18 65)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: 'oklch(0.75 0.18 65)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
