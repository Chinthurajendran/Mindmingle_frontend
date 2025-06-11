// import React from 'react'
// import UserRouter from './UserRouter'
// import AdminRouter from './AdminRouter'
// import { useSelector } from 'react-redux'

// function Indexs() {
//     const isAuthenticated = useSelector(
//     (state) => state.adminAuth.admin_role
//   )
//   console.log("111110",isAuthenticated)
//     // const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated)
//   return (
//     <div>
//       <UserRouter/>
//       <AdminRouter/>
//     </div>
//   )
// }

// export default Indexs



import React from "react"
import { useSelector } from "react-redux"
import UserRouter from "./UserRouter"
import AdminRouter from "./AdminRouter"

function Indexs() {
  const userRole = useSelector((state) => state.userAuth.user_role)
  const adminRole = useSelector((state) => state.adminAuth.admin_role)

  if (adminRole === "admin") {
    return <AdminRouter />
  } else if (userRole === "user") {
    return <UserRouter />
  } else { 
    return <UserRouter />
  }
}

export default Indexs
