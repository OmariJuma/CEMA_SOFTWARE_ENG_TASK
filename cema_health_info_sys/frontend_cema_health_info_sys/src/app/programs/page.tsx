"use client";
import { useEffect, useState } from "react";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { toast } from "react-toastify";

interface Program {
  id: string;
  program_name: string;
  program_description: string;
}

const Programs = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/healthProgram`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
            setIsLoading(false);
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch programs");
        }
        setIsLoading(false);
        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error fetching programs"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoading) {
      fetchPrograms();
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Health Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-3">{program.program_name}</h2>
            <p className="text-gray-600">{program.program_description}</p>
          </div>
        ))}
      </div>
      {programs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No health programs available.
        </p>
      )}
    </div>
  );
};

export default Programs;