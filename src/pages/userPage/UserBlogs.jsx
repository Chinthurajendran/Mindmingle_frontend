import React, { useEffect, useState } from "react"
import { PlusSquare } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import axiosInstance from "../../Interceptors/UserInterceptor"

const baseURL = import.meta.env.VITE_API_LOCAL_URL

function BlogCard({ image, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{description}</p>
      </div>
    </div>
  )
}

function UserBlogs() {
  const navigate = useNavigate()
  const [bloge, setBloge] = useState([])
  const userId = useSelector((state) => state.userAuth.userid)

  useEffect(() => {
    const fetchbloge = async () => {
      try {
        const response = await axiosInstance.get(`bloge_list_profile/${userId}`)
        if (response.status === 200) {
          const bloge_list = response.data.bloges
          setBloge(bloge_list)
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
      }
    }
    fetchbloge()
  }, [])

  const handleCardClick = (id) => {
    navigate(`/EditBloge`, { state: { BlogeID: id } })
  }

  return (
    <div className="h-[80vh] bg-gray-100 flex flex-col items-center py-1 space-y-6">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex items-center space-x-4">
          <PlusSquare className="w-12 h-12 text-gray-500" />
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              No blogs yet
            </h2>
            <p className="text-gray-600">
              Share your thoughts and stories — start by creating your first
              blog post now.
            </p>
          </div>
        </div>
        <Link to="/CreateBlog">
          <button className="bg-blue-700 hover:bg-blue-800 px-6 py-2 text-white rounded-md">
            Explore
          </button>
        </Link>
      </div>

      <div className="w-full max-w-6xl flex-1 overflow-y-auto px-2">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {bloge.map((blog, index) => (
            <BlogCard
              key={index + blog.blog_uid}
              image={blog.photo}
              title={`Blog #${index + 1}`}
              description={blog.description}
              onClick={() => handleCardClick(blog.blog_uid)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserBlogs
