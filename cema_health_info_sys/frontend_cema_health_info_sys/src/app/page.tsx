"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "./utils/userContext";
import NavBar from "./components/NavBar";
import { useAuthCheck } from "./hooks/useAuthCheck";

export default function Home() {
  const { userData, isLoading } = useAuthCheck();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    userData?.email != null && <div>
      <h1>Welcome, {userData.email}</h1>
      {/* Your dashboard content */}
    </div>
  );
}
