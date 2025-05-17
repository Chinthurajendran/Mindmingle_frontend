import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "../../components/userCompnents/UserHeader";
import UserProfileSidebar from "../../components/userCompnents/UserProfileSidebar";
function UserProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <UserHeader />
      

      <div className="flex mt-20">

        <div className="w-1/6">
          <UserProfileSidebar />
        </div>

        <div className="w-5/6 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
