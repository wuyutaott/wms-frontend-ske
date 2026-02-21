import type { ComponentType } from 'react'
import type { SidebarItem } from './types'
import {
  LayoutDashboard,
  Inbox,
  ScanBarcode,
  Package,
  Palette,
  FileText,
} from 'lucide-react'

export const iconMap: Record<string, ComponentType<{ className?: string; size?: number }>> = {
  LayoutDashboard,
  Inbox,
  ScanBarcode,
  Package,
  Palette,
  FileText,
}

export const mainMenuItems: SidebarItem[] = [
  { id: 'home', label: '首页', path: '/dashboard', icon: 'LayoutDashboard', children: [] },
  {
    id: 'inbound',
    label: '入库',
    path: '/inbound',
    icon: 'Inbox',
    children: [
      { id: 'arrival-scan', label: '到仓扫描', path: '/inbound/scan', icon: 'ScanBarcode' },
      { id: 'inbound-mgmt', label: '入库管理', path: '/inbound/pending', icon: 'Inbox' },
      { id: 'putaway-mgmt', label: '上架管理', path: '/putaway/tasks', icon: 'Palette' },
      { id: 'product-mgmt', label: '新品维护', path: '/products/list', icon: 'Package' },
      { id: 'inbound-claim', label: '入库认领', path: '/inbound/claim', icon: 'FileText' },
    ],
  },
  {
    id: 'outbound',
    label: '出库',
    path: '/outbound',
    icon: 'Package',
    children: [
      { id: 'one-click', label: '一件代发', path: '/outbound/one-click', icon: 'FileText' },
      { id: 'stock-transfer', label: '备货中转', path: '/outbound/stock-transfer', icon: 'FileText' },
      { id: 'wave', label: '波次管理', path: '/outbound/wave', icon: 'FileText' },
      { id: 'second-sort', label: '二次分拣', path: '/outbound/second-sort', icon: 'FileText' },
      { id: 'compound-check', label: '复合/验货', path: '/outbound/compound-check', icon: 'FileText' },
      { id: 'parcel-review', label: '包裹复核', path: '/outbound/parcel-review', icon: 'FileText' },
      { id: 'weigh', label: '承重', path: '/outbound/weigh', icon: 'FileText' },
      { id: 'relabel', label: '换标', path: '/outbound/relabel', icon: 'FileText' },
      { id: 'logistics-pack', label: '物流组包', path: '/outbound/logistics-pack', icon: 'FileText' },
      { id: 'change-order', label: '换单', path: '/outbound/change-order', icon: 'FileText' },
      { id: 'exception', label: '异常件', path: '/outbound/exception', icon: 'FileText' },
      { id: 'cutoff', label: '截单', path: '/outbound/cutoff', icon: 'FileText' },
    ],
  },
  { id: 'returns', label: '退件', path: '/returns', icon: 'Package', children: [] },
  { id: 'transfer', label: '转运', path: '/transfer', icon: 'Package', children: [] },
  { id: 'work-order', label: '工单', path: '/work-order', icon: 'FileText', children: [] },
  {
    id: 'reports',
    label: '报表',
    path: '/reports',
    icon: 'FileText',
    children: [
      { id: 'efficiency-board', label: '人效看板', path: '/reports/efficiency-board', icon: 'FileText' },
      { id: 'inbound-efficiency', label: '入库效率', path: '/reports/inbound-efficiency', icon: 'FileText' },
      { id: 'outbound-efficiency', label: '出库效率', path: '/reports/outbound-efficiency', icon: 'FileText' },
    ],
  },
  {
    id: 'fba-returns',
    label: 'FBA退货',
    path: '/fba-returns',
    icon: 'Package',
    children: [
      { id: 'fba-return-inbound', label: '退货入库', path: '/fba-returns/return-inbound', icon: 'FileText' },
      { id: 'fba-relabel-service', label: '换标服务', path: '/fba-returns/relabel-service', icon: 'FileText' },
      { id: 'fba-return-outbound', label: '退货出库', path: '/fba-returns/return-outbound', icon: 'FileText' },
    ],
  },
  {
    id: 'in-stock',
    label: '库内',
    path: '/in-stock',
    icon: 'Inbox',
    children: [
      { id: 'product-inventory', label: '产品库存', path: '/in-stock/product-inventory', icon: 'FileText' },
      { id: 'box-inventory', label: '箱库存', path: '/in-stock/box-inventory', icon: 'FileText' },
      { id: 'return-inventory', label: '退货库存', path: '/in-stock/return-inventory', icon: 'FileText' },
      { id: 'defective-handling', label: '次品处理', path: '/in-stock/defective-handling', icon: 'FileText' },
      { id: 'inventory-check', label: '盘点', path: '/in-stock/inventory-check', icon: 'FileText' },
    ],
  },
  {
    id: 'basic-data',
    label: '基础数据',
    path: '/basic-data',
    icon: 'FileText',
    children: [
      { id: 'basic-product', label: '产品', path: '/basic-data/product', icon: 'FileText' },
      { id: 'basic-warehouse-area', label: '库区', path: '/basic-data/warehouse-area', icon: 'FileText' },
      { id: 'basic-location', label: '库位', path: '/basic-data/location', icon: 'FileText' },
      { id: 'basic-packaging', label: '包材', path: '/basic-data/packaging', icon: 'FileText' },
      { id: 'basic-seeding-wall', label: '播种墙', path: '/basic-data/seeding-wall', icon: 'FileText' },
    ],
  },
]

export function buildPathToLabel(items: SidebarItem[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const item of items) {
    if (item.path) map[item.path] = item.label
    if (item.children?.length) {
      for (const c of item.children) {
        if (c.path) map[c.path] = c.label
      }
    }
  }
  return map
}
