import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShellLayout from '@/layouts/AppShell/AppShellLayout'

// 首页
import DashboardPage from '@/pages/Dashboard'

// 入库
import InboundPendingPage from '@/pages/Inbound/Pending'
import InboundScanPage from '@/pages/Inbound/Scan'
import InboundClaimPage from '@/pages/Inbound/Claim'
import PutawayTasksPage from '@/pages/Putaway/Tasks'
import ProductsListPage from '@/pages/Products/List'

// 出库
import OutboundOneClickPage from '@/pages/Outbound/OneClick'
import OutboundStockTransferPage from '@/pages/Outbound/StockTransfer'
import OutboundWavePage from '@/pages/Outbound/Wave'
import OutboundSecondSortPage from '@/pages/Outbound/SecondSort'
import OutboundCompoundCheckPage from '@/pages/Outbound/CompoundCheck'
import OutboundParcelReviewPage from '@/pages/Outbound/ParcelReview'
import OutboundWeighPage from '@/pages/Outbound/Weigh'
import OutboundRelabelPage from '@/pages/Outbound/Relabel'
import OutboundLogisticsPackPage from '@/pages/Outbound/LogisticsPack'
import OutboundChangeOrderPage from '@/pages/Outbound/ChangeOrder'
import OutboundExceptionPage from '@/pages/Outbound/Exception'
import OutboundCutoffPage from '@/pages/Outbound/Cutoff'

// 库内
import InStockProductPage from '@/pages/InStock/ProductInventory'
import InStockBoxPage from '@/pages/InStock/BoxInventory'
import InStockReturnPage from '@/pages/InStock/ReturnInventory'
import InStockDefectivePage from '@/pages/InStock/DefectiveHandling'
import InStockCheckPage from '@/pages/InStock/InventoryCheck'

// FBA 退货
import FbaReturnInboundPage from '@/pages/FbaReturns/ReturnInbound'
import FbaRelabelServicePage from '@/pages/FbaReturns/RelabelService'
import FbaReturnOutboundPage from '@/pages/FbaReturns/ReturnOutbound'

// 基础数据
import BasicProductPage from '@/pages/BasicData/Product'
import BasicWarehouseAreaPage from '@/pages/BasicData/WarehouseArea'
import BasicLocationPage from '@/pages/BasicData/Location'
import BasicPackagingPage from '@/pages/BasicData/Packaging'
import BasicSeedingWallPage from '@/pages/BasicData/SeedingWall'

// 报表
import ReportsEfficiencyBoardPage from '@/pages/Reports/EfficiencyBoard'
import ReportsInboundEfficiencyPage from '@/pages/Reports/InboundEfficiency'
import ReportsOutboundEfficiencyPage from '@/pages/Reports/OutboundEfficiency'

// 独立功能页
import ReturnsPage from '@/pages/Returns'
import TransferPage from '@/pages/Transfer'
import WorkOrderPage from '@/pages/WorkOrder'
import SettingsPage from '@/pages/Settings'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShellLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inbound" element={<Navigate to="/inbound/pending" replace />} />
          <Route path="inbound/pending" element={<InboundPendingPage />} />
          <Route path="inbound/scan" element={<InboundScanPage />} />
          <Route path="inbound/claim" element={<InboundClaimPage />} />
          <Route path="outbound" element={<Navigate to="/outbound/one-click" replace />} />
          <Route path="outbound/one-click" element={<OutboundOneClickPage />} />
          <Route path="outbound/stock-transfer" element={<OutboundStockTransferPage />} />
          <Route path="outbound/wave" element={<OutboundWavePage />} />
          <Route path="outbound/second-sort" element={<OutboundSecondSortPage />} />
          <Route path="outbound/compound-check" element={<OutboundCompoundCheckPage />} />
          <Route path="outbound/parcel-review" element={<OutboundParcelReviewPage />} />
          <Route path="outbound/weigh" element={<OutboundWeighPage />} />
          <Route path="outbound/relabel" element={<OutboundRelabelPage />} />
          <Route path="outbound/logistics-pack" element={<OutboundLogisticsPackPage />} />
          <Route path="outbound/change-order" element={<OutboundChangeOrderPage />} />
          <Route path="outbound/exception" element={<OutboundExceptionPage />} />
          <Route path="outbound/cutoff" element={<OutboundCutoffPage />} />
          <Route path="putaway" element={<Navigate to="/putaway/tasks" replace />} />
          <Route path="putaway/tasks" element={<PutawayTasksPage />} />
          <Route path="products" element={<Navigate to="/products/list" replace />} />
          <Route path="products/list" element={<ProductsListPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="work-order" element={<WorkOrderPage />} />
          <Route path="reports" element={<Navigate to="/reports/efficiency-board" replace />} />
          <Route path="reports/efficiency-board" element={<ReportsEfficiencyBoardPage />} />
          <Route path="reports/inbound-efficiency" element={<ReportsInboundEfficiencyPage />} />
          <Route path="reports/outbound-efficiency" element={<ReportsOutboundEfficiencyPage />} />
          <Route path="fba-returns" element={<Navigate to="/fba-returns/return-inbound" replace />} />
          <Route path="fba-returns/return-inbound" element={<FbaReturnInboundPage />} />
          <Route path="fba-returns/relabel-service" element={<FbaRelabelServicePage />} />
          <Route path="fba-returns/return-outbound" element={<FbaReturnOutboundPage />} />
          <Route path="in-stock" element={<Navigate to="/in-stock/product-inventory" replace />} />
          <Route path="in-stock/product-inventory" element={<InStockProductPage />} />
          <Route path="in-stock/box-inventory" element={<InStockBoxPage />} />
          <Route path="in-stock/return-inventory" element={<InStockReturnPage />} />
          <Route path="in-stock/defective-handling" element={<InStockDefectivePage />} />
          <Route path="in-stock/inventory-check" element={<InStockCheckPage />} />
          <Route path="basic-data" element={<Navigate to="/basic-data/product" replace />} />
          <Route path="basic-data/product" element={<BasicProductPage />} />
          <Route path="basic-data/warehouse-area" element={<BasicWarehouseAreaPage />} />
          <Route path="basic-data/location" element={<BasicLocationPage />} />
          <Route path="basic-data/packaging" element={<BasicPackagingPage />} />
          <Route path="basic-data/seeding-wall" element={<BasicSeedingWallPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
