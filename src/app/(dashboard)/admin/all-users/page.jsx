"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import UserTable from "@/components/Dashboard/UserTable";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sazeduzzaman Saju",
      email: "saju@example.com",
      role: "admin",
      status: "active",
      joinDate: "2024-01-15",
      avatar: "/assets/sazeduzzaman.jpg",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-02-20",
      avatar: "/assets/avatar-default.jpg",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      status: "inactive",
      joinDate: "2024-03-10",
      avatar: "/assets/avatar-default.jpg",
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <>
      <UserTable filteredUsers={filteredUsers} handleDeleteUser={handleDeleteUser}/>
    </>
  );
}