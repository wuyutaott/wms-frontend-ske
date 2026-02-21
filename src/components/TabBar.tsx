import { useNavigate, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabBarProps {
  openTabs: string[]
  onCloseTab: (path: string) => void
  /** path -> 标签文案，用于 Tab 显示 */
  pathToLabel: Record<string, string>
}

export default function TabBar({ openTabs, onCloseTab, pathToLabel }: TabBarProps) {
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
    return pathToLabel[path] ?? path
  }

  if (openTabs.length === 0) return null

  return (
    <div className="flex shrink-0 items-center gap-0.5 border-b border-sidebar-border px-2 py-1">
      {openTabs.map((path) => {
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
