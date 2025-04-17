import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const valueObject = { user, setUser };

  return (
    <UserContext.Provider value={valueObject}>{children}</UserContext.Provider>
  );
}
