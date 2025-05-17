import React from "react"
import axios from "axios"
import.meta.env

const baseURL = import.meta.env.VITE_API_LOCAL_URL

function New() {
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.get(`${baseURL}/auth/home`)
      if (res.status === 200) {
        console.log("Login success:", res.data)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data.detail || "Login failed")
      } else {
        console.log(
          "An unexpected error occurred. Please try again.",
          error.message
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-purple-700">Chinthu</h1>
        <p className="mt-4 text-gray-600">
          Welcome to your Tailwind styled page!
        </p>
        <button
          className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          onClick={handleSubmit}
        >
          Click Me
        </button>
      </div>
    </div>
  )
}

export default New
