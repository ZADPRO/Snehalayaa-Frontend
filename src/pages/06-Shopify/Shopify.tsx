import React, { useEffect, useRef, useState } from "react";
import backgroundImage from "../../assets/background/bg.png";
import { User } from "lucide-react";

import ShopifyInward from "../../components/06-ShopifyComponents/ShopifyInward/ShopifyInward";
import ShopifyProducts from "../../components/06-ShopifyComponents/ShopifyProducts/ShopifyProducts";

import { Inbox, ShoppingBag } from "lucide-react";

const sidebarItems = [
  {
    key: "shopifyInward",
    label: "Shopify Inward",
    icon: <Inbox size={20} />,
    component: <ShopifyInward />,
  },
  {
    key: "shopifyProducts",
    label: "Shopify Products",
    icon: <ShoppingBag size={20} />,
    component: <ShopifyProducts />,
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
