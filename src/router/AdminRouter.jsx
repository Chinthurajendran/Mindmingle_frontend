import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminHome from "../pages/adminPage/AdminHome"
import AdminUser from "../pages/adminPage/AdminUser"
import UserLoginPage from "../pages/userPage/userLoginPage"
import AdminPrivateRouter from "../privateRoute/adminPrivateRouter"

function AdminRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/UserLoginPage" element={<UserLoginPage />} /> */}
          <Route element={<AdminPrivateRouter />}>
            <Route path="/AdminHome" element={<AdminHome />}>
              <Route path="AdminUser" element={<AdminUser />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AdminRouter
