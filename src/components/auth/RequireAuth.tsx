import Login from "./Login";
import { createContext, useContext, useEffect, useState } from "react";
import localForage from "localforage";
import { ReactNode } from "react";
import axios, { AxiosInstance } from "axios";

interface AuthProps {
  children?: ReactNode;
}

type User = {
  code: string;
  apiUri: string;
  accessToken: string;
  roles: string[];
};

export const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  resolveAxios: () => AxiosInstance;
}>({ user: null, setUser: () => null, resolveAxios: () => axios.create() });

const RequireAuth = ({ children }: AuthProps) => {
  const STORE_KEY: string = "user";
  const [user, setUser] = useState<User | null>(null);
  async function fetchUser() {
    let persistedUser = await localForage.getItem<User>(STORE_KEY);
    if (persistedUser) {
      setUser(persistedUser);
    }
  }
  function resolveAxios() {
    return axios.create({
      baseURL: user?.apiUri,
      headers: {
        "Content-type": "application/json",
        Authorization: "Basic " + user?.accessToken
      }
    });
  }
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    localForage.setItem(STORE_KEY, user);
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, setUser, resolveAxios }}>
      {user ? children : <Login />}
    </AuthContext.Provider>
  );
};

export default RequireAuth;

export const useAuth = () => {
  return useContext(AuthContext);
};
