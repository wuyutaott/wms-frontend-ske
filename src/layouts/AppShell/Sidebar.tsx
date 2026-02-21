import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
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
  "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding]",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
  "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2",
  "[&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate"
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

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <span className="font-semibold">WMS Demo</span>
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
      <SidebarRail />
    </Sidebar>
  )
}
