"use client";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "../hooks/useAuthCheck";
import useGetClients from "../hooks/useGetClients";

const AllClients = () => {
    const {isLoading, users} = useGetClients();
    const router = useRouter();
    const { isLoading: authLoading } = useAuthCheck();

    if (authLoading || isLoading) {
        return <div>Loading...</div>;
      }
    
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">All Clients</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                  {user.name || "No name provided"}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  {user.phone && (
                    <p>
                      <span className="font-medium">Phone:</span> {user.phone}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/clients/${user.id}`)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
          {users.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No clients found in the system.
            </p>
          )}
        </div>
      );
    }

export default AllClients;