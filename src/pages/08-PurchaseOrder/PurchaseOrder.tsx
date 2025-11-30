import React, { useState, useRef, useEffect } from "react";

import backgroundImage from "../../assets/background/bg.png";
import { ClipboardList, ClipboardPlus, FolderOpen, User } from "lucide-react";
import PurchaseOrderList from "../../components/08-PurchaseOrderComponents/PurchaseOrderList/PurchaseOrderList";
import PurchaseOrderCreate from "../../components/08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate";

const sidebarItems = [
  {
    key: "purchaseOrder",
    label: "Purchase Order",
    icon: <ClipboardList size={20} />,
    component: <PurchaseOrderList />,
  },
  {
    key: "createPO",
    label: "Create PO",
    icon: <ClipboardPlus size={20} />,
    component: <PurchaseOrderCreate />,
  },
  {
    key: "open",
    label: "Open PO",
    icon: <FolderOpen size={20} />,
    component: <PurchaseOrderCreate />,
  },
];

const PurchaseOrder: React.FC = () => {
  const [activeKey, setActiveKey] = useState("createPO");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      scrollRef.current?.scrollTo({ left: 0 });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
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
          <button className="ps-back-btn" onClick={() => window.history.back()}>
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
  );
};

export default PurchaseOrder;
