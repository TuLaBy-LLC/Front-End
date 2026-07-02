import { memo, useCallback, useEffect, useRef, useState } from "react";

import defaultImage from "../../assets/images/default-club.png";

import LoadingComponent from "../loading/Loading";
import Message from "../Message/Message";
import ChatUsersModal from "../ChatUsersModel/ChatUsersModel";

import { useChat } from "../../contexts/ChatProvider";
import { IconRefresh, IconUsers } from "@tabler/icons-react";

function Chat({
  club,
  t,
  language,
  user,
}) {

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState({ data: [], isShow: false });
  const messagesEndRef = useRef(null);

  const {
    messages,
    loadMessages,
    loadClubUsers,
    sendMessage,
    deleteMessage,
    editMessage,
    messageInfo,
    isLoading,
    reactToMessage,
    isError
  } = useChat();

  /**
   * Load club messages
   */
  useEffect(() => {

    if (!club?.id) return;

    loadMessages(club.id);

  }, [club?.id, loadMessages]);

  /**
   * Auto-scroll to latest message
   */
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

  /**
   * Send message
   */
  const handleSend = async () => {

    if (
      !club?.id ||
      !text.trim() ||
      sending
    ) return;

    try {

      setSending(true);

      const res = await sendMessage(
        club.id,
        text.trim()
      );

      if (res)
        setText("");

    } catch (error) {

      console.error(
        "Failed to send message",
        error
      );

    } finally {

      setSending(false);
    }
  };

  /**
   * Send on Enter
   */
  const handleKeyDown = e => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();
      handleSend();
    }
  };


  const handleGetAllUsers = useCallback(async _ => {
    const result = await loadClubUsers(club?.id);

    setShowUsersModal({ data: result, isShow: true })
  }, [club?.id])
  return (
    <div
      id="chatSide"
      className="col-md-8 bg-white position-relative w-100 h-100"
    >

      <div className="chat-main d-flex flex-column justify-content-between h-100">

        <div>

          {/* Header */}
          <header className="d-flex align-items-center justify-content-between bg-light-subtle p-3 gap-2">

            <div className="d-flex align-items-center gap-2 overflow-hidden">

              {club && (
                <>
                  <img
                    src={defaultImage}
                    width="50"
                    height="50"
                    className="rounded-circle border"
                    alt={club.name}
                  />

                  <div>
                    <h6 className="mb-0 fw-bolder">
                      {club.name}
                    </h6>
                  </div>
                </>
              )}

            </div>

            {club && (
              <div className="d-flex gap-3">

                <button
                  className="btn bg-white border rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    minWidth: "45px",
                    minHeight: "45px"
                  }}
                  onClick={() => loadMessages(club.id)}
                  disabled={isLoading}
                  title="Refresh messages"
                >
                  <IconRefresh
                    size={22}
                    className="text-primary"
                  />
                </button>

                <button
                  className="btn bg-white border rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    minWidth: "45px",
                    minHeight: "45px"
                  }}
                  onClick={handleGetAllUsers}
                  disabled={isLoading}
                  title="Club members"
                >
                  <IconUsers
                    size={22}
                    className="text-success"
                  />
                </button>

              </div>
            )}
          </header>

          {/* Messages */}
          <div
            id="chat-body"
            className="overflow-auto d-flex flex-column gap-3 py-3"
            style={{
              minHeight: "55vh",
              maxHeight: "70vh"
            }}
          >

            {isLoading && (
              <LoadingComponent />
            )}

            {isError && (
              <div className="alert alert-warning mx-3">
                {t("errors.apiError")}
              </div>
            )}

            {!isLoading &&
              messages.map(msg => (
                <Message
                  key={msg.message.id}
                  message={msg}
                  language={language}
                  userId={user.id}
                  reactToMessage={reactToMessage}
                  deleteMessage={deleteMessage}
                  editMessage={editMessage}
                  messageInfo={messageInfo}
                />
              ))}

            <div ref={messagesEndRef} />

          </div>

        </div>

        {/* Footer */}
        <div className="chat-footer">

          <div className="input-group">

            <input
              type="text"
              className="form-control rounded-0"
              placeholder={t(
                "chats.typeMessage"
              )}
              value={text}
              onChange={e =>
                setText(e.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={!club || sending}
            />

            <button
              type="button"
              className="btn btn-primary"
              disabled={
                !club ||
                !text.trim() ||
                sending
              }
              onClick={handleSend}
            >

              {sending ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                t("chats.send")
              )}

            </button>

          </div>

        </div>

      </div>

      <ChatUsersModal
        club={club}
        show={showUsersModal.isShow}
        onClose={() => setShowUsersModal({data:showUsersModal.data, isShow:false})}
        users={showUsersModal.data}
      />
    </div>
  );
}

export default memo(Chat);