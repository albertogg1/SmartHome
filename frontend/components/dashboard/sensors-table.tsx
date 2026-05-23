'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { sensors, type Sensor } from '@/lib/mock-data'

export function SensorsTable() {
  const [sensorData, setSensorData] = React.useState<Sensor[]>(sensors)

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          temperature:
            sensor.status === 'online'
              ? Math.round((sensor.temperature + (Math.random() - 0.5) * 0.3) * 10) / 10
              : sensor.temperature,
          lastUpdate: sensor.status === 'online' ? new Date() : sensor.lastUpdate,
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold lg:text-lg">
          Sensores Activos
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="pl-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Sensor
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ubicación
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Temp.
                </TableHead>
                <TableHead className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                  Última act.
                </TableHead>
                <TableHead className="pr-6 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensorData.map((sensor) => (
                <TableRow
                  key={sensor.id}
                  className="border-border/50 transition-colors hover:bg-muted/50"
                >
                  <TableCell className="pl-6 font-medium text-foreground">
                    {sensor.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {sensor.location}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">
                      {sensor.temperature}°C
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {formatDistanceToNow(sensor.lastUpdate, {
                      addSuffix: true,
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Badge
                      variant={sensor.status === 'online' ? 'default' : 'destructive'}
                      className={cn(
                        'text-xs font-medium',
                        sensor.status === 'online'
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      )}
                    >
                      {sensor.status === 'online' ? 'En línea' : 'Sin conexión'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
