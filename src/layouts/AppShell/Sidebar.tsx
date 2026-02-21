import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/shared/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible'
import { cn } from '@/shared/utils/cn'
import type { SidebarItem } from './types'
import { iconMap } from './navConfig'

const POPOVER_GAP = 4
const POPOVER_CLOSE_DELAY = 120

function isPathActive(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(path + '/')
}

const triggerClass = cn(
  "flex h-8 min-h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,padding] duration-200 ease-linear",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
  "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2",
  "group-data-[collapsible=icon]:[&>span]:hidden group-data-[collapsible=icon]:[&>svg:last-of-type]:hidden",
  "[&>svg]:size-4 [&>svg]:shrink-0 [&>span]:min-w-0 [&>span]:truncate [&>span]:whitespace-nowrap"
)

/** 收缩状态下带弹出菜单的一级项按钮：仅图标+无障碍文案，左对齐与无子菜单项一致 */
const collapsedPopoverTriggerClass = cn(
  "flex size-8 shrink-0 items-center justify-start overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,padding] duration-200 ease-linear",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
  "[&>svg]:size-4 [&>svg]:shrink-0"
)

/** 收缩状态下：带子菜单的一级项悬停时在右侧弹出二级菜单 */
function CollapsedMenuWithPopover({
  item,
  pathname,
}: {
  item: SidebarItem
  pathname: string
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const Icon = item.icon ? iconMap[item.icon] : null
  const children = item.children ?? []

  const openPopover = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    const el = triggerRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      setPosition({ top: rect.top, left: rect.right + POPOVER_GAP })
      setOpen(true)
    }
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => setOpen(false), POPOVER_CLOSE_DELAY)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  return (
    <>
      <div
        className="relative flex h-8 w-full min-w-8 items-center justify-start"
        onMouseEnter={openPopover}
        onMouseLeave={scheduleClose}
      >
        <button
          ref={triggerRef}
          type="button"
          className={collapsedPopoverTriggerClass}
          title={item.label}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {Icon && <Icon className="size-4 shrink-0" />}
          <span className="sr-only">{item.label}</span>
        </button>
      </div>
      {open &&
        createPortal(
          <div
            className="z-[100] min-w-[180px] rounded-md border border-border bg-white py-1 text-foreground shadow-lg"
            style={{ position: 'fixed', top: position.top, left: position.left }}
            role="menu"
            aria-label={item.label}
            onMouseEnter={cancelClose}
            onMouseLeave={() => {
              cancelClose()
              setOpen(false)
            }}
          >
            {children.map((child) => {
              const ChildIcon = child.icon ? iconMap[child.icon] : null
              const active = isPathActive(pathname, child.path)
              return (
                <div key={child.id} role="menuitem">
                  <NavLink
                    to={child.path}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm text-foreground outline-hidden transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                      active && 'bg-muted'
                    )}
                  >
                    {ChildIcon && <ChildIcon className="size-4 shrink-0" />}
                    <span>{child.label}</span>
                  </NavLink>
                </div>
              )
            })}
          </div>,
          document.body
        )}
    </>
  )
}

function SidebarNavGroup({
  item,
  pathname,
  open,
  onOpenChange,
}: {
  item: SidebarItem
  pathname: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { state: sidebarState } = useSidebar()
  const hasChildren = item.children && item.children.length > 0
  const isCollapsed = sidebarState === 'collapsed'

  if (isCollapsed && hasChildren) {
    return (
      <SidebarMenuItem>
        <CollapsedMenuWithPopover item={item} pathname={pathname} />
      </SidebarMenuItem>
    )
  }

  const Icon = item.icon ? iconMap[item.icon] : null

  return (
    <SidebarMenuItem>
      <Collapsible open={open} onOpenChange={onOpenChange} className="group/collapsible">
        <CollapsibleTrigger className={triggerClass}>
          {Icon && <Icon className="size-4 shrink-0" />}
          <span>{item.label}</span>
          <ChevronDown className="ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => {
              const ChildIcon = child.icon ? iconMap[child.icon] : null
              return (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isPathActive(pathname, child.path)}
                  >
                    <NavLink to={child.path}>
                      {ChildIcon && <ChildIcon className="size-4 shrink-0" />}
                      <span>{child.label}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

interface SidebarProps {
  items: SidebarItem[]
}

/** 当前展开的一级菜单 id，同一时间只允许一个 */
function useOpenGroupId(items: SidebarItem[], pathname: string) {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null)

  useEffect(() => {
    const id =
      items.find(
        (item) =>
          item.children?.length &&
          (isPathActive(pathname, item.path) ||
            item.children.some((c) => isPathActive(pathname, c.path)))
      )?.id ?? null
    setOpenGroupId((prev) => (id != null ? id : prev))
  }, [pathname, items])

  return [openGroupId, setOpenGroupId] as const
}

export default function AppShellSidebar({ items }: SidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const { state } = useSidebar()
  const [openGroupId, setOpenGroupId] = useOpenGroupId(items, pathname)

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="min-w-0 border-b border-sidebar-border">
        <span className="flex min-w-0 items-center font-semibold" title={state === 'collapsed' ? 'WMS' : 'WMS Demo'}>
          <span className="shrink-0">WMS</span>
          {state !== 'collapsed' && (
            <>
              <span className="shrink-0" aria-hidden="true">{'\u00A0'}</span>
              <span className="min-w-0 truncate whitespace-nowrap">Demo</span>
            </>
          )}
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <SidebarNavGroup
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    open={openGroupId === item.id}
                    onOpenChange={(open) => setOpenGroupId(open ? item.id : null)}
                  />
                )
              }
              const Icon = item.icon ? iconMap[item.icon] : null
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isPathActive(pathname, item.path)}
                    tooltip={item.label}
                  >
                    <NavLink to={item.path} end={item.path !== '/'}>
                      {Icon && <Icon className="size-4 shrink-0" />}
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto flex flex-row justify-start border-t border-sidebar-border">
        <SidebarTrigger className="size-7 shrink-0" />
      </SidebarFooter>
    </Sidebar>
  )
}
