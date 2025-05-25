import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/AdminInterceptor"

function AdminUserEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId

  const [user, setUser] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: null,
  })

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
        setImagePreview(null)
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
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      if (response.status === 200) {
        toast.success(response.data.message)
        navigate('/AdminHome/AdminUser')
        await fetchUserProfile()
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit User Profile</h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-4 md:w-1/3">
            {(imagePreview || user?.image) && (
              <img
                src={imagePreview || user?.image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              />
            )}
            <label className="cursor-pointer bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 text-sm">
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <form
            className="flex-1 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Full Name</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter full name"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  placeholder="Email address"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={updateProfile}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminUserEdit
