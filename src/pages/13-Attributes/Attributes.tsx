import React from "react";
import backgroundImage from "../../assets/background/bg.png";
import { User } from "lucide-react";

const Attributes: React.FC = () => {
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
        <div className="ps-topbar">
          <div className="ps-left">
            <button
              className="ps-back-btn"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>

          <p className="uppercase font-semibold text-lg">Attributes</p>

          <div className="ps-right">
            <User size={32} color="#6f1e60" />
          </div>
        </div>
        <div
          style={{
            marginTop: "150px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              padding: "12px 28px",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.4)",
              borderRadius: "20px",
              fontSize: "26px",
              fontWeight: 600,
              color: "#6f1e60",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            Work In Progress
          </span>
        </div>
      </div>
    </div>
  );
};

export default Attributes;
