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
      icon: <LayoutDashboard className="w-18 h-18 text-indigo-600" />,
    },
    { name: "Inventory", icon: <Boxes className="w-18 h-18 text-blue-600" /> },
    {
      name: "Stock Transfers",
      icon: <Repeat className="w-18 h-18" />,
    },
    {
      name: "Image Upload",
      icon: <Image className="w-18 h-18 text-pink-600" />,
    },
    {
      name: "Shopify",
      icon: <ShoppingCart className="w-18 h-18 text-orange-600" />,
    },
    {
      name: "Catalogs",
      icon: <BookOpen className="w-18 h-18 text-teal-600" />,
    },
    {
      name: "Purchase Order",
      icon: <ClipboardList className="w-18 h-18 text-purple-600" />,
    },
    {
      name: "Debit Note",
      icon: <BadgeDollarSign className="w-18 h-18 text-red-500" />,
    },
    {
      name: "Product Settings",
      icon: <Settings className="w-18 h-18 text-gray-700" />,
    },
    { name: "Employees", icon: <Users className="w-18 h-18 text-green-700" /> },
    {
      name: "Supplier & Customers",
      icon: <UserCog className="w-18 h-18 text-yellow-600" />,
    },
    { name: "Attributes", icon: <Tag className="w-18 h-18 text-pink-500" /> },
    {
      name: "Branches",
      icon: <Building2 className="w-18 h-18 text-blue-700" />,
    },
  ];

  return (
    <div className="p-3 w-screen h-screen bg-gradient-to-bl from-[#8e68ca] to-[#3e2c56]">
      <div className="flex justify-between">
        <p>Logo</p>
        <p>profile icon</p>
      </div>
      <div className="flex justify-center items-center">
        <div className="p-6">
          <div className="erp-grid">
            {elements.map((item, index) => (
              <div>
                <div
                  key={index}
                  className="
                bg-white shadow-sm rounded-xl p-4 cursor-pointer
                flex flex-col items-center justify-center
                hover:shadow-md hover:-translate-y-1
                transition-all duration-200
              "
                >
                  <div className="flex justify-center items-center h-20">
                    {item.icon}
                  </div>
                </div>
                <p className="font-bold text-white text-center mt-2">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
