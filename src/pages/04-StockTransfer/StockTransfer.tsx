import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, ClipboardCheck, User } from "lucide-react";

import backgroundImage from "../../assets/background/bg.png";
import ProductStockTransfer from "../../components/04-StockTransferComponents/StockTransfer/ProductStockTransfer";
import ProductStockIntake from "../../components/04-StockTransferComponents/StockInTake/ProductStockIntake";

const sidebarItems = [
  {
    key: "stockTake",
    label: "Stock In Take",
    icon: <ClipboardCheck size={20} />,
    component: <ProductStockIntake />,
  },
  {
    key: "stockTransfer",
    label: "Stock Transfer",
    icon: <ArrowLeftRight size={20} />,
    component: <ProductStockTransfer />,
  },
];

const StockTransfer: React.FC = () => {
  const [activeKey, setActiveKey] = useState("stockTake");
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

export default StockTransfer;
