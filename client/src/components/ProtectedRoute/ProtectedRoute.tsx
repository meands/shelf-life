import { useVerifyToken } from "@api/authentication";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isError } = useVerifyToken();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Navigate to="/login" />;
  }

  return children;
}
