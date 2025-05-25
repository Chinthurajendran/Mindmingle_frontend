import React, { useEffect, useState } from "react"
import { Edit3 } from "lucide-react"
import gallery from "../../assets/gallery.png"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/UserInterceptor"
import { toast } from "react-toastify"

function UserProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: null,
  })

    const userId = useSelector((state) => state.userAuth.userid)
    const user_authenticcated = useSelector(
      (state) => state.userAuth.isAuthenticated
    )

    useEffect(() => {
      if (!user_authenticcated) {
        navigate("/Login_page")
      }
    }, [user_authenticcated, navigate])

  const fetchUserProfile = async () => {
    if (!userId) return
    try {
      const res = await axiosInstance.get(`user_profile/${userId}`)
      if (res.status === 200) {
        const userdata = res.data.user || res.data
        setUser(userdata)
        setFormData({
          username: userdata.username || "",
          email: userdata.email || "",
          image: null,
        })
        if (isVisible) {
          setImagePreview(null)
        }
      }
    } catch (error) {
      toast.error("Failed to fetch user details. Please try again later.")
    }
  }

    useEffect(() => {
      fetchUserProfile()
    }, [userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.put(
        `profile_create/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)
        setIsVisible(true)

        await fetchUserProfile()
      }
    } catch (error) {
      console.error("Update profile error:", error.response?.data || error.message)
      toast.error(error.response?.data?.detail || "Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-96 bg-gray-100">
      <div className="flex flex-col md:flex-row min-h-screen -mt-28 ">
        <div className="flex-1 p-8 mt-22 relative">
          {isVisible ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsVisible(false)}
              >
                <Edit3 size={20} />
              </button>

              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={user?.image || gallery}
                  alt="User Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                />

                <div className="flex flex-col space-y-4">
                  <h2 className="text-xl font-semibold text-blue-700">
                    Personal Details
                  </h2>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col">
                        <span className="text-gray-600">Full Name</span>
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.username ?? "Not provided"}
                          readOnly
                        />
                      </label>

                      <label className="flex flex-col">
                        <span className="text-gray-600">Email ID</span>
                        <input
                          type="email"
                          placeholder="Email ID"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.email ?? "Not provided"}
                          readOnly
                        />
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-6 relative">
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex flex-col items-center gap-4 mb-6">
                  {(imagePreview || user?.image) && (
                    <img
                      src={imagePreview || user?.image}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                    />
                  )}
                  <label className="cursor-pointer bg-gray-300 px-4 py-2 rounded-md text-sm text-center">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div className="flex flex-col space-y-4 mb-6">
                  <h2 className="text-xl font-semibold text-blue-700">
                    Personal Details
                  </h2>

                  <form
                    className="space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col">
                        <span className="text-gray-600">Full Name</span>
                        <input
                          type="text"
                          name="username"
                          placeholder="Full Name"
                          className="w-full p-2 border rounded-md"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </label>

                      <label className="flex flex-col">
                        <span className="text-gray-600">Email ID</span>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email ID"
                          className="w-full p-2 border rounded-md"
                          value={formData.email}
                          onChange={handleChange}
                          readOnly
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={updateProfile}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
