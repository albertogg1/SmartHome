'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { rooms, sensors } from '@/lib/mock-data'

export function HouseMap() {
  const getSensorForRoom = (sensorId?: string) => {
    if (!sensorId) return null
    return sensors.find((s) => s.id === sensorId)
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold lg:text-lg">
          Mapa del Hogar
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <TooltipProvider>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
            <svg viewBox="0 0 250 180" className="h-full w-full">
              {/* Background */}
              <rect
                x="5"
                y="5"
                width="240"
                height="170"
                rx="8"
                fill="oklch(0.22 0.015 260)"
                stroke="oklch(0.3 0.015 260)"
                strokeWidth="1"
              />

              {/* Rooms */}
              {rooms.map((room) => {
                const sensor = getSensorForRoom(room.sensorId)
                const isOnline = sensor?.status === 'online'

                return (
                  <Tooltip key={room.id}>
                    <TooltipTrigger asChild>
                      <g className="cursor-pointer transition-all hover:opacity-80">
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.width}
                          height={room.height}
                          rx="4"
                          fill={
                            isOnline
                              ? 'oklch(0.25 0.03 195 / 0.3)'
                              : 'oklch(0.25 0.03 25 / 0.3)'
                          }
                          stroke={
                            isOnline
                              ? 'oklch(0.7 0.17 195)'
                              : 'oklch(0.55 0.22 25)'
                          }
                          strokeWidth="1.5"
                          className="transition-all"
                        />
                        {/* Room name */}
                        <text
                          x={room.x + room.width / 2}
                          y={room.y + 16}
                          textAnchor="middle"
                          className="fill-muted-foreground text-[8px] font-medium"
                        >
                          {room.name}
                        </text>

                        {/* Temperature display */}
                        {sensor && (
                          <>
                            <text
                              x={room.x + room.width / 2}
                              y={room.y + room.height / 2 + 4}
                              textAnchor="middle"
                              className={cn(
                                'text-[14px] font-bold',
                                isOnline ? 'fill-primary' : 'fill-destructive'
                              )}
                            >
                              {sensor.temperature}°
                            </text>

                            {/* Status indicator */}
                            <circle
                              cx={room.x + room.width - 10}
                              cy={room.y + 10}
                              r="4"
                              fill={isOnline ? 'oklch(0.6 0.18 145)' : 'oklch(0.55 0.22 25)'}
                              className={isOnline ? 'animate-pulse' : ''}
                            />
                          </>
                        )}
                      </g>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="p-3">
                      <div className="space-y-1">
                        <p className="font-semibold">{room.name}</p>
                        {sensor ? (
                          <>
                            <p className="text-xs text-muted-foreground">
                              Temperatura: {sensor.temperature}°C
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Humedad: {sensor.humidity}%
                            </p>
                            <p
                              className={cn(
                                'text-xs font-medium',
                                isOnline ? 'text-success' : 'text-destructive'
                              )}
                            >
                              {isOnline ? 'En línea' : 'Sin conexión'}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Sin sensor asignado
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </svg>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
