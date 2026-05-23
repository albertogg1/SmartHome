'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  AlertTriangle,
  Thermometer,
  WifiOff,
  Droplets,
  Check,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { alerts, type Alert } from '@/lib/mock-data'

const alertIcons = {
  high_temp: Thermometer,
  low_temp: Thermometer,
  sensor_offline: WifiOff,
  humidity_alert: Droplets,
}

const severityColors = {
  critical: 'border-l-destructive bg-destructive/5',
  warning: 'border-l-warning bg-warning/5',
  info: 'border-l-primary bg-primary/5',
}

const severityIconColors = {
  critical: 'text-destructive',
  warning: 'text-warning',
  info: 'text-primary',
}

export function AlertsSection() {
  const [alertData, setAlertData] = React.useState<Alert[]>(alerts)

  const acknowledgeAlert = (alertId: string) => {
    setAlertData((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }

  const dismissAlert = (alertId: string) => {
    setAlertData((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const unacknowledgedAlerts = alertData.filter((a) => !a.acknowledged)
  const acknowledgedAlerts = alertData.filter((a) => a.acknowledged)

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold lg:text-lg">
            Alertas Recientes
          </CardTitle>
          {unacknowledgedAlerts.length > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unacknowledgedAlerts.length}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {alertData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <Check className="h-6 w-6 text-success" />
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No hay alertas activas
            </p>
          </div>
        ) : (
          <>
            {unacknowledgedAlerts.map((alert) => {
              const Icon = alertIcons[alert.type]
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'rounded-lg border-l-4 p-3 transition-all',
                    severityColors[alert.severity]
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        alert.severity === 'critical'
                          ? 'bg-destructive/10'
                          : alert.severity === 'warning'
                          ? 'bg-warning/10'
                          : 'bg-primary/10'
                      )}
                    >
                      <Icon
                        className={cn('h-4 w-4', severityIconColors[alert.severity])}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.sensorName} •{' '}
                        {formatDistanceToNow(alert.timestamp, {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-success"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Confirmar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Descartar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {acknowledgedAlerts.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Confirmadas
                </p>
                {acknowledgedAlerts.map((alert) => {
                  const Icon = alertIcons[alert.type]
                  return (
                    <div
                      key={alert.id}
                      className="flex items-center gap-3 rounded-lg bg-muted/30 p-2 opacity-60"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-xs text-muted-foreground">
                        {alert.message}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
