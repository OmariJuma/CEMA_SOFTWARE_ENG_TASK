"use client";
import { useAuthCheck } from "../hooks/useAuthCheck";
import NavBar from "./NavBar";

export default function NavBarWrapper() {
  
  const { userData } = useAuthCheck(false);
  return <div>{userData ? <NavBar userData={userData}/> : null}</div>;
}