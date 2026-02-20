import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShellLayout from './layouts/AppShellLayout'
import DashboardPage from './pages/DashboardPage'
import InboundPendingPage from './pages/InboundPendingPage'
import InboundScanPage from './pages/InboundScanPage'
import InboundClaimPage from './pages/InboundClaimPage'
import PutawayTasksPage from './pages/PutawayTasksPage'
import OutboundOneClickPage from './pages/outbound/OutboundOneClickPage'
import OutboundStockTransferPage from './pages/outbound/OutboundStockTransferPage'
import OutboundWavePage from './pages/outbound/OutboundWavePage'
import OutboundSecondSortPage from './pages/outbound/OutboundSecondSortPage'
import OutboundCompoundCheckPage from './pages/outbound/OutboundCompoundCheckPage'
import OutboundParcelReviewPage from './pages/outbound/OutboundParcelReviewPage'
import OutboundWeighPage from './pages/outbound/OutboundWeighPage'
import OutboundRelabelPage from './pages/outbound/OutboundRelabelPage'
import OutboundLogisticsPackPage from './pages/outbound/OutboundLogisticsPackPage'
import OutboundChangeOrderPage from './pages/outbound/OutboundChangeOrderPage'
import OutboundExceptionPage from './pages/outbound/OutboundExceptionPage'
import OutboundCutoffPage from './pages/outbound/OutboundCutoffPage'
import ProductsListPage from './pages/ProductsListPage'
import SettingsPage from './pages/SettingsPage'
import ReturnsPage from './pages/ReturnsPage'
import TransferPage from './pages/TransferPage'
import WorkOrderPage from './pages/WorkOrderPage'
import ReportsEfficiencyBoardPage from './pages/reports/ReportsEfficiencyBoardPage'
import ReportsInboundEfficiencyPage from './pages/reports/ReportsInboundEfficiencyPage'
import ReportsOutboundEfficiencyPage from './pages/reports/ReportsOutboundEfficiencyPage'
import FbaReturnInboundPage from './pages/fba/FbaReturnInboundPage'
import FbaRelabelServicePage from './pages/fba/FbaRelabelServicePage'
import FbaReturnOutboundPage from './pages/fba/FbaReturnOutboundPage'
import InStockProductPage from './pages/instock/InStockProductPage'
import InStockBoxPage from './pages/instock/InStockBoxPage'
import InStockReturnPage from './pages/instock/InStockReturnPage'
import InStockDefectivePage from './pages/instock/InStockDefectivePage'
import InStockCheckPage from './pages/instock/InStockCheckPage'
import BasicProductPage from './pages/basic/BasicProductPage'
import BasicWarehouseAreaPage from './pages/basic/BasicWarehouseAreaPage'
import BasicLocationPage from './pages/basic/BasicLocationPage'
import BasicPackagingPage from './pages/basic/BasicPackagingPage'
import BasicSeedingWallPage from './pages/basic/BasicSeedingWallPage'
import './App.css'

function App() {
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

export default App
