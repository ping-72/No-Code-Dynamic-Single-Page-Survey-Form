import React from "react";
import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { useAuth } from "./context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated users to the sign-in page
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoute;
