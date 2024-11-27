import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Ensure this is set up for Tailwind
import {ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [emailValidation, setEmailValidation] = useState("")

  
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      setError("Error fetching data from API.");
    }
  };
  
  useEffect(() => {
    fetchUsers();
  },[]);
  const handleAddUser = async () => {
    try {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      const email = editingUser.email
      if (!emailRegex.test(email)) {
        setEmailValidation("Invalid Email Format");
        return;
      }
      else
      {
        setEmailValidation("")
        }
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        {
          name: `${editingUser.firstName} ${editingUser.lastName}`,
          email: email,
          department: editingUser.department,
        }
      );
      setUsers([...users, response.data]);
      setNewUser({ firstName: "", lastName: "", email: "", department: "" });
      toast.success("User Added Successfuly!")
    } catch (error) {
      setError("Error adding new user.");
    }
  };

  const handleEditUser = async () => {
    try {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(editingUser.email)) {
        setEmailValidation("Invalid Email Format");
        return;
      }
      else
      {
        setEmailValidation("")
      }
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${editingUser.id}`,
        {
          name: `${editingUser.firstName} ${editingUser.lastName}`,
          email: editingUser.email,
          department: editingUser.department,
        }
      );
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? response.data : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
      toast.success("User Updated Successfully!")
    } catch (error) {
      setError("Error updating user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User Deleted Successfully!")
    } catch (error) {
      setError("Error deleting user.");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-slate-300">
      <h1 className="text-2xl font-bold text-center mb-4">
        USER MANAGEMENT DASHBOARD
      </h1>
      {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}
      {emailValidation && (
        <div className="bg-red-500 text-white p-2 mb-4">{emailValidation}</div>
      )}

      {/* User List */}
      <div className="mb-4 flex justify-center">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() =>
            setEditingUser({
              firstName: "",
              lastName: "",
              email: "",
              department: "",
            })
          }
        >
          Add New User
        </button>
      </div>

      {/* Add/Edit User Form */}
      {editingUser !== null && (
        <div className="mt-6 bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-4">
            {editingUser.id ? "Edit User" : "Add New User"}
          </h2>
          <input
            type="text"
            className="border p-2 mb-2 w-full"
            placeholder="First Name"
            value={editingUser.firstName}
            onChange={(e) =>
              setEditingUser({ ...editingUser, firstName: e.target.value })
            }
          />
          <input
            type="text"
            className="border p-2 mb-2 w-full"
            placeholder="Last Name"
            value={editingUser.lastName}
            onChange={(e) =>
              setEditingUser({ ...editingUser, lastName: e.target.value })
            }
          />
          <input
            type="email"
            className="border p-2 mb-2 w-full"
            placeholder="Email"
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
          />
          <input
            type="text"
            className="border p-2 mb-2 w-full"
            placeholder="Department"
            value={editingUser.department}
            onChange={(e) =>
              setEditingUser({ ...editingUser, department: e.target.value })
            }
          />
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
              onClick={editingUser.id ? handleEditUser : handleAddUser}
            >
              {editingUser.id ? "Save Changes" : "Add User"}
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-100 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Department:</strong> {user.department}
              </p>
            </div>
            <div className="space-y-2">
              <button
                className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                onClick={() =>
                  setEditingUser({
                    id: user.id,
                    firstName: user.name.split(" ")[0],
                    lastName: user.name.split(" ")[1],
                    email: user.email,
                    department: user.department,
                  })
                }
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
