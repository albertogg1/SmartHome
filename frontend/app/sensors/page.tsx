'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Settings2,
  Wifi,
  WifiOff,
  Thermometer,
  Droplets,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { sensors as initialSensors, type Sensor } from '@/lib/mock-data'

const locations = [
  'Sala de estar',
  'Dormitorio principal',
  'Dormitorio secundario',
  'Cocina',
  'Baño principal',
  'Baño secundario',
  'Garaje',
  'Jardín',
  'Oficina',
  'Sótano',
]

export default function SensorsPage() {
  const [sensors, setSensors] = React.useState<Sensor[]>(initialSensors)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = React.useState(false)
  const [selectedSensor, setSelectedSensor] = React.useState<Sensor | null>(null)
  const [newSensor, setNewSensor] = React.useState({
    name: '',
    location: '',
    mqttTopic: '',
    wifiSSID: '',
  })

  const filteredSensors = sensors.filter(
    (sensor) =>
      sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddSensor = () => {
    const sensor: Sensor = {
      id: `sensor-${Date.now()}`,
      name: newSensor.name,
      location: newSensor.location,
      temperature: 20 + Math.random() * 5,
      humidity: 40 + Math.random() * 20,
      status: 'online',
      lastUpdate: new Date(),
      minTemp: 18,
      maxTemp: 25,
    }
    setSensors((prev) => [...prev, sensor])
    setNewSensor({ name: '', location: '', mqttTopic: '', wifiSSID: '' })
    setIsAddDialogOpen(false)
  }

  const handleEditSensor = () => {
    if (!selectedSensor) return
    setSensors((prev) =>
      prev.map((s) =>
        s.id === selectedSensor.id
          ? { ...s, name: selectedSensor.name, location: selectedSensor.location }
          : s
      )
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteSensor = (sensorId: string) => {
    setSensors((prev) => prev.filter((s) => s.id !== sensorId))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Sensores
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestiona y configura los sensores ESP32 de tu hogar
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Añadir Sensor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Sensor</DialogTitle>
              <DialogDescription>
                Configura un nuevo sensor ESP32 para tu hogar inteligente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del sensor</Label>
                <Input
                  id="name"
                  placeholder="Ej: Sensor Dormitorio"
                  value={newSensor.name}
                  onChange={(e) =>
                    setNewSensor((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Select
                  value={newSensor.location}
                  onValueChange={(value) =>
                    setNewSensor((prev) => ({ ...prev, location: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mqtt">Topic MQTT</Label>
                <Input
                  id="mqtt"
                  placeholder="home/sensors/temperature"
                  value={newSensor.mqttTopic}
                  onChange={(e) =>
                    setNewSensor((prev) => ({ ...prev, mqttTopic: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi">SSID WiFi</Label>
                <Input
                  id="wifi"
                  placeholder="Nombre de tu red WiFi"
                  value={newSensor.wifiSSID}
                  onChange={(e) =>
                    setNewSensor((prev) => ({ ...prev, wifiSSID: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSensor} disabled={!newSensor.name || !newSensor.location}>
                Añadir Sensor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar sensores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Sensors Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSensors.map((sensor) => (
          <Card
            key={sensor.id}
            className={cn(
              'border-border/50 bg-card transition-all hover:border-border hover:shadow-lg',
              sensor.status === 'offline' && 'opacity-75'
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">
                  {sensor.name}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {sensor.location}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedSensor(sensor)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedSensor(sensor)
                      setIsConfigDialogOpen(true)
                    }}
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    Configurar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteSensor(sensor.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Temperature & Humidity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Thermometer className="h-3 w-3" />
                    Temperatura
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {sensor.temperature.toFixed(1)}
                    <span className="text-sm font-normal text-muted-foreground">°C</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Droplets className="h-3 w-3" />
                    Humedad
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {sensor.humidity}
                    <span className="text-sm font-normal text-muted-foreground">%</span>
                  </p>
                </div>
              </div>

              {/* Min/Max */}
              <div className="flex items-center gap-4 rounded-lg bg-muted/30 px-3 py-2">
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs text-muted-foreground">Min. hoy</p>
                  <p className="text-sm font-semibold text-foreground">{sensor.minTemp}°C</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs text-muted-foreground">Máx. hoy</p>
                  <p className="text-sm font-semibold text-foreground">{sensor.maxTemp}°C</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Actualizado{' '}
                  {formatDistanceToNow(sensor.lastUpdate, {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
                <Badge
                  className={cn(
                    'gap-1 text-xs',
                    sensor.status === 'online'
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  )}
                >
                  {sensor.status === 'online' ? (
                    <Wifi className="h-3 w-3" />
                  ) : (
                    <WifiOff className="h-3 w-3" />
                  )}
                  {sensor.status === 'online' ? 'En línea' : 'Sin conexión'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Sensor</DialogTitle>
            <DialogDescription>
              Modifica los datos del sensor seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedSensor && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre del sensor</Label>
                <Input
                  id="edit-name"
                  value={selectedSensor.name}
                  onChange={(e) =>
                    setSelectedSensor((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Ubicación</Label>
                <Select
                  value={selectedSensor.location}
                  onValueChange={(value) =>
                    setSelectedSensor((prev) =>
                      prev ? { ...prev, location: value } : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSensor}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Config Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configuración MQTT/WiFi</DialogTitle>
            <DialogDescription>
              Configura los parámetros de conexión del sensor.
            </DialogDescription>
          </DialogHeader>
          {selectedSensor && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground">
                  {selectedSensor.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {selectedSensor.id}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Broker MQTT</Label>
                <Input defaultValue="mqtt://192.168.1.100:1883" />
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  defaultValue={`home/sensors/${selectedSensor.id}/temperature`}
                />
              </div>
              <div className="space-y-2">
                <Label>Intervalo de envío (segundos)</Label>
                <Input type="number" defaultValue="30" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsConfigDialogOpen(false)}>
              Guardar Configuración
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
