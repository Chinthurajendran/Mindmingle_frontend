import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { UserIcon } from "@heroicons/react/20/solid"

function UserHeader() {
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated)

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-700 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-white text-3xl font-extrabold hover:text-blue-300 transition">
          MindMingle
        </Link>

        <nav>
          {isAuthenticated ? (
            <Link to="/UserProfilePage/UserProfile" className="group relative inline-flex items-center p-1 rounded-full hover:bg-blue-600 transition">
              <UserIcon className="w-9 h-9 text-white group-hover:text-blue-200 transition" />
              <span className="sr-only">User Profile</span>
            </Link>
          ) : (
            <Link to="/UserLoginPage">
              <button className="bg-white text-blue-700 font-semibold py-2 px-6 rounded-md hover:bg-blue-100 transition">
                Sign In
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default UserHeader
