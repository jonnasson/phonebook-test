import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { LOGIN, SIGNUP, GUEST_LOGIN } from "../graphql/queries";
import { client } from "../apollo";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const navigate = useNavigate();
  const [loginMutation] = useMutation<{ login: { token: string } }>(LOGIN);
  const [signupMutation] = useMutation<{ signup: { token: string } }>(SIGNUP);
  const [guestLoginMutation] = useMutation<{ guestLogin: { token: string } }>(GUEST_LOGIN);

  const handleToken = useCallback(
    (newToken: string) => {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      void navigate("/");
    },
    [navigate],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const { data } = await loginMutation({
        variables: { username, password },
      });
      handleToken(data!.login.token);
    },
    [loginMutation, handleToken],
  );

  const signup = useCallback(
    async (username: string, password: string) => {
      const { data } = await signupMutation({
        variables: { username, password },
      });
      handleToken(data!.signup.token);
    },
    [signupMutation, handleToken],
  );

  const loginAsGuest = useCallback(async () => {
    const { data } = await guestLoginMutation();
    handleToken(data!.guestLogin.token);
  }, [guestLoginMutation, handleToken]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("tutorial_dismissed_session");
    setToken(null);
    void client.clearStore();
    void navigate("/login");
  }, [navigate]);

  const value = useMemo(
    () => ({ isAuthenticated: !!token, login, signup, loginAsGuest, logout }),
    [token, login, signup, loginAsGuest, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}
