import { createContext, useState, ReactNode } from "react";

type User = { id: string; email: string; isAdmin: boolean } | null;

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// creates global authentification context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(
    // persists login state
    JSON.parse(localStorage.getItem("user") || "null")
  );

  // hardcoded credentials
  const validAdmin = { email: "admin@bookly.com", password: "admin123" };
  const validUser = { email: "user@example.com", password: "user123" };

  // login function
  const login = (email: string, password: string): boolean => {
    if (email === validAdmin.email && password === validAdmin.password) {
      setUser({ id: "99", email, isAdmin: true });
      // store in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ id: "99", email, isAdmin: true })
      );
      return true;
    } else if (email === validUser.email && password === validUser.password) {
      setUser({ id: "1", email, isAdmin: false });
      localStorage.setItem(
        "user",
        JSON.stringify({ id: "1", email, isAdmin: false })
      );
      return true;
    }
    return false; // Invalid credentials
  };

  // logout function
  const logout = () => setUser(null);
  localStorage.removeItem("user");

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for authentification; allows components to access the auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
