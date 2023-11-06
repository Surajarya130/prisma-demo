"use client";

import React, { FormEvent, useEffect, useState } from "react";

import { createUser, deleteUser, getAllUsers, updateUser } from "@/lib/actions/user.action";
import Loader from "@/components/Loader";

export default function Home() {
  type User = { id: string; name: string; email: string };

  const [formState, setFormState] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userDeleted, setUserDeleted] = useState(false);
  const [userData, setUserData] = useState<{ id: string; name: string; email: string }[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitted(true);
      if (isEditing && editingUser) {
        await updateUser({ id: editingUser.id, email: formState.email, name: formState.name });
        setIsEditing(false);
      } else {
        await createUser({ id: "", name: formState.name, email: formState.email });
      }
      setFormState({ name: "", email: "" });
      setIsSubmitted(false);
    } catch (error: any) {
      setIsSubmitted(false);
      console.error(error.message);
      throw new Error(`Something went wrong, User not created. Original error: ${error.message}`);
    }
  };

  const getUsers = async () => {
    const data = await getAllUsers();
    setUserData(data);
  };

  const removeUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUserDeleted(true);
    } catch (error) {
      throw new Error("Something went wrong, User not deleted");
    }
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  useEffect(() => {
    getUsers();
    if (userDeleted) {
      setUserDeleted(false);
    }
    if (editingUser && isEditing) {
      setFormState(editingUser);
    }
  }, [isSubmitted, userDeleted, editingUser, isEditing]);

  return (
    <main className="flex min-h-screen flex-col items-center  p-24 ">
      <h1 className="text-3xl">CRUD using Prisma + MongoDB</h1>

      <section className="mt-20">
        <form className="flex" onSubmit={handleAddUser}>
          <div className="mr-5">
            <label htmlFor="name">Name</label>
            <input
              className="ml-2 border border-2 px-4 py-2 rounded"
              type="text"
              placeholder="Name..."
              value={formState.name}
              onChange={handleChange}
              name="name"
              required
            />
          </div>
          <div className="">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="ml-2 border border-2 px-4 py-2 rounded"
              placeholder="Email..."
              value={formState.email}
              onChange={handleChange}
              name="email"
              required
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center ml-5"
          >
            {isSubmitted ? (
              <>
                <Loader />
                Loading...
              </>
            ) : (
              "Add User"
            )}
          </button>
        </form>
      </section>

      {/* Tables of user */}
      <section className="mt-10">
        <div className="w-full max-w-screen-xl mx-auto">
          <table className="min-w-full bg-white border shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-center font-semibold">Edit</th>
                <th className="px-6 py-3 text-center font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userData?.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      onClick={() => editUser(user)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(id) => removeUser(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
