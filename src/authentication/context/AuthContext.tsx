import React, { createContext, useContext, useEffect, useState } from "react";
// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { UserData } from "../../interface/User";

interface AuthContextType {
  user: UserData | null;
  signIn: (token: string) => void;
  signOut: () => void;
  loading: boolean;
}

interface JwtPayload {
  userId: string;
  username?: string;
  email?: string;
  exp?: number;
  iat?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to get user data from token
  const getUserFromToken = (token: string): UserData | null => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);

      // Check if token is expired
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        return null;
      }

      // Get userId from token or localStorage
      const userId = decodedToken.userId || localStorage.getItem("userId");

      if (!userId) {
        return null;
      }

      // Create user data
      return {
        userId,
        name: decodedToken.username || "",
        email: decodedToken.email || "",
      };
    } catch (e) {
      console.error("Failed to decode token: ", e);
      return null;
    }
  };

  // Load user on initial render or when token changes
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = getUserFromToken(token);
      if (userData) {
        setUser(userData);
      } else {
        // Token is invalid or expired
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const signIn = (token: string) => {
    try {
      const userData = getUserFromToken(token);

      if (userData) {
        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userData.userId);
      } else {
        throw new Error("Invalid token");
      }
    } catch (e) {
      console.error("Failed to sign in: ", e);
    }

    setLoading(false);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
