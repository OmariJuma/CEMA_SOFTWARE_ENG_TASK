"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "../utils/userContext";
import { toast } from "react-toastify";
export function useAuthCheck(shouldRedirect: boolean = true) {
  const router = useRouter();
  const { userData, setUserData } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        if (!token || !userId) {
          if (shouldRedirect) {
            toast.info("Please login to continue");
            return router.push("/login");
          }
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/users/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch user data");
        }
        const data = await response.json();

        if (isMounted) {
          setIsLoading(false);
          setUserData(data);
        }
      } catch (error) {
        if (isMounted) {
          if (shouldRedirect) {
            toast.error(
              error instanceof Error ? error.message : "An error occurred"
            );
            router.push("/login");
          }
          setIsLoading(false);
        }
      }
    };
    fetchUserData();
    return () => {
        isMounted = false;
        };
    
  }, []);
  return { userData, isLoading };
}
