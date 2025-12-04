import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/01-Login/Login";
import ControlPanel from "../components/00-ControlPanel/ControlPanel";
import Dashboard from "../pages/02-Dashboard/Dashboard";
import Inventory from "../pages/03-Inventory/Inventory";
import StockTransfer from "../pages/04-StockTransfer/StockTransfer";
import ImageUpload from "../pages/05-ImageUpload/ImageUpload";
import Shopify from "../pages/06-Shopify/Shopify";
import Catalogs from "../pages/07-Catalogs/Catalogs";
import PurchaseOrder from "../pages/08-PurchaseOrder/PurchaseOrder";
import DebitNote from "../pages/09-DebitNote/DebitNote";
import ProductSettings from "../pages/10-ProductSettings/ProductSettings";
import ForgotPassword from "../pages/01-Login/ForgotPassword";
import Employees from "../pages/11-Employees/Employees";
import SupplierCustomers from "../pages/12-SupplierCustomers/SupplierCustomers";
import Attributes from "../pages/13-Attributes/Attributes";
import Branches from "../pages/14-Branches/Branches";
import POS from "../pages/15-POS/POS";
import Reports from "../pages/16-Reports/Reports";
import StockInTake from "../pages/04-StockTransfer/StockInTake";

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/controlPanel" element={<ControlPanel />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stock-transfer" element={<StockTransfer />} />
        <Route path="/stock-intake" element={<StockInTake />} />
        <Route path="/image-upload" element={<ImageUpload />} />
        <Route path="/shopify" element={<Shopify />} />
        <Route path="/catalogs" element={<Catalogs />} />
        <Route path="/purchase-order" element={<PurchaseOrder />} />
        <Route path="/debit-note" element={<DebitNote />} />
        <Route path="/product-settings" element={<ProductSettings />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/supplier-customers" element={<SupplierCustomers />} />
        <Route path="/attributes" element={<Attributes />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
