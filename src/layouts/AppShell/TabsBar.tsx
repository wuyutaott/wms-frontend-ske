import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const TAB_BAR_HEIGHT = 40
const MORE_BUTTON_WIDTH = 48
const GAP_PX = 2
const HORIZONTAL_PADDING = 8

interface TabsBarProps {
  openTabs: string[]
  onCloseTab: (path: string) => void
  pathToLabel: Record<string, string>
}

function getTabLabel(path: string, pathToLabel: Record<string, string>) {
  if (path === '/') return '首页'
  return pathToLabel[path] ?? path
}

function TabButton({
  path,
  label,
  isActive,
  onSelect,
  onClose,
  className,
  ...rest
}: {
  path: string
  label: string
  isActive: boolean
  onSelect: () => void
  onClose: (e: React.MouseEvent) => void
  className?: string
} & React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-t-md px-3 py-1.5 text-sm transition-colors whitespace-nowrap',
        isActive
          ? 'bg-white text-foreground shadow-sm'
          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        className
      )}
      {...rest}
    >
      <span className="truncate">{label}</span>
      <span
        role="button"
        tabIndex={-1}
        aria-label="关闭"
        onClick={(e) => {
          e.stopPropagation()
          onClose(e)
        }}
        onKeyDown={(e) => e.key === 'Enter' && onClose(e as unknown as React.MouseEvent)}
        className="rounded p-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shrink-0"
      >
        <X className="size-3.5" />
      </span>
    </button>
  )
}

export default function TabsBar({ openTabs, onCloseTab, pathToLabel }: TabsBarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const tabsToShow = useMemo(() => openTabs.filter((p) => p !== '/'), [openTabs])
  // 按打开顺序排列，不排序：最新打开的在最右侧
  const tabOrder = tabsToShow

  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [visibleTabs, setVisibleTabs] = useState<string[]>([])
  const [overflowTabs, setOverflowTabs] = useState<string[]>([])
  const [moreOpen, setMoreOpen] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })

  const scheduleClose = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => setMoreOpen(false), 150)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  const updateVisibleOverflow = useCallback(() => {
    const container = containerRef.current
    const measureRow = measureRef.current
    if (!container || !measureRow || tabOrder.length === 0) {
      setVisibleTabs(tabOrder)
      setOverflowTabs([])
      return
    }

    const containerRect = container.getBoundingClientRect()
    const availableWidth =
      containerRect.width - MORE_BUTTON_WIDTH - HORIZONTAL_PADDING * 2
    const children = measureRow.children
    if (children.length === 0) {
      setVisibleTabs(tabOrder)
      setOverflowTabs([])
      return
    }

    const getTabWidth = (index: number) =>
      (children[index] as HTMLElement).getBoundingClientRect().width + GAP_PX

    // 第一轮：按打开顺序从左到右填满，得到默认的 visible / overflow
    let used = 0
    const defaultVisible: string[] = []
    for (let i = 0; i < tabOrder.length; i++) {
      const w = getTabWidth(i)
      if (defaultVisible.length > 0 && used + w > availableWidth) break
      defaultVisible.push(tabOrder[i])
      used += w
    }
    const defaultOverflow = tabOrder.filter((p) => !defaultVisible.includes(p))

    // 若当前页已在可见区：不做任何位置移动，保持默认划分
    if (defaultVisible.includes(currentPath)) {
      setVisibleTabs(defaultVisible)
      setOverflowTabs(defaultOverflow)
      return
    }

    // 当前页在折叠区（新打开的 tab 或从折叠菜单选中的页）：把当前页放到可见区最后一个，原最后一个可见进折叠
    const currentIndex = tabOrder.indexOf(currentPath)
    if (currentIndex < 0) {
      setVisibleTabs(defaultVisible)
      setOverflowTabs(defaultOverflow)
      return
    }
    const currentWidth = getTabWidth(currentIndex)
    const availableForLeft = availableWidth - currentWidth
    const leftTabs: string[] = []
    let usedLeft = 0
    for (let i = 0; i < tabOrder.length; i++) {
      if (tabOrder[i] === currentPath) continue
      const w = getTabWidth(i)
      if (usedLeft + w > availableForLeft) break
      leftTabs.push(tabOrder[i])
      usedLeft += w
    }
    const visible = [...leftTabs, currentPath]
    setVisibleTabs(visible)
    setOverflowTabs(tabOrder.filter((p) => !visible.includes(p)))
  }, [tabOrder, currentPath])

  useEffect(() => {
    updateVisibleOverflow()
  }, [updateVisibleOverflow, tabsToShow])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(updateVisibleOverflow)
    ro.observe(el)
    return () => ro.disconnect()
  }, [updateVisibleOverflow])

  const handleTabClick = useCallback(
    (path: string) => {
      navigate(path)
      setMoreOpen(false)
    },
    [navigate]
  )

  /** 从折叠菜单选中：导航后由 updateVisibleOverflow 根据「当前页在折叠区」自动把该 tab 放到可见区最后 */
  const handleOverflowTabSelect = useCallback(
    (path: string) => {
      navigate(path)
      setMoreOpen(false)
    },
    [navigate]
  )

  const handleClose = useCallback(
    (e: React.MouseEvent, path: string) => {
      e.stopPropagation()
      onCloseTab(path)
      setMoreOpen(false)
    },
    [onCloseTab]
  )

  const isMoreActive = overflowTabs.includes(currentPath)

  // 下拉用 Portal 挂到 body，避免被顶部栏的 overflow-hidden 裁剪；根据按钮位置定位
  const updateDropdownPosition = useCallback(() => {
    const btn = moreButtonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    setDropdownPosition({ top: rect.bottom + 2, right: window.innerWidth - rect.right })
  }, [])

  useEffect(() => {
    if (!moreOpen) return
    updateDropdownPosition()
    const onScrollOrResize = () => updateDropdownPosition()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [moreOpen, updateDropdownPosition])

  if (tabsToShow.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="relative flex shrink-0 items-stretch overflow-hidden border-b border-sidebar-border"
      style={{ minHeight: TAB_BAR_HEIGHT, maxHeight: TAB_BAR_HEIGHT }}
    >
      {/* 隐藏的测量行：与可见 Tab 同结构同样式，用于计算宽度 */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-0.5"
        style={{ visibility: 'hidden' }}
      >
        {tabOrder.map((path) => (
          <TabButton
            key={path}
            path={path}
            label={getTabLabel(path, pathToLabel)}
            isActive={currentPath === path}
            onSelect={() => {}}
            onClose={() => {}}
          />
        ))}
      </div>

      {/* 可见 Tab 区域：单行不换行，超出隐藏；无垂直 padding，贴底 */}
      <div className="flex min-w-0 flex-1 items-stretch gap-0.5 overflow-hidden px-2">
        {visibleTabs.map((path) => (
          <TabButton
            key={path}
            path={path}
            label={getTabLabel(path, pathToLabel)}
            isActive={currentPath === path}
            onSelect={() => handleTabClick(path)}
            onClose={(e) => handleClose(e, path)}
          />
        ))}
      </div>

      {/* 右侧「更多」按钮：有折叠项时显示 */}
      {overflowTabs.length > 0 && (
        <div className="flex shrink-0 items-center">
          <button
            ref={moreButtonRef}
            type="button"
            onClick={() => {
              cancelClose()
              const nextOpen = !moreOpen
              if (nextOpen) updateDropdownPosition()
              setMoreOpen(nextOpen)
            }}
            onBlur={scheduleClose}
            onMouseEnter={() => { cancelClose(); setMoreOpen(true) }}
            onMouseLeave={scheduleClose}
            className={cn(
              'flex h-full w-12 items-center justify-center rounded-t-md text-sm transition-colors',
              isMoreActive
                ? 'bg-white text-foreground shadow-sm'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
          >
            <ChevronDown className="size-4" />
          </button>

          {moreOpen &&
            createPortal(
              <div
                className="fixed z-[100] min-w-[180px] rounded-md border border-border bg-white py-1 text-foreground shadow-lg"
                style={{ top: dropdownPosition.top, right: dropdownPosition.right }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                role="menu"
              >
                {overflowTabs.map((path) => {
                  const isActive = currentPath === path
                  return (
                    <div
                      key={path}
                      role="menuitem"
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm',
                        isActive
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted'
                      )}
                      onClick={() => handleOverflowTabSelect(path)}
                    >
                      <span className="truncate">{getTabLabel(path, pathToLabel)}</span>
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="关闭"
                        className="rounded p-0.5 hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClose(e, path)
                        }}
                      >
                        <X className="size-3.5" />
                      </span>
                    </div>
                  )
                })}
              </div>,
              document.body
            )}
        </div>
      )}
    </div>
  )
}
