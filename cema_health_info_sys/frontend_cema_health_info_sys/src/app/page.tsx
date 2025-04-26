"use client";
import Link from "next/link";
import { useAuthCheck } from "./hooks/useAuthCheck";
import useGetClients from "./hooks/useGetClients";

export default function Home() {
  const { userData, isLoading: authLoading } = useAuthCheck();
  const { users, isLoading: dataLoading, programs } = useGetClients();

  if (authLoading || dataLoading) {
    return <div>Loading...</div>;
  }

  return (
    userData?.email != null && (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome, {userData.email}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/programs">
            <div className="bg-blue-500 text-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-2">Health Programs</h2>
              <p className="text-4xl font-bold">{programs.length}</p>
              <p className="mt-2">View All Programs</p>
            </div>
          </Link>
          
          <Link href="/clients">
            <div className="bg-green-500 text-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-2">Clients</h2>
              <p className="text-4xl font-bold">{users.length}</p>
              <p className="mt-2">Total Clients</p>
            </div>
          </Link>
        </div>
      </div>
    )
  );
}