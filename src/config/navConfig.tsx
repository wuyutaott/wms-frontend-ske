import type { ComponentType } from 'react'
import type { TopModule, SidebarItem } from '../types/nav'
import {
  LayoutDashboard,
  Inbox,
  ScanBarcode,
  Package,
  Palette,
  Settings,
  FileText,
} from 'lucide-react'

export const topModules: TopModule[] = [
  { id: 'home', label: '首页', path: '/dashboard' },
  { id: 'inbound', label: '入库管理', path: '/inbound' },
  { id: 'putaway', label: '上架管理', path: '/putaway' },
  { id: 'products', label: '新品维护', path: '/products' },
  { id: 'settings', label: '设置', path: '/settings' },
]

export function getTopModuleIdFromPath(pathname: string): string {
  if (pathname.startsWith('/inbound')) return 'inbound'
  if (pathname.startsWith('/putaway')) return 'putaway'
  if (pathname.startsWith('/products')) return 'products'
  if (pathname.startsWith('/settings')) return 'settings'
  return 'home'
}

export const sidebarByModule: Record<string, SidebarItem[]> = {
  home: [
    {
      id: 'dashboard',
      label: '工作台',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      children: [],
    },
  ],
  inbound: [
    {
      id: 'inbound-root',
      label: '入库',
      path: '/inbound',
      icon: 'Inbox',
      children: [
        { id: 'inbound-pending', label: '待处理', path: '/inbound/pending', icon: 'FileText' },
        { id: 'inbound-scan', label: '扫描入库', path: '/inbound/scan', icon: 'ScanBarcode' },
      ],
    },
  ],
  putaway: [
    {
      id: 'putaway-root',
      label: '上架',
      path: '/putaway',
      icon: 'Package',
      children: [
        { id: 'putaway-tasks', label: '上架任务', path: '/putaway/tasks', icon: 'Palette' },
      ],
    },
  ],
  products: [
    {
      id: 'products-root',
      label: '商品',
      path: '/products',
      icon: 'Package',
      children: [
        { id: 'products-list', label: '商品列表', path: '/products/list', icon: 'FileText' },
      ],
    },
  ],
  settings: [
    {
      id: 'settings-root',
      label: '系统',
      path: '/settings',
      icon: 'Settings',
      children: [],
    },
  ],
}

export const iconMap: Record<string, ComponentType<{ className?: string; size?: number }>> = {
  LayoutDashboard,
  Inbox,
  ScanBarcode,
  Package,
  Palette,
  Settings,
  FileText,
}

/** 根据 path 返回 Tab 显示的标题（从侧栏配置收集） */
const pathLabelMap: Record<string, string> = {}
function buildPathLabelMap() {
  Object.values(sidebarByModule).flat().forEach((item) => {
    if (item.path) pathLabelMap[item.path] = item.label
    item.children?.forEach((c) => {
      if (c.path) pathLabelMap[c.path] = c.label
    })
  })
}
buildPathLabelMap()
export function getPathLabel(path: string): string {
  return pathLabelMap[path] ?? path
}
