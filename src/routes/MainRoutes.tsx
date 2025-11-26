import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/01-Login/Login";
import ControlPanel from "../components/00-ControlPanel/ControlPanel";

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/controlPanel" element={<ControlPanel />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
