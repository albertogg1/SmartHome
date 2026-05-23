'use client'

import * as React from 'react'
import { Moon, Sun, Wifi, WifiOff, User, Bell } from 'lucide-react'
import { useTheme } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  sidebarCollapsed: boolean
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [connectionStatus, setConnectionStatus] = React.useState<'connected' | 'disconnected'>('connected')

  // Simulate connection status changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      // 95% chance of being connected
      setConnectionStatus(Math.random() > 0.05 ? 'connected' : 'disconnected')
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header
      className={`fixed right-0 top-0 z-40 isolate flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-lg transition-all duration-300 lg:px-6 ${
        sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'
      } left-0`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">SH</span>
          </div>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-foreground">Smart Home Monitor</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Connection Status */}
        <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 sm:flex">
          {connectionStatus === 'connected' ? (
            <>
              <Wifi className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-success">MQTT Conectado</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">Desconectado</span>
            </>
          )}
        </div>

        {/* Mobile connection indicator */}
        <div className="flex items-center sm:hidden">
          {connectionStatus === 'connected' ? (
            <Wifi className="h-5 w-5 text-success" />
          ) : (
            <WifiOff className="h-5 w-5 text-destructive" />
          )}
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
            3
          </Badge>
          <span className="sr-only">Notificaciones</span>
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <span className="mr-2">💻</span>
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
