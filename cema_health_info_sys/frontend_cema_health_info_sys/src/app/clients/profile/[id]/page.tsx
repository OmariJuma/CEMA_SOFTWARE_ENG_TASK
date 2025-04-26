"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthCheck } from "@/app/hooks/useAuthCheck";
import { toast } from "react-toastify";

interface HealthProgram {
  id: string;
  program_name: string;
  program_description: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  health_programs: HealthProgram[];
}

export default function ClientProfile() {
  const { id } = useParams();
  const { isLoading: authLoading } = useAuthCheck();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/users/${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error fetching profile"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  if (authLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Client Profile
          </h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Personal Information
              </h2>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span>{" "}
                    {profile.name || "Not provided"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {profile.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span>{" "}
                    {profile.phone || "Not provided"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Address:</span>{" "}
                    {profile.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Enrolled Programs
              </h2>
              {profile.health_programs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.health_programs.map((program) => (
                    <div
                      key={program.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {program.program_name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {program.program_description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Not enrolled in any health programs.
                </p>
              )}
            </div>

            <div className="mt-4 text-gray-500 text-sm">
              <p>
                Member since:{" "}
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}