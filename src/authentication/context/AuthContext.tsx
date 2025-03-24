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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, _setLoading] = useState(true);

  useEffect(() => {
    // const token = localStorage.getItem("jwtToken");
    const dummyUserData: UserData = {
      userId: "1234567890",
      name: "John Doe",
      email: "john.doe@example.com",
    };
    const token =
      localStorage.getItem("jwtToken") || JSON.stringify(dummyUserData);
    if (token) {
      try {
        const decodedToken: UserData = jwtDecode(token);
        
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("jwtToken");
          setUser(null);
        } else {
          setUser(decodedToken);
        }
      } catch (e) {
        console.log("Failed to decode token: ", e);
      }
    }
  }, []);

  const signIn = (token: string) => {
    const userData: UserData = jwtDecode(token);
    setUser(userData);
    console.log("UserData: ", userData);
    localStorage.setItem("jwtToken", JSON.stringify(userData));
    _setLoading(false);
  };

  const signOut = () => {
    localStorage.removeItem("jwtToken");
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
