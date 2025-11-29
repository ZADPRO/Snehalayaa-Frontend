import React from "react";
import { useNavigate } from "react-router-dom";

import backgroundImage from "../../assets/background/bg.png";
import snehalayaaLogo from "../../assets/logo/logo1.png";

import {
  LayoutDashboard,
  Boxes,
  Repeat,
  Image,
  ShoppingCart,
  BookOpen,
  ClipboardList,
  BadgeDollarSign,
  Settings,
  Users,
  UserCog,
  Tag,
  Building2,
  User,
} from "lucide-react";

const ControlPanel: React.FC = () => {
  const navigate = useNavigate();

  const elements = [
    {
      name: "Dashboard",
      route: "/dashboard",
      icon: (
        <LayoutDashboard
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Inventory",
      route: "/inventory",
      icon: (
        <Boxes
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Stock Transfers",
      route: "/stock-transfer",
      icon: (
        <Repeat
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Image Upload",
      route: "/image-upload",
      icon: (
        <Image
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Shopify",
      route: "/shopify",
      icon: (
        <ShoppingCart
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Catalogs",
      route: "/catalogs",
      icon: (
        <BookOpen
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Purchase Order",
      route: "/purchase-order",
      icon: (
        <ClipboardList
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Debit Note",
      route: "/debit-note",
      icon: (
        <BadgeDollarSign
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Product Settings",
      route: "/product-settings",
      icon: (
        <Settings
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Employees",
      route: "/employees",
      icon: (
        <Users
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Supplier & Customers",
      route: "/supplier-customers",
      icon: (
        <UserCog
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Attributes",
      route: "/attributes",
      icon: (
        <Tag
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
    {
      name: "Branches",
      route: "/branches",
      icon: (
        <Building2
          size={52}
          stroke="currentColor"
          strokeWidth={1}
          className="text-[#6f1e60]"
        />
      ),
    },
  ];

  return (
    <div
      className="w-screen min-h-screen flex flex-col"
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-between items-center px-4 py-2">
        <img src={snehalayaaLogo} alt="Snehalayaa Logo" className="h-[80px]" />

        <p className="font-bold text-xl uppercase" style={{ color: "#6f1e60" }}>
          Snehalayaa ERP
        </p>

        <User size={32} color="#6f1e60" />
      </div>

      <div className="flex-1 w-full flex justify-center items-center py-3">
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
                  h-44 w-44
                  overflow-hidden
                "
              >
                <div className="absolute bottom-0 left-0 w-full h-0 bg-[#6f1e60] transition-all duration-500 ease-in-out group-hover:h-full"></div>

                <div
                  className="
                    relative z-10 flex justify-center items-center mt-3 mb-3
                    transition-colors duration-300
                    group-hover:text-white text-[#6f1e60]
                  "
                >
                  {React.cloneElement(item.icon, {
                    className:
                      "transition-colors duration-300 group-hover:text-white text-[#6f1e60]",
                  })}
                </div>

                <p className="relative z-10 text-center transition-colors duration-300 group-hover:text-white text-[#6f1e60]">
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
