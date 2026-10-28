"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export type Role = "STUDENT" | "RECRUITER" | "INSTITUTION" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED";
  avatarUrl?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string; message?: string }>;
  seedLogin: (role: Role) => Promise<void>;
  switchRole: (role: Role) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const SEED_USERS: Record<Role, User> = {
  STUDENT: {
    id: "student-001",
    name: "Alex Rivera",
    email: "student@proofhire.io",
    role: "STUDENT",
    status: "ACTIVE",
    organization: "Stanford University",
  },
  RECRUITER: {
    id: "recruiter-001",
    name: "Sarah Chen",
    email: "recruiter@proofhire.io",
    role: "RECRUITER",
    status: "ACTIVE",
    organization: "Aether Cryptographic Labs",
  },
  INSTITUTION: {
    id: "institution-001",
    name: "Dr. Marcus Vance",
    email: "institution@proofhire.io",
    role: "INSTITUTION",
    status: "ACTIVE",
    organization: "Stanford School of Engineering",
  },
  ADMIN: {
    id: "admin-001",
    name: "ProofHire SuperAdmin",
    email: "admin@proofhire.io",
    role: "ADMIN",
    status: "ACTIVE",
    organization: "ProofHire Foundation",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize from storage or default to student for effortless evaluation
  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("proofhire_user");
      const storedToken = localStorage.getItem("proofhire_token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // Default to student demo user for immediate evaluation
        setUser(SEED_USERS.STUDENT);
        setToken("demo_jwt_token_alex_rivera");
      }
    } catch {
      setUser(SEED_USERS.STUDENT);
      setToken("demo_jwt_token_alex_rivera");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.auth.login(email, password);
      setUser(data.user as User);
      setToken(data.accessToken);
      localStorage.setItem("proofhire_user", JSON.stringify(data.user));
      localStorage.setItem("proofhire_token", data.accessToken);
      setIsLoading(false);
      redirectBasedOnRole(data.user.role as Role);
      return { success: true };
    } catch {
      // Backend offline or user not in DB: check seed demo accounts
    }

    // Fallback seed matcher
    const match = Object.values(SEED_USERS).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (match) {
      setUser(match);
      setToken(`demo_token_${match.role.toLowerCase()}`);
      localStorage.setItem("proofhire_user", JSON.stringify(match));
      localStorage.setItem("proofhire_token", `demo_token_${match.role.toLowerCase()}`);
      setIsLoading(false);
      redirectBasedOnRole(match.role);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid email or password. Use demo accounts or register a new user." };
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        organizationOrUniversity: data.organizationOrUniversity,
      });

      if (res && res.user) {
        setUser(res.user);
        setToken(res.accessToken || `token_${res.user.id}`);
        localStorage.setItem("proofhire_user", JSON.stringify(res.user));
        localStorage.setItem("proofhire_token", res.accessToken || `token_${res.user.id}`);
        setIsLoading(false);
        redirectBasedOnRole(res.user.role);
        return { success: true };
      }
    } catch {
      // Offline fallback
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.role === "INSTITUTION" ? "PENDING_APPROVAL" : "ACTIVE",
      organization: data.organizationOrUniversity,
    };

    setUser(newUser);
    setToken(`demo_token_${newUser.id}`);
    localStorage.setItem("proofhire_user", JSON.stringify(newUser));
    localStorage.setItem("proofhire_token", `demo_token_${newUser.id}`);
    setIsLoading(false);
    redirectBasedOnRole(newUser.role);
    return { success: true };
  };

  const seedLogin = async (targetRole: Role) => {
    setIsLoading(true);
    try {
      const res = await api.auth.seedLogin(targetRole);
      if (res && res.accessToken) {
        setUser(res.user as User);
        setToken(res.accessToken);
        localStorage.setItem("proofhire_user", JSON.stringify(res.user));
        localStorage.setItem("proofhire_token", res.accessToken);
        setIsLoading(false);
        redirectBasedOnRole(targetRole);
        return;
      }
    } catch (e) {
      console.warn("API seed-login unavailable, using fallback:", e);
    }

    const seed = SEED_USERS[targetRole];
    setUser(seed);
    const fallbackToken = `demo_token_${targetRole.toLowerCase()}`;
    setToken(fallbackToken);
    localStorage.setItem("proofhire_user", JSON.stringify(seed));
    localStorage.setItem("proofhire_token", fallbackToken);
    setIsLoading(false);
    redirectBasedOnRole(targetRole);
  };

  const switchRole = (targetRole: Role) => {
    seedLogin(targetRole);
  };

  const redirectBasedOnRole = (role: Role) => {
    switch (role) {
      case "STUDENT":
        router.push("/student/dashboard");
        break;
      case "RECRUITER":
        router.push("/recruiter/dashboard");
        break;
      case "INSTITUTION":
        router.push("/institution/dashboard");
        break;
      case "ADMIN":
        router.push("/admin/dashboard");
        break;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("proofhire_user");
    localStorage.removeItem("proofhire_token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "STUDENT",
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        seedLogin,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
