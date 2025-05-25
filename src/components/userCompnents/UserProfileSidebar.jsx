import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/slices/UserAuthentication"
import { clearTokens } from "../../store/slices/UserToken"
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/UserInterceptor"
import { User, FileText, LogOut } from "lucide-react"

function UserProfileSidebar() {
  const [selected, setSelected] = useState("Profile")
  const user_id = useSelector((state) => state.userAuth.userid)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const menuItems = [
    {
      name: "Profile",
      icon: <User className="w-5 h-5" />,
      link: "UserProfile",
    },
    {
      name: "Your Blogs",
      icon: <FileText className="w-5 h-5" />,
      link: "UserBlogs",
    },
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
    <aside className="w-full max-w-xs bg-white  shadow-lg p-6 flex flex-col justify-between h-[88.5vh] sticky top-8">
      <nav className="space-y-3">
        {menuItems.map(({ name, icon, link }) => (
          <Link
            key={name}
            to={link}
            onClick={() => setSelected(name)}
            className={`flex items-center gap-4 px-5 py-3 rounded-lg font-semibold transition ${
              selected === name
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              {icon}
            </div>
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogoutSubmit}
        className="flex items-center gap-3 px-5 py-3 w-full rounded-lg text-red-600 font-semibold hover:bg-red-100 transition"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  )
}

export default UserProfileSidebar
