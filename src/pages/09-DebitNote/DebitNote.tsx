import React from "react";
import backgroundImage from "../../assets/background/bg.png";
import { User } from "lucide-react";

const DebitNote: React.FC = () => {
  return (
    <div
      className="ps-container"
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      {/* TOP BAR */}
      <div className="ps-topbar flex items-center justify-between p-3 bg-white shadow">
        <button className="ps-back-btn" onClick={() => window.history.back()}>
          Back
        </button>

        <p className="uppercase font-semibold text-lg">Debit Note</p>

        <User size={32} color="#6f1e60" />
      </div>
    </div>
  );
};

export default DebitNote;
