"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthCheck } from "@/app/hooks/useAuthCheck";

const CreateProgram = () => {
  const router = useRouter();
  const { isLoading } = useAuthCheck();
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/healthProgram`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            program_name: programName,
            program_description: programDescription,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create program");
      }

      toast.success("Health program created successfully");
      router.push("/programs");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error creating program"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl text-gray-700 font-bold mb-6 text-center">
          Create Health Program
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="program_name"
              className="block text-gray-700 font-bold mb-2"
            >
              Program Name
            </label>
            <input
              type="text"
              id="program_name"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="w-full text-gray-700 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="program_description"
              className="block text-gray-700 font-bold mb-2"
            >
              Program Description
            </label>
            <textarea
              id="program_description"
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              className="w-full text-gray-700 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Program"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProgram;