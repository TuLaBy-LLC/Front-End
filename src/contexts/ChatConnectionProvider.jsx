import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import UserContext from "./UserContextProvider";
import signalRService from "../Services/SignalR_Services";

const ChatConnectionContext =
  createContext(null);

const chatHub =
  import.meta.env.VITE_Chats_Hub_URL_API_KEY;

export function ChatConnectionProvider({
  children
}) {

  const { User } =
    useContext(UserContext);

  const userId = User?.id;
  const token = User?.token;

  const [isConnected, setIsConnected] =
    useState(false);

  useEffect(() => {

    const connect = async () => {

      if (!userId || !token) {

        setIsConnected(false);

        if (isConnected) await signalRService.stop("chat");

        return;
      }

      try {

        await signalRService.start(
          "chat",
          chatHub,
          userId,
          token
        );

        setIsConnected(true);

      } catch (error) {

        console.error(
          "Failed to connect chat hub",
          error
        );

        setIsConnected(false);
      }
    };

    connect();

    
  }, [userId, token]);

  const value = useMemo(() => ({

    isConnected,

    subscribe: (
      eventName,
      callback
    ) =>{

      signalRService.receive(
        "chat",
        eventName,
        callback
      )
    }
    ,

    invoke: (
      methodName,
      ...args
    ) =>
      signalRService.invoke(
        "chat",
        methodName,
        ...args
      ),

    send: (
      methodName,
      ...args
    ) =>
      signalRService.send(
        "chat",
        methodName,
        ...args
      )

  }), [isConnected]);

  return (
    <ChatConnectionContext.Provider
      value={value}
    >
      {children}
    </ChatConnectionContext.Provider>
  );
}

export function useChatConnection() {

  const context = useContext(
    ChatConnectionContext
  );

  if (!context) {
    throw new Error(
      "useChatConnection must be used within ChatConnectionProvider"
    );
  }

  return context;
}