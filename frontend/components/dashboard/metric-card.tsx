'use client'

import {
  Thermometer,
  Droplets,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  icon: 'temperature' | 'humidity' | 'max' | 'min' | 'status'
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  status?: 'online' | 'offline'
}

const icons = {
  temperature: Thermometer,
  humidity: Droplets,
  max: TrendingUp,
  min: TrendingDown,
  status: Activity,
}

const iconColors = {
  temperature: 'text-primary',
  humidity: 'text-chart-2',
  max: 'text-destructive',
  min: 'text-chart-1',
  status: 'text-success',
}

const bgColors = {
  temperature: 'bg-primary/10',
  humidity: 'bg-chart-2/10',
  max: 'bg-destructive/10',
  min: 'bg-chart-1/10',
  status: 'bg-success/10',
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  status,
}: MetricCardProps) {
  const Icon = icons[icon]

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card transition-all hover:border-border hover:shadow-lg">
      {/* Background watermark icon — mobile only */}
      <div className="pointer-events-none absolute bottom-0 right-0 p-2 lg:hidden">
        <Icon className={cn('h-14 w-14 opacity-[0.07]', iconColors[icon])} />
      </div>
      <CardContent className="relative z-10 p-3 lg:p-6">
        <div className="flex items-start justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground lg:text-xs">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground lg:text-3xl">
                {value}
              </span>
              {unit && (
                <span className="text-sm font-medium text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
            {trend && trendValue && (
              <div className="flex items-center gap-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-destructive" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-3 w-3 text-success" />
                ) : null}
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend === 'up' ? 'text-destructive' : 'text-success'
                  )}
                >
                  {trendValue}
                </span>
              </div>
            )}
            {status && (
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    status === 'online' ? 'bg-success animate-pulse' : 'bg-destructive'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    status === 'online' ? 'text-success' : 'text-destructive'
                  )}
                >
                  {status === 'online' ? 'En línea' : 'Sin conexión'}
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'hidden shrink-0 items-center justify-center rounded-xl lg:flex lg:h-12 lg:w-12',
              bgColors[icon]
            )}
          >
            <Icon className={cn('lg:h-6 lg:w-6', iconColors[icon])} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
