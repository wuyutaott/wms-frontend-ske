import { useNavigate, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface TabsBarProps {
  openTabs: string[]
  onCloseTab: (path: string) => void
  pathToLabel: Record<string, string>
}

export default function TabsBar({ openTabs, onCloseTab, pathToLabel }: TabsBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  function handleTabClick(path: string) {
    navigate(path)
  }

  function handleClose(e: React.MouseEvent, path: string) {
    e.stopPropagation()
    onCloseTab(path)
  }

  function getTabLabel(path: string) {
    if (path === '/') return '首页'
    return pathToLabel[path] ?? path
  }

  // 不展示根路径 "/" 的 Tab，避免出现只显示 "/" 的异常 Tab
  const tabsToShow = openTabs.filter((p) => p !== '/')
  if (tabsToShow.length === 0) return null

  return (
    <div className="flex shrink-0 items-center gap-0.5 border-b border-sidebar-border px-2 py-1">
      {tabsToShow.map((path) => {
        const isActive = currentPath === path
        return (
          <button
            key={path}
            type="button"
            onClick={() => handleTabClick(path)}
            className={cn(
              'flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-sm transition-colors',
              isActive
                ? 'bg-white text-foreground shadow-sm'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <span>{getTabLabel(path)}</span>
            <span
              role="button"
              tabIndex={0}
              aria-label="关闭"
              onClick={(e) => handleClose(e, path)}
              onKeyDown={(e) => e.key === 'Enter' && handleClose(e as unknown as React.MouseEvent, path)}
              className="rounded p-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <X className="size-3.5" />
            </span>
          </button>
        )
      })}
    </div>
  )
}
