import React from "react";
import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { useAuth } from "./context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect unauthenticated users to the sign-in page
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Ensure the route has the correct userId in the path
  const pathParts = location.pathname.split("/");
  const isUserIdInPath = pathParts.includes(user.userId);

  if (!isUserIdInPath && pathParts.includes("dashboard")) {
    // Redirect to the correct path with userId
    const correctPath = `/dashboard/${user.userId}/home`;
    return <Navigate to={correctPath} replace />;
  }

  return children;
};

export default PrivateRoute;
