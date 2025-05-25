import { Navigate, Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/UserAuthentication"
import { clearTokens } from "../store/slices/UserToken"
import { useEffect, useState } from "react"
import axiosInstance from "../Interceptors/UserInterceptor"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const UserPrivateRouter = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isUser = useSelector((state) => state.userAuth.userid)
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated)
  const istoken = useSelector((state) => state.userToken.user_access_token)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const handleLogoutSubmit = async () => {
    if (!isUser) {
      console.log("No user ID found. Please log in again.")
      return
    }

    try {
      const res = await axiosInstance.put(`user_logout/${isUser}`)

      if (res.status === 200) {
        dispatch(logout())
        dispatch(clearTokens())
        console.log("Logout successful.")
      }
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  useEffect(() => {
    if (!isAuthenticated || istoken == null) {
      handleLogoutSubmit()
      dispatch(logout())
      dispatch(clearTokens())
      setShouldRedirect(true)
    }
  }, [istoken])


  if (shouldRedirect) {
    return <Navigate to="/UserLoginPage" replace />
  }

  return <Outlet />
}

export default UserPrivateRouter
