import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const getUserFromToken = () => {
    const token = localStorage.getItem("token"); // xyz.123.zzz

    if (!token) return null;

    return JSON.parse(atob(token.split(".")[1])).payload;
  };

  useEffect(() => {
    const userData = getUserFromToken();
    setUser(userData);
  }, []);

  const valueObject = { user, setUser };

  return (
    <UserContext.Provider value={valueObject}>
      { children }
    </UserContext.Provider>
  );
}
