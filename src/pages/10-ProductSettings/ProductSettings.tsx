import React, { useState, useRef, useEffect } from "react";
import {
  FolderKanban,
  FolderTree,
  Package,
  Palette,
  Shapes,
  User,
} from "lucide-react";

import backgroundImage from "../../assets/background/bg.png";

import ProductSettingsCategories from "../../components/10-ProductSettingsComponents/ProductSettingsCategories/ProductSettingsCategories";
import ProductSettingsSubCategories from "../../components/10-ProductSettingsComponents/ProductSettingsSubCategories/ProductSettingsSubCategories";
import ProductSettingsProdCombo from "../../components/10-ProductSettingsComponents/ProductSettingsProdCombo/ProductSettingsProdCombo";

import "./ProductSettings.css";
import ProductSettingsDesignColorSize from "../../components/10-ProductSettingsComponents/ProductSettingsDesignColorSize/ProductSettingsDesignColorSize";
import ProductSettingsPatternVarient from "../../components/10-ProductSettingsComponents/ProductSettingsPatternVarient/ProductSettingsPatternVarient";

const sidebarItems = [
  {
    key: "categories",
    label: "Categories",
    icon: <FolderKanban size={20} />,
    component: <ProductSettingsCategories />,
  },
  {
    key: "subCategories",
    label: "Sub-Categories",
    icon: <FolderTree size={20} />,
    component: <ProductSettingsSubCategories />,
  },
  {
    key: "products",
    label: "Products",
    icon: <Package size={20} />,
    component: <ProductSettingsProdCombo />,
  },
  {
    key: "variables",
    label: "Variable Attributes",
    icon: <Palette size={20} />,
    component: <ProductSettingsDesignColorSize />,
  },
  {
    key: "pattern",
    label: "Pattern & Varients",
    icon: <Shapes size={20} />,
    component: <ProductSettingsPatternVarient />,
  },
];

const ProductSettings: React.FC = () => {
  const [activeKey, setActiveKey] = useState("categories");
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

export default ProductSettings;
