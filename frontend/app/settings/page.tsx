'use client'

import * as React from 'react'
import {
  Server,
  Wifi,
  Bell,
  Users,
  Shield,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  lastAccess: Date
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@smarthome.local',
    role: 'admin',
    lastAccess: new Date(),
  },
  {
    id: '2',
    name: 'Usuario Casa',
    email: 'user@smarthome.local',
    role: 'user',
    lastAccess: new Date(Date.now() - 86400000),
  },
]

export default function SettingsPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showApiKey, setShowApiKey] = React.useState(false)
  const [users, setUsers] = React.useState<User[]>(initialUsers)
  const [saved, setSaved] = React.useState(false)

  // API Settings
  const [apiSettings, setApiSettings] = React.useState({
    baseUrl: 'https://api.smarthome.local',
    apiKey: 'sk-xxxxxxxxxxxxxxxxxxxx',
    refreshInterval: 30,
    enableCache: true,
  })

  // MQTT Settings
  const [mqttSettings, setMqttSettings] = React.useState({
    broker: '192.168.1.100',
    port: '1883',
    username: 'mqtt_user',
    password: 'mqtt_password',
    useTLS: false,
    clientId: 'smart-home-monitor',
  })

  // Alert Settings
  const [alertSettings, setAlertSettings] = React.useState({
    highTempThreshold: 28,
    lowTempThreshold: 15,
    highHumidityThreshold: 70,
    lowHumidityThreshold: 30,
    enableEmailAlerts: true,
    enablePushAlerts: true,
    enableSoundAlerts: false,
    alertEmail: 'alerts@example.com',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Configuración
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestiona la configuración del sistema de monitorización
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="api" className="gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="mqtt" className="gap-2">
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">MQTT</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usuarios</span>
          </TabsTrigger>
        </TabsList>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Configuración API
              </CardTitle>
              <CardDescription>
                Configura la conexión con el backend FastAPI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="api-url">URL Base de la API</Label>
                  <Input
                    id="api-url"
                    value={apiSettings.baseUrl}
                    onChange={(e) =>
                      setApiSettings((prev) => ({ ...prev, baseUrl: e.target.value }))
                    }
                    placeholder="https://api.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiSettings.apiKey}
                      onChange={(e) =>
                        setApiSettings((prev) => ({ ...prev, apiKey: e.target.value }))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Intervalo de actualización</Label>
                    <span className="text-sm text-muted-foreground">
                      {apiSettings.refreshInterval} segundos
                    </span>
                  </div>
                  <Slider
                    value={[apiSettings.refreshInterval]}
                    onValueChange={([value]) =>
                      setApiSettings((prev) => ({ ...prev, refreshInterval: value }))
                    }
                    min={5}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="cache">Habilitar caché</Label>
                    <p className="text-xs text-muted-foreground">
                      Almacena datos localmente para mejorar el rendimiento
                    </p>
                  </div>
                  <Switch
                    id="cache"
                    checked={apiSettings.enableCache}
                    onCheckedChange={(checked) =>
                      setApiSettings((prev) => ({ ...prev, enableCache: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MQTT Settings */}
        <TabsContent value="mqtt" className="space-y-6">
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                Configuración MQTT
              </CardTitle>
              <CardDescription>
                Configura la conexión con el broker MQTT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mqtt-broker">Dirección del Broker</Label>
                  <Input
                    id="mqtt-broker"
                    value={mqttSettings.broker}
                    onChange={(e) =>
                      setMqttSettings((prev) => ({ ...prev, broker: e.target.value }))
                    }
                    placeholder="192.168.1.100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mqtt-port">Puerto</Label>
                  <Input
                    id="mqtt-port"
                    value={mqttSettings.port}
                    onChange={(e) =>
                      setMqttSettings((prev) => ({ ...prev, port: e.target.value }))
                    }
                    placeholder="1883"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mqtt-user">Usuario</Label>
                  <Input
                    id="mqtt-user"
                    value={mqttSettings.username}
                    onChange={(e) =>
                      setMqttSettings((prev) => ({ ...prev, username: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mqtt-pass">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="mqtt-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={mqttSettings.password}
                      onChange={(e) =>
                        setMqttSettings((prev) => ({ ...prev, password: e.target.value }))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input
                  id="client-id"
                  value={mqttSettings.clientId}
                  onChange={(e) =>
                    setMqttSettings((prev) => ({ ...prev, clientId: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label htmlFor="tls">Usar TLS/SSL</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Habilita conexión segura con el broker
                  </p>
                </div>
                <Switch
                  id="tls"
                  checked={mqttSettings.useTLS}
                  onCheckedChange={(checked) =>
                    setMqttSettings((prev) => ({ ...prev, useTLS: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Settings */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Umbrales de Alerta
              </CardTitle>
              <CardDescription>
                Configura los límites para las alertas automáticas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Temperatura</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Umbral alto</Label>
                      <span className="text-sm font-medium text-destructive">
                        {alertSettings.highTempThreshold}°C
                      </span>
                    </div>
                    <Slider
                      value={[alertSettings.highTempThreshold]}
                      onValueChange={([value]) =>
                        setAlertSettings((prev) => ({ ...prev, highTempThreshold: value }))
                      }
                      min={20}
                      max={40}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Umbral bajo</Label>
                      <span className="text-sm font-medium text-chart-1">
                        {alertSettings.lowTempThreshold}°C
                      </span>
                    </div>
                    <Slider
                      value={[alertSettings.lowTempThreshold]}
                      onValueChange={([value]) =>
                        setAlertSettings((prev) => ({ ...prev, lowTempThreshold: value }))
                      }
                      min={0}
                      max={20}
                      step={1}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Humedad</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Umbral alto</Label>
                      <span className="text-sm font-medium text-destructive">
                        {alertSettings.highHumidityThreshold}%
                      </span>
                    </div>
                    <Slider
                      value={[alertSettings.highHumidityThreshold]}
                      onValueChange={([value]) =>
                        setAlertSettings((prev) => ({
                          ...prev,
                          highHumidityThreshold: value,
                        }))
                      }
                      min={50}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Umbral bajo</Label>
                      <span className="text-sm font-medium text-chart-1">
                        {alertSettings.lowHumidityThreshold}%
                      </span>
                    </div>
                    <Slider
                      value={[alertSettings.lowHumidityThreshold]}
                      onValueChange={([value]) =>
                        setAlertSettings((prev) => ({
                          ...prev,
                          lowHumidityThreshold: value,
                        }))
                      }
                      min={0}
                      max={50}
                      step={5}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Elige cómo recibir las alertas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Alertas por email</Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe notificaciones en tu correo
                  </p>
                </div>
                <Switch
                  id="email-alerts"
                  checked={alertSettings.enableEmailAlerts}
                  onCheckedChange={(checked) =>
                    setAlertSettings((prev) => ({ ...prev, enableEmailAlerts: checked }))
                  }
                />
              </div>

              {alertSettings.enableEmailAlerts && (
                <div className="space-y-2 pl-4">
                  <Label htmlFor="alert-email">Email de alertas</Label>
                  <Input
                    id="alert-email"
                    type="email"
                    value={alertSettings.alertEmail}
                    onChange={(e) =>
                      setAlertSettings((prev) => ({ ...prev, alertEmail: e.target.value }))
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="push-alerts">Notificaciones push</Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe alertas en tu navegador
                  </p>
                </div>
                <Switch
                  id="push-alerts"
                  checked={alertSettings.enablePushAlerts}
                  onCheckedChange={(checked) =>
                    setAlertSettings((prev) => ({ ...prev, enablePushAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-alerts">Alertas sonoras</Label>
                  <p className="text-xs text-muted-foreground">
                    Reproduce un sonido con cada alerta
                  </p>
                </div>
                <Switch
                  id="sound-alerts"
                  checked={alertSettings.enableSoundAlerts}
                  onCheckedChange={(checked) =>
                    setAlertSettings((prev) => ({ ...prev, enableSoundAlerts: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border-border/50 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription>
                  Administra los usuarios que tienen acceso al sistema
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Añadir Usuario
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead className="hidden sm:table-cell">Último acceso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-border/50">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            user.role === 'admin'
                              ? 'border-primary/50 text-primary'
                              : user.role === 'user'
                              ? 'border-chart-2/50 text-chart-2'
                              : 'border-muted-foreground/50 text-muted-foreground'
                          )}
                        >
                          {user.role === 'admin'
                            ? 'Administrador'
                            : user.role === 'user'
                            ? 'Usuario'
                            : 'Visor'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {user.lastAccess.toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteUser(user.id)}
                          disabled={user.role === 'admin'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
