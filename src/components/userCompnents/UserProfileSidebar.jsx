import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/slices/userAuthentication"
import { clearTokens } from "../../store/slices/userToken"
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/userInterceptor"
import { User, FileText, LogOut } from "lucide-react"

function UserProfileSidebar() {
  const [selected, setSelected] = useState("Profile")
  const user_id = useSelector((state) => state.userAuth.userid)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const menuItems = [
    { name: "Profile", icon: <User className="h-5 w-5" />, link: "UserProfile" },
    { name: "Your Blogs", icon: <FileText className="h-5 w-5" />, link: "UserBlogs" },
  ]

  const handleLogoutSubmit = async () => {
    if (!user_id) {
      toast.error("No user ID found. Please log in again.")
      return
    }

    try {
      const res = await axiosInstance.put(`user_logout/${user_id}`)
      if (res.status === 200) {
        dispatch(logout())
        dispatch(clearTokens())
        navigate("/")
        toast.success(res.data.message)
      }
    } catch (error) {
      const detail = error.response?.data?.detail
      if (Array.isArray(detail)) {
        toast.error(detail.map((err) => err.msg).join(", "))
      } else {
        toast.error(detail || "Logout failed. Please try again.")
      }
    }
  }

  return (
    <aside className="w-full max-w-xs bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between h-[90vh] sticky top-8">
      <div>
        <h2 className="text-blue-700 text-xl font-bold mb-6 tracking-wide">User Dashboard</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              onClick={() => setSelected(item.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-200 ${
                selected === item.name
                  ? "bg-blue-100 text-blue-800 font-semibold shadow-sm scale-[1.02]"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <div className="p-1.5 rounded-full bg-blue-50 text-blue-700">{item.icon}</div>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t pt-5 mt-6">
        <button
          onClick={handleLogoutSubmit}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 font-semibold hover:bg-red-100 transition duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default UserProfileSidebar
