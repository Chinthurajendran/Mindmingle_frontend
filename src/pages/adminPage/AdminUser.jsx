import React, { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";

function AdminUser() {
  const [users, setUsers] = useState([]);

  // Simulate fetching user data (replace with actual API call)
  useEffect(() => {
    // Example data (replace with API data)
    setUsers([
      {
        id: 1,
        image: "https://via.placeholder.com/50",
        username: "John Doe",
        email: "john@example.com",
        loginStatus: "Active",
      },
      {
        id: 2,
        image: "https://via.placeholder.com/50",
        username: "Jane Smith",
        email: "jane@example.com",
        loginStatus: "Inactive",
      },
      // Add more users as needed
    ]);
  }, []);

  const handleDelete = (userId) => {
    // Logic to delete user (API call)
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleEdit = (userId) => {
    // Logic to edit user (navigate to edit user page)
    console.log("Edit user with id:", userId);
  };

  const handleCreateUser = () => {
    // Logic to navigate to user creation page
    console.log("Create new user");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">User List</h2>
        <button
          onClick={handleCreateUser}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Create User
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Login Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <td className="px-6 py-4">
                  <img
                    src={user.image}
                    alt="User"
                    className="w-14 h-14 object-cover rounded-full border border-gray-200"
                  />
                </td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.loginStatus === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.loginStatus}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-3">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="text-yellow-500 hover:text-yellow-600 transition duration-150"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-600 transition duration-150"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUser;
