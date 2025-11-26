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

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/controlPanel" element={<ControlPanel />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stock-transfer" element={<StockTransfer />} />
        <Route path="/image-upload" element={<ImageUpload />} />
        <Route path="/shopify" element={<Shopify />} />
        <Route path="/catalogs" element={<Catalogs />} />
        <Route path="/purchase-order" element={<PurchaseOrder />} />
        <Route path="/debit-note" element={<DebitNote />} />
        <Route path="/product-settings" element={<ProductSettings />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
