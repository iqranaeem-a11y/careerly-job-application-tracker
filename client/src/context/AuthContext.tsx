import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { AuthResponse, User } from "../types/auth";
import { getCurrentUser, login as loginRequest, register as registerRequest } from "../services/authService";
import { TOKEN_STORAGE_KEY } from "../services/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const persistSession = ({ user, accessToken }: AuthResponse) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  return user;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (input: { email: string; password: string }) => {
    setUser(persistSession(await loginRequest(input)));
  }, []);

  const register = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      setUser(persistSession(await registerRequest(input)));
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
