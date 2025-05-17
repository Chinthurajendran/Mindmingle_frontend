import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Users, FileText, LogOut } from "lucide-react"
import { useLocation } from "react-router-dom"
import { admin_logout } from "../../store/slices/adminAuthentication"
import { clearAdminTokens } from "../../store/slices/adminToken"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/adminInterceptor"
import { toast } from "react-toastify"

function AdminSidebar() {
  // const [isPoliciesOpen, setIsPoliciesOpen] = useState(false)
  // const [isAgencyOpen, setIsAgencyOpen] = useState(false)

  // const handleLogout = () => {
  //   // Implement your logout logic here (e.g., clearing tokens, redirecting to login page)
  //   console.log("User logged out")
  // }

  const location = useLocation()
  const user_id = useSelector((state) => state.userAuth.userid)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogoutSubmit = async () => {
    try {
      const res = await axiosInstance.put(`admin_logout`)
      if (res.status === 200) {
        dispatch(admin_logout())
        dispatch(clearAdminTokens())
        navigate("/UserLoginPage")
        toast.success(res.data.message)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const detail = error.response.data.detail
        if (Array.isArray(detail)) {
          toast.error(detail.map((err) => err.msg).join(", "))
        } else if (typeof detail === "string") {
          toast.error(detail)
        } else {
          toast.error("Logout failed. Please try again.")
        }
      }
    }
  }

  return (
    <aside className="w-1/6 bg-blue-700 text-white min-h-screen p-4 shadow-lg">
      <header className="text-xl font-semibold mb-4">Admin Panel</header>

      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="AdminUser"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-600"
            >
              <Users className="h-5 w-5 mr-3" /> Users
            </Link>
          </li>

          <li>
            <Link
              to="*"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-600"
            >
              <FileText className="h-5 w-5 mr-3" /> Blogs
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogoutSubmit}
          className="flex items-center px-4 py-3 mt-4 rounded-lg hover:bg-blue-600 w-full"
        >
          <LogOut className="h-5 w-5 mr-3" /> Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
