import React, { useEffect, useState } from "react"
import axios from "axios"
import gallery from "../../assets/gallery.png"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

const baseURL = import.meta.env.VITE_API_LOCAL_URL

function UserBody() {
  const [showCommentInput, setShowCommentInput] = useState({})
  const [newComment, setNewComment] = useState({})
  const [comments, setComments] = useState({})
  const [blogs, setBlogs] = useState([])
  const [reload, setReload] = useState(false)

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
      }
    } catch (error) {
      toast.error("Failed to dislike the blog. Please try again.")
    }
  }

  const handleCommentClick = (blog_uid) => {
    setShowCommentInput((prev) => ({ ...prev, [blog_uid]: true }))
  }

  const handleCommentChange = (blog_uid, text) => {
    setNewComment((prev) => ({ ...prev, [blog_uid]: text }))
  }

  const handleCommentSubmit = (blog_uid) => {
    if (!newComment[blog_uid] || !newComment[blog_uid].trim()) return

    const newEntry = {
      username: "You",
      text: newComment[blog_uid],
      timestamp: new Date().toLocaleString(),
    }

    setComments((prev) => ({
      ...prev,
      [blog_uid]: [newEntry, ...(prev[blog_uid] || [])],
    }))

    setNewComment((prev) => ({ ...prev, [blog_uid]: "" }))
  }

  return (
    <div>
      <main className="py-12 px-6 pt-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {blogs.map((blog) => (
            <section
              key={blog?.blog_uid}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              {/* Author Info */}
              <div className="flex items-center mb-6">
                <img
                  src={blog?.image || gallery}
                  alt="Author"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">
                    {blog?.username || "Anonymous"}
                  </p>
                </div>
              </div>

              {/* Blog Content */}
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                {blog?.title || "Blog Post"}
              </h2>
              <img
                src={blog?.photo || "https://via.placeholder.com/800x400"}
                alt="Blog Post"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <p className="text-gray-600 mb-6">{blog?.description}</p>

              {/* Like / Comment Buttons */}
              <div className="flex items-center space-x-6 text-gray-700">
                {blog.likes && blog.likes.includes(user_id)  ? (
                  <div
                    onClick={() => handleDislike(blog.blog_uid)}
                    className="flex items-center cursor-pointer hover:text-blue-700"
                  >
                    <i
                      className="fa fa-thumbs-down mr-2"
                      style={{ fontSize: "20px" }}
                    ></i>
                    <span>Dislike ({blog.total_likes || 0})</span>
                  </div>
                ) : (
                  <div
                    onClick={() => handleLike(blog.blog_uid)}
                    className="flex items-center cursor-pointer hover:text-blue-700"
                  >
                    <i
                      className="fa fa-thumbs-up mr-2"
                      style={{ fontSize: "20px" }}
                    ></i>
                    <span>Like ({blog.total_likes || 0})</span>
                  </div>
                )}

                <button
                  onClick={() => handleCommentClick(blog.blog_uid)}
                  className="flex items-center text-gray-600 hover:text-blue-700"
                >
                  <i
                    className="fa fa-comment mr-2"
                    style={{ fontSize: "24px" }}
                  ></i>
                  <span>Comment</span>
                </button>
              </div>

              {/* Comment Section */}
              {showCommentInput[blog.blog_uid] && (
                <section className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Comments
                  </h3>

                  {/* Comment Input */}
                  <div className="flex space-x-4 mb-6">
                    <img
                      src={blog?.image || gallery}
                      alt="Your Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="w-full">
                      <textarea
                        value={newComment[blog.blog_uid] || ""}
                        onChange={(e) =>
                          handleCommentChange(blog.blog_uid, e.target.value)
                        }
                        placeholder="Add a comment..."
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        rows="3"
                      ></textarea>
                      <button
                        onClick={() => handleCommentSubmit(blog.blog_uid)}
                        className="mt-2 bg-blue-700 text-white py-1.5 px-4 rounded hover:bg-blue-800 text-sm"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {(comments[blog.blog_uid] || []).map((comment, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <img
                          src="https://via.placeholder.com/40"
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm w-full">
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-800">
                              {comment.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {comment.timestamp}
                            </p>
                          </div>
                          <p className="text-sm text-gray-700">
                            {comment.text}
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
      </main>
    </div>
  )
}

export default UserBody
