import React from "react";
import { useState } from "react";
import { createContext } from "react";

export const SideBarContext = createContext();

export default function SideBarProvider({ children }) {
  // sideBarSettings Sidebar
  const [sideBarOptions, setSideBarOptions] = useState({
    collapse: false,
    toggle: false,
    enable: false,
  });
  // console.log(sideBarOptions);

  return (
    <SideBarContext.Provider value={{ sideBarOptions, setSideBarOptions }}>
      {children}
    </SideBarContext.Provider>
  );
}
