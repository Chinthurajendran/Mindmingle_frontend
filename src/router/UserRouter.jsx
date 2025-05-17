import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import UserLoginPage from "../pages/userPage/userLoginPage"
import EmailVerification from "../pages/userPage/EmailVerification"
import OTPVerification from "../pages/userPage/OTPVerification"
import SignUpPage from "../pages/userPage/SignUpPage"
import UserHome from "../pages/userPage/UserHome"
import UserProfilePage from "../pages/userPage/UserProfilePage"
import UserProfile from "../pages/userPage/UserProfile"
import UserBlogs from "../pages/userPage/UserBlogs"
import AdminHome from "../pages/adminPage/AdminHome"
import UserPrivateRouter from "../privateRoute/userPrivateRouter"
import CreateBlog from "../pages/userPage/CreateBlog"

function UserRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/AdminHome" element={<AdminHome />}></Route>
          <Route path="/UserLoginPage" element={<UserLoginPage />} />
          <Route path="/EmailVerification" element={<EmailVerification />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
          <Route path="/" element={<UserHome />} />

          <Route element={<UserPrivateRouter />}>
            <Route path="/UserProfilePage" element={<UserProfilePage />}>
              <Route path="UserProfile" element={<UserProfile />} />
              <Route path="UserBlogs" element={<UserBlogs />} />
            </Route>
            <Route path="/CreateBlog" element={<CreateBlog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default UserRouter
