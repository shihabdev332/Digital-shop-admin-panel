import React, { useEffect, useState } from "react";
import { serverUrl } from "../../config";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../component/ui/Loader";
import Title from "../component/Title";
import { IoPersonAdd } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import NewUserForm from "../component/newUserForm";

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Get admin token from localStorage
  const token = localStorage.getItem("adminToken");

  // ✅ Fetch users list
  const getUserList = async () => {
    if (!token) {
      toast.error("Admin not logged in!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(serverUrl + "/api/user/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response?.data;
      if (data?.success) {
        setUsersList(data?.users);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Users list fetching error", error.message);
      toast.error(error?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  // ✅ Remove user
  const handleRemoveUser = async (_id) => {
    const confirmRemoval = window.confirm("Do you want to remove this user?");
    if (!confirmRemoval) return;

    if (!token) {
      toast.error("Admin not logged in!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        serverUrl + "/api/user/remove",
        { _id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response?.data;
      if (data?.success) {
        toast.success(data?.message);
        await getUserList();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("User remove error", error);
      toast.error(error?.message || "Failed to remove user");
    } finally {
      setLoading(false);
    }
  };

  const openLoginForm = () => {
    setSelectedUser(null);
    setIsOpen(true);
  };

  const closeLoginForm = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="flex items-center justify-between max-w-3xl">
            <Title> User List</Title>
            <button
              onClick={openLoginForm}
              className="flex items-center gap-1 bg-black/80 text-white px-6 text-sm font-semibold py-2 rounded-md hover:bg-black duration-300 transition-colors mt-2 cursor-pointer"
            >
              Add User <IoPersonAdd />
            </button>
          </div>

          {usersList?.length > 0 ? (
            <div className="max-w-3xl flex flex-col gap-2 mt-2">
              <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm my-1.5">
                <b className="hidden md:inline-block">Name</b>
                <b>Email</b>
                <b className="hidden md:inline-block">Admin</b>
                <b className="text-center">Action</b>
                <b className="text-center">Edit</b>
              </div>

              {usersList?.map((item) => (
                <div
                  key={item?._id}
                  className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm my-1.5"
                >
                  <p className="hidden md:inline-block font-semibold">{item?.name}</p>
                  <p className="font-medium">{item.email}</p>
                  <p
                    className={`${
                      item?.isAdmin ? "font-semibold" : "font-normal"
                    } hidden md:inline-block`}
                  >
                    {item?.isAdmin ? "Admin" : "User"}
                  </p>

                  <FaTrash
                    onClick={() => handleRemoveUser(item?._id)}
                    className="text-lg text-gray-700 cursor-pointer hover:text-red-600 duration-300 ease-in-out text-center w-full"
                  />
                  <button
                    onClick={() => {
                      setSelectedUser(item);
                      setIsOpen(true);
                    }}
                    className="text-base cursor-pointer hover:text-green-600 duration-300 ease-in-out"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2">
              <p className="mt-2">You have no users in your database</p>
              <button
                onClick={openLoginForm}
                className="flex items-center gap-2 bg-black/70 text-white px-4 font-semibold text-sm py-1.5 rounded-md hover:bg-black duration-300 transition-colors"
              >
                Add User <IoPersonAdd />
              </button>
            </div>
          )}
        </div>
      )}

      <NewUserForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        close={closeLoginForm}
        getUserList={getUserList}
        setSelectedUser={setSelectedUser}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Users;
