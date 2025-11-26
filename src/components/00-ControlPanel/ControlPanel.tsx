import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const ControlPanel: React.FC = () => {
  const navigate = useNavigate();

  const elements = [
    {
      name: "Dashboard",
      route: "/dashboard",
      icon: <LayoutDashboard className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Inventory",
      route: "/inventory",
      icon: <Boxes className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Stock Transfers",
      route: "/stock-transfer",
      icon: <Repeat className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Image Upload",
      route: "/image-upload",
      icon: <Image className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Shopify",
      route: "/shopify",
      icon: <ShoppingCart className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Catalogs",
      route: "/catalogs",
      icon: <BookOpen className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Purchase Order",
      route: "/purchase-order",
      icon: <ClipboardList className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Debit Note",
      route: "/debit-note",
      icon: <BadgeDollarSign className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Product Settings",
      route: "/product-settings",
      icon: <Settings className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Employees",
      route: "/employees",
      icon: <Users className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Supplier & Customers",
      route: "/supplier-customers",
      icon: <UserCog className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Attributes",
      route: "/attributes",
      icon: <Tag className="w-24 h-24 md:w-20 md:h-20" />,
    },
    {
      name: "Branches",
      route: "/branches",
      icon: <Building2 className="w-24 h-24 md:w-20 md:h-20" />,
    },
  ];

  return (
    <div className="p-3 w-screen min-h-screen flex flex-col bg-[radial-gradient(circle_at_20%_30%,#1a0f2f,#2d1d64,#3e2c56)] text-white">
      <div className="flex justify-between items-center px-4">
        <p className="font-bold text-lg">Logo</p>
        <p className="font-bold text-xl uppercase">Snehalayaa ERP</p>
        <p className="font-semibold">Profile</p>
      </div>

      {/* Remaining height filled by GRID */}
      <div className="flex-1 w-full flex justify-center items-center py-6">
        <div className="erp-grid gap-4 px-4 md:px-10">
          {elements.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => navigate(item.route)}
            >
              <div
                className="
                  bg-white shadow-md rounded-xl
                  flex flex-col items-center justify-center
                  hover:shadow-xl hover:-translate-y-1
                  transition-all duration-200
                  h-48 w-48 md:h-40 md:w-40
                "
              >
                <div className="flex justify-center items-center h-full text-[#1a0f2f]">
                  {item.icon}
                </div>
              </div>

              <p className="font-semibold text-center mt-2 uppercase">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center">
        @2025 All Rights Reserved - Snehalayaa ERP Development
      </p>
    </div>
  );
};

export default ControlPanel;
