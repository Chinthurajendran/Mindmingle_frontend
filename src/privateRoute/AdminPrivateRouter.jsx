import React, { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { admin_logout } from "../store/slices/AdminAuthentication"
import { clearAdminTokens } from "../store/slices/AdminToken"
import { useNavigate } from "react-router-dom"

const AdminPrivateRouter = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated_admin
  )

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(admin_logout())
      dispatch(clearAdminTokens())
      navigate("/UserLoginPage")
      setShouldRedirect(true)
    }
  }, [isAuthenticated, dispatch, navigate])

  return <Outlet />
}

export default AdminPrivateRouter
