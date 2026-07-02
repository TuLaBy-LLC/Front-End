import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import UserContext from "./UserContextProvider";
import { useChatConnection } from "./ChatConnectionProvider";

import Apis from "../Api.json";
import { invokeAsync } from "../Services/api";

const ChatContext = createContext(null);

const CHAT_API_BASE =
  import.meta.env.VITE_Chats_Hub_BASE_URL_API_KEY;
const BASE_API_URL =
  import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY;

const ApiUrls = {
  messages: `${CHAT_API_BASE}${Apis.chats.getClubMessages}`,

  sendMessage: `${CHAT_API_BASE}${Apis.chats.sendMessage}`,

  editMessage: `${CHAT_API_BASE}${Apis.chats.editMessage}`,

  deleteMessage: `${CHAT_API_BASE}${Apis.chats.deleteMessage}`,

  reactToMessage: `${CHAT_API_BASE}${Apis.chats.ReactToMessage}`,

  getAllClubUsers: `${BASE_API_URL}${Apis.chats.getAllClubUsers}`,

  messageInfo: `${CHAT_API_BASE}${Apis.chats.messageInfo}`
};


export function ChatProvider({ children }) {

  const { User } = useContext(UserContext);

  const {
    subscribe,
    isConnected
  } = useChatConnection();

  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  /**
   * Load club messages
   */
  const loadMessages = useCallback(
    async clubId => {

      if (!clubId || !User?.token)
        return;

      try {

        setIsLoading(true);
        setIsError(false);

        setMessages([]);

        const response = await invokeAsync(
          "get",
          `${ApiUrls.messages}?clubId=${clubId}`,
          User.token
        );
        // console.log(response);

        setMessages(
          response.data.items.reverse() || []
        );

      } catch (error) {

        console.error(
          "Failed to load messages",
          error
        );

        setIsError(true);

      } finally {

        setIsLoading(false);
      }
    },
    [User?.token]
  );

  /**
   * Load Users Joined Club
   */
  const loadClubUsers = useCallback(
    async clubId => {

      if (!clubId || !User?.token)
        return;

      try {

        setIsLoading(true);
        setIsError(false);

        const response = await invokeAsync(
          "get",
          `${ApiUrls.getAllClubUsers}?search.clubId=${clubId}&navigations.EnableUser=${true}`,
          User.token
        );
        // console.log(response);

        return response;

      } catch (error) {

        console.error(
          "Failed to load messages",
          error
        );

        setIsError(true);

      } finally {

        setIsLoading(false);
      }
    },
    [User?.token]
  );

  /**
   * Send message
   */
  const sendMessage = useCallback(
    async (clubId, text) => {

      if (!clubId || !text?.trim())
        return;

      try {

        const result = await invokeAsync(
          "post",
          ApiUrls.sendMessage,
          User.token,
          {
            clubId,
            message: text
          }
        );
        // console.log(result);

        return result;

      } catch (error) {

        console.error(
          "Failed to react to message:",
          error
        );

        // Re-throw so the caller can decide what to do
        throw error;
      }

    },
    [User.token]
  );

  /**
   * Message info
   */
  const messageInfo = useCallback(
    async (messageId) => {

      // console.log({ messageId });

      if (!messageId)
        return;

      try {

        const result = await invokeAsync(
          "get",
          `${ApiUrls.messageInfo}?messageId=${messageId}`,
          User.token
        );

        console.log(result);

        return result;

      } catch (error) {

        console.error(
          "Failed to react to message:",
          error
        );

        // Re-throw so the caller can decide what to do
        throw error;
      }

    },
    [User.token]
  );

  /**
   * Edit message
   */
  const editMessage = useCallback(
    async (
      clubId,
      messageId,
      MessageText
    ) => {

      if (
        !clubId ||
        !MessageText?.trim()
      )
        return;

      try {

        const result = await invokeAsync(
          "post",
          ApiUrls.editMessage,
          User.token,
          {
            messageId,
            clubId,
            MessageText
          }
        );
        // console.log(result);

        return result;

      } catch (error) {

        console.error(
          "Failed to react to message:",
          error
        );

        // Re-throw so the caller can decide what to do
        throw error;
      }

    },
    [User.token]
  );

  /**
   * delete message
   */
  const deleteMessage = useCallback(
    async (messageId, clubId) => {

      if (!clubId || !messageId)
        return;

      try {
        const result = await invokeAsync(
          "delete",
          `${ApiUrls.deleteMessage}?messageId=${messageId}&clubId=${clubId}`,
          User.token);
        // console.log(result);

        return result;
      } catch (error) {
        console.error("Failed to react to message:", error);

        // Re-throw so the caller can decide what to do
        throw error;
      }

    },
    [invokeAsync]
  );

  /**
   * React to a message.
   *
   * @param {number} clubId - Club identifier.
   * @param {number} messageId - Message identifier.
   * @param {number} reactionId - Reaction identifier.
   *
   * @returns {Promise<any>} API response.
   */
  const reactToMessage = useCallback(
    async (recordId, clubId, messageId, reactionId) => {
      if (!messageId || !reactionId) {
        return;
      }

      try {
        const result = await invokeAsync(
          "put",
          ApiUrls.reactToMessage,
          User.token,
          {
            id: recordId,
            clubId,
            messageId,
            userId: User.id,
            react: reactionId,
          }
        );

        return result;
      } catch (error) {
        console.error("Failed to react to message:", error);

        // Re-throw so the caller can decide what to do
        throw error;
      }
    },
    [User, ApiUrls.reactToMessage]
  );

  useEffect(() => {

    if (!isConnected)
      return;

    const unsubscribe = subscribe(
      "ReceiveTrigger",
      ([trigger]) => {

        switch (
        trigger.type.toLowerCase()
        ) {

          case "messagereceived":

            const incomingMessage =
              trigger.data;

            const clubId =
              incomingMessage.clubId ??
              incomingMessage.message?.clubId;

            if (
              clubId === activeConversation?.id
            ) {

              setMessages(prev => {

                const exists = prev.some(
                  m => m.message.id === incomingMessage.message.id
                );

                if (exists)
                  return prev;

                return [
                  ...prev,
                  incomingMessage
                ];
              });

            } else {

              setUnreadCount(
                prev => prev + 1
              );
            }

            break;

          case "messagereaction": {

            const reaction = trigger.data;

            setMessages(prev =>
              prev.map(msg => {

                // Ignore all other messages
                if (msg.message.id !== reaction.id)
                  return msg;

                // Update only the affected message
                return {
                  ...msg,
                  react: reaction.react,
                  message: {
                    ...msg.message,
                    reacts: reaction.reacts
                  }
                };
              })
            );

            break;
          }

          case "editmessage": {

            const edited = trigger.data;

            setMessages(prev =>
              prev.map(msg => {

                if (msg.message.id !== edited.message.id)
                  return msg;

                return {
                  ...msg,
                  clubId: edited.clubId,
                  message: {
                    ...msg.message,
                    content: edited.message.content,
                    reacts: edited.message.reacts,
                    mediaUrl: edited.message.mediaUrl,
                    updatedAt: edited.message.updatedAt,
                    createdAt: edited.message.createdAt,
                    senderId: edited.message.senderId
                  }
                };
              })
            );

            break;
          }

          case "deletemessage": {

            const deleted = trigger.data;

            setMessages(prev =>
              prev.filter(
                msg => msg.message.id !== deleted.id
              )
            );

            break;
          }

          case "messagedelivered":
            // mark delivered
            break;

          default:
            break;
        }
      }
    );

    return unsubscribe;

  }, [
    isConnected,
    subscribe,
    activeConversation
  ]);

  const resetUnreadCount =
    useCallback(() => {

      setUnreadCount(0);

    }, []);

  const value = useMemo(() => ({

    messages,
    setMessages,
    deleteMessage,
    loadMessages,
    loadClubUsers,
    sendMessage,
    messageInfo,
    reactToMessage,
    isLoading,
    isError,
    editMessage,
    activeConversation,
    setActiveConversation,

    unreadCount,
    resetUnreadCount

  }), [
    messages,
    loadMessages,
    loadClubUsers,
    sendMessage,
    messageInfo,
    deleteMessage,
    editMessage,
    reactToMessage,
    isLoading,
    isError,
    activeConversation,
    unreadCount,
    resetUnreadCount
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {

  const context = useContext(ChatContext);

  if (!context) {

    throw new Error(
      "useChat must be used within ChatProvider"
    );
  }

  return context;
}