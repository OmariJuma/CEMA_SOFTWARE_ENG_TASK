import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;    
  is_admin: boolean;
}

interface Program {
  id: string;
  program_name: string;
  program_description: string;
}

export default function useGetClients() {
  const [users, setUsers] = useState<User[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams(); // Assuming you are using Next.js with dynamic routes
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
          }),
        ]);

        if (!usersResponse.ok || !programResponse.ok) {
          console.log(usersResponse, programResponse);
          throw new Error("Failed to fetch data");
        }

        const usersData = await usersResponse.json();
        const programsData = await programResponse.json();

        // Filter out admin users
        const nonAdminUsers = usersData.filter((user: User) => !user.is_admin);
        setUsers(nonAdminUsers);

        // Find the current program
        const currentProgram = programsData.find(
          (p: Program) => p.id === params.program
        );
        setProgram(currentProgram);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.program]);
  return { isLoading, users, program };
}
