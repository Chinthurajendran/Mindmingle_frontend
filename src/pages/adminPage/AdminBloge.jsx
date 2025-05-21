import React, { useEffect, useState } from "react"
import { PlusSquare, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/adminInterceptor"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

function BlogeCard({ image, title, description, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-xl">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onEdit}
            className="flex items-center text-blue-600 hover:underline"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center text-red-600 hover:underline"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminBloge() {
  const navigate = useNavigate()
  const [bloge, setBloge] = useState([])

  const fetchbloge = async () => {
    try {
      const response = await axiosInstance.get(`bloge_list`)
      if (response.status === 200) {
        setBloge(response.data.bloges)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast.error("Failed to load blogs")
    }
  }

  useEffect(() => {
    fetchbloge()
  }, [])

  const handleEdit = (id) => {
    navigate(`/AdminBlogeEdite`, { state: { BlogeID: id } })
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.put(`bloge_delete/${id}`)
        if (res.status === 200) {
          Swal.fire("Deleted!", "The blog has been deleted.", "success")
          fetchbloge()
        }
      } catch (error) {
        console.error("Delete failed:", error)
        toast.error("Failed to delete blog")
      }
    }
  }

  return (
    <div className="h-[85vh] bg-white flex flex-col items-center py-10 space-y-6">
      <div className="w-full max-w-6xl flex-1 overflow-y-auto px-2">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {bloge.map((blog, index) => (
            <BlogeCard
              key={index + blog.blog_uid}
              image={blog.photo}
              title={`Blog #${index + 1}`}
              description={blog.description}
              onEdit={() => handleEdit(blog.blog_uid)}
              onDelete={() => handleDelete(blog.blog_uid)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminBloge
