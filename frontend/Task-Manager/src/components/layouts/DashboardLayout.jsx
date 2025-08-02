import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          {/* Sidebar (hidden on small screens) */}
          <div className="hidden max-[1080px]:hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main content */}
          <div className="flex-grow mx-5 my-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
