import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { UserIcon } from "@heroicons/react/20/solid"

function UserHeader() {
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated)
  return (
    <div>
      <header className="fixed top-0 left-0 w-full bg-blue-700 text-white py-6 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to={"/"}>
            <h1 className="text-3xl font-bold">MindMingle</h1>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                {isAuthenticated ? (
                  <>
                    <Link to={"/UserProfilePage/UserProfile"}>
                      <button className="relative transition-all duration-300 p-1 text-white">
                        <UserIcon className="w-9 h-9" />
                      </button>
                    </Link>
                  </>
                ) : (
                  <Link to="/UserLoginPage">
                    <button className="bg-white text-blue-700 border border-blue-700 hover:bg-blue-100 font-bold py-2 px-4 rounded">
                      <span>Sign In</span>
                    </button>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default UserHeader
