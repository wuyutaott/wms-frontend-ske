import { useState } from 'react'
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

function SidebarNavGroup({
  item,
  pathname,
}: {
  item: SidebarItem
  pathname: string
}) {
  const hasActiveChild =
    item.children?.some((c) => isPathActive(pathname, c.path)) ?? false
  const [open, setOpen] = useState(hasActiveChild || isPathActive(pathname, item.path))
  const Icon = item.icon ? iconMap[item.icon] : null

  return (
    <SidebarMenuItem>
      <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
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

export default function AppShellSidebar({ items }: SidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const { state } = useSidebar()

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
