import React, { useEffect, useRef, useState } from "react";
import backgroundImage from "../../assets/background/bg.png";
import { User } from "lucide-react";

import { Inbox, ShoppingBag } from "lucide-react";
import StockStatementReport from "../../components/16-ReportsComponents/StockStatementReport/StockStatementReport";
import PurchaseOrderReports from "../../components/16-ReportsComponents/PurchaseOrderReports/PurchaseOrderReports";
import SupplierReports from "../../components/16-ReportsComponents/SupplierReports/SupplierReports";
import SupplierOutstandingReport from "../../components/16-ReportsComponents/SupplierOutstandingReport/SupplierOutstandingReport";

const sidebarItems = [
  {
    key: "shopifyInward",
    label: "Stock Statement",
    icon: <Inbox size={20} />,
    component: <StockStatementReport />,
  },
  {
    key: "shopifyProducts",
    label: "Purchase Report",
    icon: <ShoppingBag size={20} />,
    component: <PurchaseOrderReports />,
  },
  {
    key: "shopifyProducts",
    label: "Supplier Report",
    icon: <ShoppingBag size={20} />,
    component: <SupplierReports />,
  },

  {
    key: "shopifyProducts",
    label: "Supplier Outstanding",
    icon: <ShoppingBag size={20} />,
    component: <SupplierOutstandingReport />,
  },
];

const Shopify: React.FC = () => {
  const [activeKey, setActiveKey] = useState("shopifyInward");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Always scroll to left on resize
  useEffect(() => {
    const handleResize = () => {
      scrollRef.current?.scrollTo({ left: 0 });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div
        className="ps-container"
        style={{
          backgroundColor: "#f5f5f5",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* TOP BAR */}
        <div className="ps-topbar">
          <div className="ps-left">
            <button
              className="ps-back-btn"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>

          <div className="ps-center" ref={scrollRef}>
            <div className="ps-center-inner">
              {sidebarItems.map((item) => (
                <div
                  key={item.key}
                  className={`ps-tab ${activeKey === item.key ? "active" : ""}`}
                  onClick={() => setActiveKey(item.key)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ps-right">
            <User size={32} color="#6f1e60" />
          </div>
        </div>
        <div className="ps-content">
          {sidebarItems.find((item) => item.key === activeKey)?.component}
        </div>
      </div>
    </div>
  );
};

export default Shopify;
