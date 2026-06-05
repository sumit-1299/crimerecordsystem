import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // 🔥 Dynamic Title
  const getTitle = () => {
    if (location.pathname === "/admin") return "Admin Dashboard";
    if (location.pathname === "/police") return "Police Dashboard";
    return "";
  };

  const title = getTitle();

  return (
    <div className="layout">

      {/* ✅ SIDEBAR */}
      <Sidebar />

      {/* ✅ MAIN */}
      <div className="main">

        {/* 🔥 TOPBAR */}
        {title && (
          <div className="topbar">

            {/* LEFT */}
            <div className="topbar-left">
              <h2 className="page-title">{title}</h2>
              <span className="breadcrumb">
                Home / {title}
              </span>
            </div>

            {/* RIGHT */}
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>

          </div>
        )}

        {/* 🔥 CONTENT WRAPPER */}
        <div className="content-wrapper">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;