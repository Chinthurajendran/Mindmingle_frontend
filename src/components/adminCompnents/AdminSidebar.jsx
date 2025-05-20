import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Users, FileText, LogOut } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { admin_logout } from "../../store/slices/adminAuthentication"
import { clearAdminTokens } from "../../store/slices/adminToken"
import axiosInstance from "../../Interceptors/adminInterceptor"
import { toast } from "react-toastify"

function AdminSidebar() {
  const location = useLocation()
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
      } else {
        toast.error("Logout failed. Please try again.")
      }
    }
  }

  // Helper to check if current route matches
  const isActive = (path) => location.pathname.endsWith(path)

  return (
    <aside className="w-1/6 bg-blue-700 text-white min-h-screen p-4 shadow-lg flex flex-col">
      <header className="text-xl font-semibold mb-4">Admin Panel</header>

      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link
              to="AdminUser"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-600 ${
                isActive("AdminUser") ? "bg-blue-900" : ""
              }`}
            >
              <Users className="h-5 w-5 mr-3" /> Users
            </Link>
          </li>

          <li>
            <Link
              to="AdminBloge"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-600 ${
                isActive("AdminBloge") ? "bg-blue-900" : ""
              }`}
            >
              <FileText className="h-5 w-5 mr-3" /> Blogs
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <button
          type="button"
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
