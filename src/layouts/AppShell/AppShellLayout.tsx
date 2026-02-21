import { useState, useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar'
import AppShellSidebar from './Sidebar'
import TabsBar from './TabsBar'
import { mainMenuItems, buildPathToLabel } from './navConfig'

export default function AppShellLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  const [openTabs, setOpenTabs] = useState<string[]>(['/dashboard'])

  const pathToLabel = useMemo(() => buildPathToLabel(mainMenuItems), [])

  useEffect(() => {
    setOpenTabs((tabs) => {
      // 从状态中移除根路径 "/"，避免出现只显示 "/" 的 Tab
      const withoutRoot = tabs.filter((p) => p !== '/')
      if (!pathname || pathname === '/' || withoutRoot.includes(pathname)) return withoutRoot
      return [...withoutRoot, pathname]
    })
  }, [pathname])

  function handleCloseTab(path: string) {
    const nextTabs = openTabs.filter((t) => t !== path)
    if (nextTabs.length === 0) return
    setOpenTabs(nextTabs)
    if (path === pathname) {
      const idx = openTabs.indexOf(path)
      const goTo = idx > 0 ? openTabs[idx - 1] : nextTabs[0]
      navigate(goTo)
    }
  }

  return (
    <SidebarProvider persistentSidebar>
      <AppShellSidebar items={mainMenuItems} />
      <SidebarInset>
        <header className="flex shrink-0 flex-col border-b border-sidebar-border bg-sidebar">
          <TabsBar openTabs={openTabs} onCloseTab={handleCloseTab} pathToLabel={pathToLabel} />
        </header>
        <main className="min-w-0 flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
