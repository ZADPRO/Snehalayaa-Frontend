import React from "react";
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
  const elements = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-8 h-8 text-indigo-600" />,
    },
    { name: "Inventory", icon: <Boxes className="w-8 h-8 text-blue-600" /> },
    {
      name: "Stock Transfers",
      icon: <Repeat className="w-8 h-8 text-emerald-600" />,
    },
    { name: "Image Upload", icon: <Image className="w-8 h-8 text-pink-600" /> },
    {
      name: "Shopify",
      icon: <ShoppingCart className="w-8 h-8 text-orange-600" />,
    },
    { name: "Catalogs", icon: <BookOpen className="w-8 h-8 text-teal-600" /> },
    {
      name: "Purchase Order",
      icon: <ClipboardList className="w-8 h-8 text-purple-600" />,
    },
    {
      name: "Debit Note",
      icon: <BadgeDollarSign className="w-8 h-8 text-red-500" />,
    },
    {
      name: "Product Settings",
      icon: <Settings className="w-8 h-8 text-gray-700" />,
    },
    { name: "Employees", icon: <Users className="w-8 h-8 text-green-700" /> },
    {
      name: "Supplier & Customers",
      icon: <UserCog className="w-8 h-8 text-yellow-600" />,
    },
    { name: "Attributes", icon: <Tag className="w-8 h-8 text-pink-500" /> },
    { name: "Branches", icon: <Building2 className="w-8 h-8 text-blue-700" /> },
  ];

  return (
    <div className="p-6">
      <div className="erp-grid">
        {elements.map((item, index) => (
          <div
            key={index}
            className="
              erp-item bg-white shadow-sm border rounded-xl p-5 cursor-pointer
              space-y-3 hover:shadow-md hover:-translate-y-1
              transition-all duration-200 select-none
            "
          >
            <div className="flex justify-center">{item.icon}</div>
            <p className="text-gray-700 font-medium text-center text-sm">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
