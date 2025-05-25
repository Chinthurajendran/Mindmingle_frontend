import React, { useState } from "react"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import axiosInstance from "../../Interceptors/UserInterceptor"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

function CreateBlog() {
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)

  const user_id = useSelector((state) => state.userAuth.userid)

  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setImage(selectedFile)
      setPhotoPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = []

    if (!image) {
      errors.push("Photo is required.")
    } else {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!allowedTypes.includes(image.type)) {
        errors.push("Photo must be a JPG or PNG file.")
      }

      if (image.size > 1024 * 1024) {
        errors.push("Photo size must be less than 1MB.")
      }
    }

    const descWords = description.trim().split(/\s+/)
    if (descWords.length < 50) {
      errors.push("Description should have at least 50 words.")
    }

    if (errors.length > 0) {
      setFormError(errors.join(" "))
      return
    }

    setIsSubmitting(true)
    setFormError("")

    if (errors.length > 0) {
      setFormError(errors.join(" "))
      return
    }

    setIsSubmitting(true)
    setFormError("")

    try {
      const formData = new FormData()
      formData.append("description", description)
      formData.append("photo", image)

      const response = await axiosInstance.post(`blogcreate/${user_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (response.status === 201) {
        toast.success(response.data.message)
        navigate("/UserProfilePage/UserBlogs")
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const detail = error.response.data.detail
        if (Array.isArray(detail)) {
          setFormError(detail.map((err) => err.msg).join(", "))
        } else if (typeof detail === "string") {
          setFormError(detail)
        } else {
          setFormError("Something went wrong. Please try again.")
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create New Blog
        </h2>
        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {image && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-4 rounded-lg w-full h-60 object-cover"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Description
            </label>
            <textarea
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write something interesting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-6 rounded-md"
          >
            {isSubmitting ? "Publishing Blog..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateBlog
