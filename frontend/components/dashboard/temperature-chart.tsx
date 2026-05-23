'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { generateTemperatureHistory } from '@/lib/mock-data'

type TimeRange = '1h' | '24h' | '7d' | '30d'

const timeRanges: { value: TimeRange; label: string; hours: number }[] = [
  { value: '1h', label: '1H', hours: 1 },
  { value: '24h', label: '24H', hours: 24 },
  { value: '7d', label: '7D', hours: 168 },
  { value: '30d', label: '30D', hours: 720 },
]

export function TemperatureChart() {
  const [selectedRange, setSelectedRange] = React.useState<TimeRange>('24h')
  const [data, setData] = React.useState<ReturnType<typeof generateTemperatureHistory>>([])

  React.useEffect(() => {
    const range = timeRanges.find((r) => r.value === selectedRange)
    if (range) {
      setData(generateTemperatureHistory(range.hours))
    }
  }, [selectedRange])

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        if (prev.length === 0) return prev
        const newData = [...prev.slice(1)]
        const lastTemp = prev[prev.length - 1].temperature
        const newTemp = lastTemp + (Math.random() - 0.5) * 0.5
        newData.push({
          timestamp: new Date(),
          temperature: Math.round(newTemp * 10) / 10,
          humidity: Math.round(45 + Math.random() * 20),
          sensorId: 'sensor-1',
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatXAxis = (timestamp: Date) => {
    const date = new Date(timestamp)
    if (selectedRange === '1h' || selectedRange === '24h') {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
  }

  const chartData = data.map((d) => ({
    ...d,
    time: formatXAxis(d.timestamp),
  }))

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-semibold lg:text-lg">
          Historial de Temperatura
        </CardTitle>
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRange(range.value)}
              className={cn(
                'h-7 px-3 text-xs font-medium transition-all',
                selectedRange === range.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[250px] w-full lg:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.7 0.17 195)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.7 0.17 195)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.015 260)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="oklch(0.5 0 0)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="oklch(0.5 0 0)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.17 0.015 260)',
                  border: '1px solid oklch(0.25 0.015 260)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'oklch(0.65 0 0)' }}
                itemStyle={{ color: 'oklch(0.95 0 0)' }}
                formatter={(value: number) => [`${value}°C`, 'Temperatura']}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="oklch(0.7 0.17 195)"
                strokeWidth={2}
                fill="url(#tempGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: 'oklch(0.7 0.17 195)',
                  stroke: 'oklch(0.17 0.015 260)',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
