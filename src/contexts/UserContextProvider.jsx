import React, { createContext, useMemo, useState } from "react";
import { useContext } from "react";
import { SideBarContext } from "./SideBarProvider";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [User, setUser] = useState(() => {
    try {
      const user = sessionStorage.getItem("user");
      return JSON.parse(user) ?? {};
    } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
    }
  });

  const { setSideBarOptions } = useContext(SideBarContext);

  const updateUser = (user, reset = false) => {
    setUser((prevUser) => {
      const tempUser = reset ? {} : { ...prevUser, ...user };
      sessionStorage.setItem("user", JSON.stringify(tempUser));
      return tempUser;
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    updateUser({}, true);
    setSideBarOptions((prev) => ({ ...prev, enable: false }));
  };

  const contextValue = useMemo(
    () => ({ User, updateUser, handleLogout }),
    [User]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export default UserContext;
