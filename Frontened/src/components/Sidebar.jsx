import { Home, Shield, User } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Crime System</h2>

      <NavLink to="/admin"> <Home size={18}/> Dashboard </NavLink>
      <NavLink to="/police"> <Shield size={18}/> Police </NavLink>
      <NavLink to="/"> <User size={18}/> Login </NavLink>

    </div>
  );
}

export default Sidebar;