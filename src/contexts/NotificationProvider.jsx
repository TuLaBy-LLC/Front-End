import React from "react";
import { useState } from "react";
import { createContext } from "react";

export const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [activeModalData, setActiveModalData] = useState({
    recordId: null,
    notificationId: null,
  });

  const handleSetActiveModalData = (recordId, notificationId) => {
    setActiveModalData({ recordId, notificationId });
  };

  return (
    <NotificationContext.Provider
      value={{ activeModalData, handleSetActiveModalData }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
