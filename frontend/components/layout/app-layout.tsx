'use client'

import * as React from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { BottomNav } from './bottom-nav'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="min-h-screen w-full bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      
      <main
        className={cn(
          'min-h-screen relative z-0 pt-16 pb-20 transition-all duration-300 lg:pb-0',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
