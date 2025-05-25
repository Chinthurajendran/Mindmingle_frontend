import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminHome from "../pages/adminPage/AdminHome"
import AdminUser from "../pages/adminPage/AdminUser"
import UserLoginPage from "../pages/userPage/UserLoginPage"
import AdminPrivateRouter from "../privateRoute/AdminPrivateRouter"
import AdminUserEdit from "../pages/adminPage/AdminUserEdit"
import AdminUserCreate from "../pages/adminPage/AdminUserCreate"
import AdminBloge from "../pages/adminPage/AdminBloge"
import AdminBlogeEdite from "../pages/adminPage/AdminBlogeEdite"

function AdminRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/UserLoginPage" element={<UserLoginPage />} />
          <Route path="/AdminUserEdit" element={<AdminUserEdit />} />
          <Route path="/AdminUserCreate" element={<AdminUserCreate />} />
          <Route path="/AdminBlogeEdite" element={<AdminBlogeEdite />} />
          <Route element={<AdminPrivateRouter />}>
            <Route path="/AdminHome" element={<AdminHome />}>
              <Route path="AdminUser" element={<AdminUser />} />
              <Route path="AdminBloge" element={<AdminBloge />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AdminRouter
