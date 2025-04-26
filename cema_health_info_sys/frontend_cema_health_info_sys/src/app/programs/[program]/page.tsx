"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthCheck } from "@/app/hooks/useAuthCheck";

interface User {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
}

interface Program {
  id: string;
  program_name: string;
  program_description: string;
}

const AddUserToProgram = () => {
  const router = useRouter();
  const params = useParams();
  const { isLoading: authLoading } = useAuthCheck();
  const [users, setUsers] = useState<User[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [usersResponse, programResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/healthProgram`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        if (!usersResponse.ok || !programResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const usersData = await usersResponse.json();
        const programsData = await programResponse.json();
        
        // Filter out admin users
        const nonAdminUsers = usersData.filter((user: User) => !user.is_admin);
        setUsers(nonAdminUsers);
        
        // Find the current program
        const currentProgram = programsData.find((p: Program) => p.id === params.program);
        setProgram(currentProgram);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.program]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/healthProgram/${params.program}/patients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: selectedUser,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to enroll user");
      }

      toast.success("User enrolled successfully");
      router.push("/programs");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error enrolling user"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!program) {
    return <div>Program not found</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl text-gray-700 font-bold mb-6 text-center">
          {program.program_name}
        </h2>
        <p className="text-gray-600 mb-6 text-center">{program.program_description}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="user"
              className="block text-gray-700 font-bold mb-2"
            >
              Select User to Enroll
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full text-gray-700 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            disabled={submitting}
          >
            {submitting ? "Enrolling..." : "Enroll User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserToProgram;