import { useState, useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'
import TabBar from '@/components/TabBar'
import type { SidebarItem } from '@/types/nav'

function buildPathToLabel(items: SidebarItem[]): Record<string, string> {
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

const mainMenuItems: SidebarItem[] = [
  { id: 'home', label: '首页', path: '/dashboard', icon: 'LayoutDashboard' as const, children: [] },
  {
    id: 'inbound',
    label: '入库',
    path: '/inbound',
    icon: 'Inbox' as const,
    children: [
      { id: 'arrival-scan', label: '到仓扫描', path: '/inbound/scan', icon: 'ScanBarcode' as const },
      { id: 'inbound-mgmt', label: '入库管理', path: '/inbound/pending', icon: 'Inbox' as const },
      { id: 'putaway-mgmt', label: '上架管理', path: '/putaway/tasks', icon: 'Palette' as const },
      { id: 'product-mgmt', label: '新品维护', path: '/products/list', icon: 'Package' as const },
      { id: 'inbound-claim', label: '入库认领', path: '/inbound/claim', icon: 'FileText' as const },
    ],
  },
  {
    id: 'outbound',
    label: '出库',
    path: '/outbound',
    icon: 'Package' as const,
    children: [
      { id: 'one-click', label: '一件代发', path: '/outbound/one-click', icon: 'FileText' as const },
      { id: 'stock-transfer', label: '备货中转', path: '/outbound/stock-transfer', icon: 'FileText' as const },
      { id: 'wave', label: '波次管理', path: '/outbound/wave', icon: 'FileText' as const },
      { id: 'second-sort', label: '二次分拣', path: '/outbound/second-sort', icon: 'FileText' as const },
      { id: 'compound-check', label: '复合/验货', path: '/outbound/compound-check', icon: 'FileText' as const },
      { id: 'parcel-review', label: '包裹复核', path: '/outbound/parcel-review', icon: 'FileText' as const },
      { id: 'weigh', label: '承重', path: '/outbound/weigh', icon: 'FileText' as const },
      { id: 'relabel', label: '换标', path: '/outbound/relabel', icon: 'FileText' as const },
      { id: 'logistics-pack', label: '物流组包', path: '/outbound/logistics-pack', icon: 'FileText' as const },
      { id: 'change-order', label: '换单', path: '/outbound/change-order', icon: 'FileText' as const },
      { id: 'exception', label: '异常件', path: '/outbound/exception', icon: 'FileText' as const },
      { id: 'cutoff', label: '截单', path: '/outbound/cutoff', icon: 'FileText' as const },
    ],
  },
  { id: 'returns', label: '退件', path: '/returns', icon: 'Package' as const, children: [] },
  { id: 'transfer', label: '转运', path: '/transfer', icon: 'Package' as const, children: [] },
  { id: 'work-order', label: '工单', path: '/work-order', icon: 'FileText' as const, children: [] },
  {
    id: 'reports',
    label: '报表',
    path: '/reports',
    icon: 'FileText' as const,
    children: [
      { id: 'efficiency-board', label: '人效看板', path: '/reports/efficiency-board', icon: 'FileText' as const },
      { id: 'inbound-efficiency', label: '入库效率', path: '/reports/inbound-efficiency', icon: 'FileText' as const },
      { id: 'outbound-efficiency', label: '出库效率', path: '/reports/outbound-efficiency', icon: 'FileText' as const },
    ],
  },
  {
    id: 'fba-returns',
    label: 'FBA退货',
    path: '/fba-returns',
    icon: 'Package' as const,
    children: [
      { id: 'fba-return-inbound', label: '退货入库', path: '/fba-returns/return-inbound', icon: 'FileText' as const },
      { id: 'fba-relabel-service', label: '换标服务', path: '/fba-returns/relabel-service', icon: 'FileText' as const },
      { id: 'fba-return-outbound', label: '退货出库', path: '/fba-returns/return-outbound', icon: 'FileText' as const },
    ],
  },
  {
    id: 'in-stock',
    label: '库内',
    path: '/in-stock',
    icon: 'Inbox' as const,
    children: [
      { id: 'product-inventory', label: '产品库存', path: '/in-stock/product-inventory', icon: 'FileText' as const },
      { id: 'box-inventory', label: '箱库存', path: '/in-stock/box-inventory', icon: 'FileText' as const },
      { id: 'return-inventory', label: '退货库存', path: '/in-stock/return-inventory', icon: 'FileText' as const },
      { id: 'defective-handling', label: '次品处理', path: '/in-stock/defective-handling', icon: 'FileText' as const },
      { id: 'inventory-check', label: '盘点', path: '/in-stock/inventory-check', icon: 'FileText' as const },
    ],
  },
  {
    id: 'basic-data',
    label: '基础数据',
    path: '/basic-data',
    icon: 'FileText' as const,
    children: [
      { id: 'basic-product', label: '产品', path: '/basic-data/product', icon: 'FileText' as const },
      { id: 'basic-warehouse-area', label: '库区', path: '/basic-data/warehouse-area', icon: 'FileText' as const },
      { id: 'basic-location', label: '库位', path: '/basic-data/location', icon: 'FileText' as const },
      { id: 'basic-packaging', label: '包材', path: '/basic-data/packaging', icon: 'FileText' as const },
      { id: 'basic-seeding-wall', label: '播种墙', path: '/basic-data/seeding-wall', icon: 'FileText' as const },
    ],
  },
]

export default function AppShellLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  const [openTabs, setOpenTabs] = useState<string[]>(['/dashboard'])

  const pathToLabel = useMemo(() => buildPathToLabel(mainMenuItems), [])

  useEffect(() => {
    if (pathname && !openTabs.includes(pathname)) {
      setOpenTabs((tabs) => [...tabs, pathname])
    }
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
    <SidebarProvider>
      <AppSidebar items={mainMenuItems} />
      <SidebarInset>
        <header className="flex shrink-0 flex-col border-b bg-background">
          <TabBar openTabs={openTabs} onCloseTab={handleCloseTab} pathToLabel={pathToLabel} />
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
