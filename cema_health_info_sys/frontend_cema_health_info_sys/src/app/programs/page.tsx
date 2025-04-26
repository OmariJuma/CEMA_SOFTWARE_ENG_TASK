"use client";
import { useEffect, useState } from "react";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { toast } from "react-toastify";
import Link from "next/link";
import { PROGRAM_COLORS } from "../utils/cardColors";
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

    fetchPrograms();
  }, []);
  const getRandomColor = () => {
    console.log(Math.random());
    const randomIndex = Math.floor(Math.random() * PROGRAM_COLORS.length);
    return PROGRAM_COLORS[randomIndex];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Health Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {programs.map((program) => (
          <Link
            key={program.id}
            href={`/programs/${program.id}`}
            className={`${getRandomColor()} "rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"`}
          >
            <h2 className="text-center text-xl font-semibold mb-3 underline">
              {program.program_name}
            </h2>
            <p className="text-center text-white">
              {program.program_description}
            </p>
          </Link>
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
