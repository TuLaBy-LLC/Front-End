// contexts/NotificationProvider.jsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

// import signalRService from "../services/signalRService";
import UserContext from "./UserContextProvider";
import signalRService from "../Services/SignalR_Services";

export const NotificationContext =
  createContext(null);

const notificationHub =
  import.meta.env.VITE_Notification_Hub_URL_API_KEY;

export default function NotificationProvider({
  children
}) {

  const { User } = useContext(UserContext);

  const userId = User?.id;
  const token = User?.token;

  const [isConnected, setIsConnected] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [newNotification, setNewNotification] =
    useState(false);

  const [activeModalData, setActiveModalData] =
    useState({
      recordId: null,
      notificationId: null
    });

  /**
   * Start/stop SignalR connection
   */
  useEffect(() => {
    let mounted = true;

    const connect = async () => {

      if (!userId || !token) {

        setIsConnected(false);

        await signalRService.stop(
          "notification"
        );

        return;
      }

      try {
        await signalRService.start(
          "notification",
          notificationHub,
          userId,
          token
        );
        // console.log("Notification connected");

        if (mounted) {
          setIsConnected(true);
        }

      } catch (error) {

        console.error(
          "Failed to connect to notification hub:",
          error
        );

        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    connect();

    return () => {

      mounted = false;

      if (isConnected)
        signalRService
          .stop("notification")
          .catch(console.error);
    };

  }, [userId, token]);

  /**
   * Subscribe to realtime notifications
   */
  useEffect(() => {

    if (!isConnected)
      return;

    const unsubscribe =
      signalRService.receive(
        "notification",
        "ReceiveNotification",
        notification => {

          setNewNotification(true);

          setNotifications(prev => [
            ...notification,
            ...prev
          ]);
        }
      );

    return unsubscribe;

  }, [isConnected]);

  /**
   * Notification modal helpers
   */
  const handleSetActiveModalData =
    useCallback(
      (recordId, notificationId) => {
        setActiveModalData({
          recordId,
          notificationId
        });
      },
      []
    );

  const clearActiveModalData =
    useCallback(() => {

      setActiveModalData({
        recordId: null,
        notificationId: null
      });

    }, []);

  /**
   * Notification badge helpers
   */
  const resetNotificationBadge =
    useCallback(() => {
      setNewNotification(false);
    }, []);

  const value = useMemo(() => ({

    // connection state
    isConnected,

    // notifications state
    notifications,
    setNotifications,

    // badge state
    newNotification,
    setNewNotification,
    resetNotificationBadge,

    // modal state
    activeModalData,
    handleSetActiveModalData,
    clearActiveModalData

  }), [
    isConnected,
    notifications,
    newNotification,
    activeModalData,
    handleSetActiveModalData,
    clearActiveModalData,
    resetNotificationBadge
  ]);

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {

  const context = useContext(
    NotificationContext
  );

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }

  return context;
}