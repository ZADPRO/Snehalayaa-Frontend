import React, { useState } from "react";
import ProductSettingsCategories from "../../components/10-ProductSettingsComponents/ProductSettingsCategories/ProductSettingsCategories";

import {
  FolderKanban,
  FolderTree,
  Package,
  BadgeCheck,
  Palette,
  Shapes,
  Layers,
  Droplets,
  Ruler,
} from "lucide-react";

import "./ProductSettings.css";
import ProductSettingsSubCategories from "../../components/10-ProductSettingsComponents/ProductSettingsSubCategories/ProductSettingsSubCategories";
import ProductSettingsProdCombo from "../../components/10-ProductSettingsComponents/ProductSettingsProdCombo/ProductSettingsProdCombo";

const sidebarItems = [
  {
    key: "categories",
    label: "Categories",
    icon: <FolderKanban size={20} className="sidebar-icon" />,
    component: <ProductSettingsCategories />,
  },
  {
    key: "subCategories",
    label: "Sub-Categories",
    icon: <FolderTree size={20} className="sidebar-icon" />,
    component: <ProductSettingsSubCategories />,
  },
  {
    key: "products",
    label: "Products",
    icon: <Package size={20} className="sidebar-icon" />,
    component: <ProductSettingsProdCombo />,
  },
  {
    key: "brand",
    label: "Brand",
    icon: <BadgeCheck size={20} className="sidebar-icon" />,
    component: <ProductSettingsCategories />,
  },
  {
    key: "design",
    label: "Design",
    icon: <Palette size={20} className="sidebar-icon" />,
    component: <ProductSettingsCategories />,
  },
  {
    key: "pattern",
    label: "Pattern",
    icon: <Shapes size={20} className="sidebar-icon" />,
    component: <ProductSettingsCategories />,
  },
  {
    key: "varient",
    label: "Varient",
    icon: <Layers size={20} className="sidebar-icon" />,
    component: <ProductSettingsCategories />,
  },
  {
    key: "color",
    label: "Color",
    icon: <Droplets size={20} className="sidebar-icon" />,
    component: <ProductSettingsCategories />,
  },
  {
    key: "size",
    label: "Size",
    icon: <Ruler size={20} className="sidebar-icon" />,
    component: <ProductSettingsCategories />,
  },
];

const ProductSettings: React.FC = () => {
  const [activeKey, setActiveKey] = useState("products");

  return (
    <div>
      <div className="settingsContainer">
        <div className="settingsMainColumn">
          {/* Horizontal Sidebar */}
          <div className="settingsSidebarHorizontal">
            {sidebarItems.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <div
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className={`sidebarItemHorizontal ${
                    isActive ? "active" : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="settingsContentFull">
            {sidebarItems.find((item) => item.key === activeKey)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSettings;
