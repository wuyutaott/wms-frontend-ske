import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShellLayout from '@/layouts/AppShell/AppShellLayout'
import DashboardPage from '@/pages/Dashboard'
import InboundPendingPage from '@/pages/Inbound/Pending'
import InboundScanPage from '@/pages/Inbound/Scan'
import InboundClaimPage from '@/pages/Inbound/Claim'
import PutawayTasksPage from '@/pages/Putaway/Tasks'
import OutboundOneClickPage from '@/pages/outbound/OneClick'
import OutboundStockTransferPage from '@/pages/outbound/StockTransfer'
import OutboundWavePage from '@/pages/outbound/Wave'
import OutboundSecondSortPage from '@/pages/outbound/SecondSort'
import OutboundCompoundCheckPage from '@/pages/outbound/CompoundCheck'
import OutboundParcelReviewPage from '@/pages/outbound/ParcelReview'
import OutboundWeighPage from '@/pages/outbound/Weigh'
import OutboundRelabelPage from '@/pages/outbound/Relabel'
import OutboundLogisticsPackPage from '@/pages/outbound/LogisticsPack'
import OutboundChangeOrderPage from '@/pages/outbound/ChangeOrder'
import OutboundExceptionPage from '@/pages/outbound/Exception'
import OutboundCutoffPage from '@/pages/outbound/Cutoff'
import ProductsListPage from '@/pages/Products/List'
import SettingsPage from '@/pages/Settings'
import ReturnsPage from '@/pages/Returns'
import TransferPage from '@/pages/Transfer'
import WorkOrderPage from '@/pages/WorkOrder'
import ReportsEfficiencyBoardPage from '@/pages/reports/EfficiencyBoard'
import ReportsInboundEfficiencyPage from '@/pages/reports/InboundEfficiency'
import ReportsOutboundEfficiencyPage from '@/pages/reports/OutboundEfficiency'
import FbaReturnInboundPage from '@/pages/FbaReturns/ReturnInbound'
import FbaRelabelServicePage from '@/pages/FbaReturns/RelabelService'
import FbaReturnOutboundPage from '@/pages/FbaReturns/ReturnOutbound'
import InStockProductPage from '@/pages/instock/ProductInventory'
import InStockBoxPage from '@/pages/instock/BoxInventory'
import InStockReturnPage from '@/pages/instock/ReturnInventory'
import InStockDefectivePage from '@/pages/instock/DefectiveHandling'
import InStockCheckPage from '@/pages/instock/InventoryCheck'
import BasicProductPage from '@/pages/BasicData/Product'
import BasicWarehouseAreaPage from '@/pages/BasicData/WarehouseArea'
import BasicLocationPage from '@/pages/BasicData/Location'
import BasicPackagingPage from '@/pages/BasicData/Packaging'
import BasicSeedingWallPage from '@/pages/BasicData/SeedingWall'

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
