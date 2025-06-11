import React, { useEffect, useState } from "react"
import axios from "axios"
import gallery from "../../assets/gallery.png"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

const baseURL = import.meta.env.VITE_API_LOCAL_URL

function UserBody() {
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [reload, setReload] = useState(false)
  const [formData, setFormData] = useState({
    comments: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(2)

  const user_id = useSelector((state) => state.userAuth.userid)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseURL}/auth/bloge_list`)
        if (response.status === 200) {
          setBlogs(response.data.bloges)
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
      }
    }
    fetchBlogs()
  }, [reload])

  const handleLike = async (blog_uid) => {
    try {
      const response = await axios.post(
        `${baseURL}/auth/like/${user_id}/${blog_uid}`
      )
      if (response.status === 201) {
        toast.success(response.data.message)
        setReload((prev) => !prev)
      }
    } catch (error) {
      toast.error("Failed to like the blog. Please try again.")
    }
  }

  const handleDislike = async (blog_uid) => {
    try {
      const response = await axios.post(
        `${baseURL}/auth/dislike/${user_id}/${blog_uid}`
      )
      if (response.status === 201) {
        toast.success(response.data.message)
        setReload((prev) => !prev)
        setFormData()
      }
    } catch (error) {
      toast.error("Failed to dislike the blog. Please try again.")
    }
  }

  const handleCommentClick = () => {
    setShowCommentInput((prev) => !prev)
  }

  const handleCommentSubmit = async (blog_uid) => {
    if (formData.comments.trim().length === 0) {
      toast.error("Please add something before posting a comment.")
      return
    }

    try {
      const response = await axios.post(
        `${baseURL}/auth/comment/${user_id}/${blog_uid}`,
        formData
      )
      if (response.status === 201) {
        toast.success(response.data.message)
        setReload((prev) => !prev)
        setFormData({ comments: "" })
      }
    } catch (error) {
      toast.error("Failed to add comment. Please try again.")
    }
  }

  const indexOfLastBlog = currentPage * usersPerPage
  const indexOfFirstBlog = indexOfLastBlog - usersPerPage
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog)
  const totalPages = Math.ceil(blogs.length / usersPerPage)

  return (
    <div>
      <main className="py-12 px-6 pt-24">
        <div className="max-w-2xl mx-auto space-y-12">
          {currentBlogs.map((blog) => (
            <section
              key={blog?.blog_uid}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-6">
                <img
                  src={blog?.user_image || gallery}
                  alt="Author"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">
                    {blog?.username || "Anonymous"}
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-semibold text-gray-800 mb-4"></h2>
              <img
                src={blog?.photo || "https://via.placeholder.com/800x400"}
                alt="Blog Post"
                className="w-full max-w-2xl h-auto max-h-[400px] object-cover rounded-lg mb-6 mx-auto"
              />

              <p className="text-gray-600 mb-6">{blog?.description}</p>

              <div className="flex items-center space-x-6 text-gray-700">
                <div
                  onClick={() => {
                    if (user_id !== null && user_id !== undefined) {
                      handleLike(blog.blog_uid)
                    }
                  }}
                  className="flex items-center cursor-pointer hover:text-blue-700"
                >
                  <i
                    className="fa fa-thumbs-up mr-2"
                    style={{ fontSize: "20px" }}
                  ></i>
                  <span>Like ({blog.total_likes || 0})</span>
                </div>

                <div
                  onClick={() => {
                    if (user_id !== null && user_id !== undefined) {
                      handleDislike(blog.blog_uid)
                    }
                  }}
                  className="flex items-center cursor-pointer hover:text-blue-700"
                >
                  <i
                    className="fa fa-thumbs-down mr-2"
                    style={{ fontSize: "20px" }}
                  ></i>
                  <span>Dislike ({blog.total_dislikes || 0})</span>
                </div>

                {/* {blog.likes && blog.likes.includes(user_id) ? (
                  <div
                    onClick={() => {
                      if (user_id !== null && user_id !== undefined) {
                        handleDislike(blog.blog_uid)
                      }
                    }}
                    className="flex items-center cursor-pointer hover:text-blue-700"
                  >
                    <i
                      className="fa fa-thumbs-down mr-2"
                      style={{ fontSize: "20px" }}
                    ></i>
                    <span>Dislike ({blog.total_dislikes || 0})</span>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (user_id !== null && user_id !== undefined) {
                        handleLike(blog.blog_uid)
                      }
                    }}
                    className="flex items-center cursor-pointer hover:text-blue-700"
                  >
                    <i
                      className="fa fa-thumbs-up mr-2"
                      style={{ fontSize: "20px" }}
                    ></i>
                    <span>Like ({blog.total_likes || 0})</span>
                  </div>
                )} */}

                <button
                  onClick={handleCommentClick}
                  className="flex items-center text-gray-600 hover:text-blue-700"
                >
                  <i
                    className="fa fa-comment mr-2"
                    style={{ fontSize: "24px" }}
                  ></i>
                  <span>Comment</span>
                </button>
              </div>

              {showCommentInput && (
                <section className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Comments
                  </h3>

                  <div className="flex space-x-4 mb-6">
                    <img
                      src={blog?.user_image || gallery}
                      alt="Your Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="w-full">
                      <textarea
                        value={formData.comments}
                        onChange={(e) =>
                          setFormData({ ...formData, comments: e.target.value })
                        }
                        placeholder="Add a comment..."
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        rows="3"
                        disabled={user_id === null || user_id === undefined}
                      ></textarea>
                      <button
                        onClick={() => handleCommentSubmit(blog.blog_uid)}
                        className="mt-2 bg-blue-700 text-white py-1.5 px-4 rounded hover:bg-blue-800 text-sm"
                        disabled={user_id === null || user_id === undefined}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(blog.comments || []).map((comment, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <img
                          src={comment?.user_photo || gallery}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm w-full">
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-800">
                              {comment.username || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-700">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </section>
          ))}
        </div>

        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all 
      ${
        currentPage === 1
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
          >
            ← Previous
          </button>

          <span className="px-5 py-2 text-lg font-bold text-gray-800 bg-gray-200 rounded-md shadow-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold transition-all 
      ${
        currentPage === totalPages
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  )
}

export default UserBody
