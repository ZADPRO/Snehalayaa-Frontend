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
      icon: <LayoutDashboard className="w-20 h-20" />,
    },
    { name: "Inventory", icon: <Boxes className="w-20 h-20" /> },
    {
      name: "Stock Transfers",
      icon: <Repeat className="w-20 h-20" />,
    },
    {
      name: "Image Upload",
      icon: <Image className="w-20 h-20" />,
    },
    {
      name: "Shopify",
      icon: <ShoppingCart className="w-20 h-20" />,
    },
    {
      name: "Catalogs",
      icon: <BookOpen className="w-20 h-20" />,
    },
    {
      name: "Purchase Order",
      icon: <ClipboardList className="w-20 h-20" />,
    },
    {
      name: "Debit Note",
      icon: <BadgeDollarSign className="w-20 h-20" />,
    },
    {
      name: "Product Settings",
      icon: <Settings className="w-20 h-20" />,
    },
    { name: "Employees", icon: <Users className="w-20 h-20" /> },
    {
      name: "Supplier & Customers",
      icon: <UserCog className="w-20 h-20" />,
    },
    { name: "Attributes", icon: <Tag className="w-20 h-20" /> },
    {
      name: "Branches",
      icon: <Building2 className="w-20 h-20" />,
    },
  ];

  return (
    <div className="p-3 w-screen h-screen bg-gradient-to-bl from-[#8e68ca] to-[#3e2c56] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-4">
        <p className="font-bold text-lg">Logo</p>
        <p className="font-semibold">Profile</p>
      </div>

      {/* Centered Grid Section */}
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="erp-grid gap-5">
          {elements.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="
                  bg-white shadow-md rounded-xl p-6 cursor-pointer
                  flex flex-col items-center justify-center
                  hover:shadow-xl hover:-translate-y-1
                  transition-all duration-200 
                  h-36 w-36
                "
              >
                <div className="flex justify-center items-center h-full text-black">
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
    </div>
  );
};

export default ControlPanel;
