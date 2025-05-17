import { useState } from "react"
import { Link } from "react-router-dom"
import { User, FileText, Wallet, LogOut } from "lucide-react"
import { useDispatch } from "react-redux"
import { logout } from "../../store/slices/userAuthentication"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { clearTokens } from "../../store/slices/userToken"
import axiosInstance from "../../Interceptors/userInterceptor"

function UserProfileSidebar() {
  const [selected, setSelected] = useState("Profile")
  const location = useLocation()
  const user_id = useSelector((state) => state.userAuth.userid)

  const menuItems = [
    {
      name: "Profile",
      icon: <User className="h-5 w-5" />,
      link: "UserProfile",
    },
    {
      name: "Your Bloges",
      icon: <FileText className="h-5 w-5" />,
      link: "UserBlogs",
    },
  ]

  const dispatch = useDispatch()
  const navigate = useNavigate()

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
    <div className="w-64 bg-white p-6 ml-2 rounded-3xl shadow-xl flex flex-col justify-between h-full mt-8">
      <div>
        <h2 className="text-blue-700 font-bold text-lg mb-4 pl-1">User Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              onClick={() => setSelected(item.name)}
              className={`flex items-center gap-3 text-blue-700 font-bold px-4 py-3 rounded-xl transition-all duration-300 ${
                selected === item.name
                  ? "bg-blue-100 scale-[1.03] shadow-sm"
                  : "hover:bg-blue-50 hover:scale-[1.02]"
              }`}
              aria-label={item.name}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t pt-4 mt-6">
        <button
          onClick={handleLogoutSubmit}
          className="flex items-center gap-3 text-red-600 font-bold px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-100 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default UserProfileSidebar
