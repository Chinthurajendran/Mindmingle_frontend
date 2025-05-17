import React, { useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import AdminHeader from "../../components/adminCompnents/AdminHeader"
import AdminSidebar from "../../components/adminCompnents/AdminSidebar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function AdminHome() {
  const navigate = useNavigate()
  const admin_authenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated_admin
  );

  if (!admin_authenticated) {
    return <Navigate to="/UserLoginPage" />;
  }else{
    navigate("/AdminHome/AdminUser")
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* <AdminHeader /> */}
      <div className="flex flex-grow">
        <AdminSidebar />
        <div className="w-5/6 p-6">
          <div className="h-[85vh] overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
