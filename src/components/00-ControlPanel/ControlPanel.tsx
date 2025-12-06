import React from "react";
import { useNavigate } from "react-router-dom";

import backgroundImage from "../../assets/background/bg.png";
import snehalayaaLogo from "../../assets/logo/logo1.png";

import "./ControlPanel.css";

import {
  LayoutDashboard,
  ShoppingCart,
  User,
  Box,
  ArrowLeftRight,
  ImageUp,
  ShoppingBag,
  ListCheck,
  BanknoteArrowDown,
  Bolt,
  IdCardLanyard,
  ListPlus,
  Split,
  Trophy,
  Monitor,
  BarChart3,
  Boxes,
  Bug,
  PackageCheck,
  // UserStar,
} from "lucide-react";

const ControlPanel: React.FC = () => {
  const navigate = useNavigate();

  const elements = [
    {
      name: "Dashboard",
      route: "/dashboard",
      icon: <LayoutDashboard size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Inventory",
      route: "/inventory",
      icon: <Box size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Stock Transfers",
      route: "/stock-transfer",
      icon: <ArrowLeftRight size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Stock In Take",
      route: "/stock-intake",
      icon: <PackageCheck size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Image Upload",
      route: "/image-upload",
      icon: <ImageUp size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Shopify",
      route: "/shopify",
      icon: <ShoppingBag size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Catalogs",
      route: "/catalogs",
      icon: <ListCheck size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Purchase Order",
      route: "/purchase-order",
      icon: <ShoppingCart size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Debit Note",
      route: "/debit-note",
      icon: (
        <BanknoteArrowDown size={45} className="icon-spin" strokeWidth={1} />
      ),
    },
    {
      name: "Product Settings",
      route: "/product-settings",
      icon: <Bolt size={45} className="icon-spin" strokeWidth={1} />,
    },
    // {
    //   name: "Employees",
    //   route: "/employees",
    //   icon: <IdCardLanyard size={45} className="icon-spin" strokeWidth={1} />,
    // },
    {
      name: "Users",
      route: "/supplier-customers",
      icon: <IdCardLanyard size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Attributes",
      route: "/attributes",
      icon: <ListPlus size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Branches",
      route: "/branches",
      icon: <Split size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "POS",
      route: "/pos",
      icon: <Monitor size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Reports",
      route: "/reports",
      icon: <BarChart3 size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Nivas",
      route: "/nivas",
      icon: <Trophy size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Bundle In & Out",
      route: "/bundles",
      icon: <Boxes size={45} className="icon-spin" strokeWidth={1} />,
    },
    {
      name: "Issues & Bugs",
      route: "/issues",
      icon: <Bug size={45} className="icon-spin" strokeWidth={1} />,
    },
  ];

  return (
    <div
      className="w-screen min-h-screen flex flex-col"
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div className="relative flex items-center px-4 py-2">
        <img src={snehalayaaLogo} alt="Snehalayaa Logo" className="h-[80px]" />

        <p
          className="
            absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2
            font-bold text-xl uppercase
          "
          style={{ color: "#6f1e60" }}
        >
          Snehalayaa ERP - Control Panel
        </p>

        <div className="ml-auto">
          <User size={32} color="#6f1e60" />
        </div>
      </div>

      <div className="flex-1 w-full flex justify-center items-center py-3 mt-[-100px]">
        <div className="erp-grid gap-2 md:px-10">
          {elements.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => navigate(item.route)}
            >
              <div
                className="
                  relative bg-white rounded-xl border border-[#6f1e60]/60
                  flex flex-col items-center justify-center
                  h-40 w-44 overflow-hidden
                "
              >
                <div className="absolute bottom-0 left-0 w-full h-0 bg-[#6f1e60] transition-all duration-500 ease-in-out group-hover:h-full"></div>

                <div
                  className="
                    relative z-10 flex justify-center items-center mt-3 mb-3
                    text-[#6f1e60]
                    group-hover:text-white 
                    transition duration-300
                  "
                >
                  {React.cloneElement(item.icon, {
                    className: `${item.icon.props.className}`,
                  })}
                </div>

                <p className="relative text-sm z-10 text-center group-hover:text-white">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center font-medium pb-2" style={{ color: "#6f1e60" }}>
        ©2025 All Rights Reserved - Snehalayaa ERP Development
      </p>
    </div>
  );
};

export default ControlPanel;
