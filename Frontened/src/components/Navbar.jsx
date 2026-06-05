import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      background: "#1e293b",
      padding: "12px 20px",
      color: "white",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <h3>Crime System</h3>

      <div>
        <Link to="/admin" style={{ color: "white", marginRight: "15px" }}>Admin</Link>
        <Link to="/police" style={{ color: "white" }}>Police</Link>
      </div>
    </div>
  );
}

export default Navbar;