import { memo, useCallback, useState } from "react";
import { timeAgo } from "../../Helpers/Methods";
import {
  IconEdit,
  IconTrash,
  IconListDetails,
  IconInfoCircle,
  IconEye,
  IconChecks,
  IconClock,
  IconMoodSmile,
  IconCheck,
  IconChevronDown,
  IconX
} from "@tabler/icons-react";
import { REACTIONS } from "../MessageReaction/MessageReaction";

function MyMessage({
  message,
  language,
  deleteMessage,
  editMessage,
  messageInfo
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState({ isShow: false, data: {} });

  const [newMessageText, setNewMessageText] = useState(
    message.message.content
  );
  const [recipientFilter, setRecipientFilter] = useState("all");

  const handleSaveEdit = useCallback(async () => {
    if (
      !newMessageText.trim() ||
      newMessageText === message.message.content
    ) {
      setIsEditing(false);
      return;
    }

    try {
      await editMessage(
        message.clubId,
        message.message.id,
        newMessageText.trim()
      );

      setIsEditing(false);
    } catch (error) {
      console.error(
        "Failed to edit message",
        error
      );
    }
  }, [
    message,
    newMessageText,
    editMessage
  ]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMessage(
        message.message.id,
        message.clubId
      );
    } catch (error) {
      console.error(
        "Failed to delete message",
        error
      );
    }
  }, [message, deleteMessage]);

  const handleDetails = useCallback(async () => {

    var result = await messageInfo(message.messageId);

    setShowDetails({ isShow: true, data: result.data });

  }, [messageInfo]);

  const handleCancelEdit = () => {
    setNewMessageText(
      message.message.content
    );

    setIsEditing(false);
  };

  return (
    <>
      <div className="px-3 mb-3 d-flex justify-content-end">

        <div
          style={{
            maxWidth: "70%",
            minWidth: "40%",
            width: "fit-content"
          }}
        >
          {/* Time */}
          <div className="d-flex justify-content-end gap-2 mb-1">

            <small className="text-muted pe-3">
              {timeAgo(
                message.sendAt,
                language
              )}
            </small>

          </div>

          {/* Message Bubble */}
          <div className="my-message rounded-4 shadow-sm p-3 pb-2 bg-primary text-white position-relative">

            {/* Actions */}
            {!isEditing && (
              <div className="message-actions position-absolute top-100 start-0 translate-middle-y d-flex gap-1">

                <button
                  type="button"
                  className="btn btn-sm rounded-circle action-btn"
                  title="Edit message"
                  onClick={() =>
                    setIsEditing(true)
                  }
                >
                  <IconEdit size={16} />
                </button>

                <button
                  type="button"
                  className="btn btn-sm rounded-circle action-btn"
                  title="Delete message"
                  onClick={handleDelete}
                >
                  <IconTrash size={16} />
                </button>

                <button
                  type="button"
                  className="btn btn-sm rounded-circle action-btn"
                  title="Message details"
                  onClick={handleDetails}
                >
                  <IconListDetails size={16} />
                </button>

              </div>
            )}

            {/* Content */}
            <div>
              {isEditing ? (
                <div className="message-edit">

                  <input
                    type="text"
                    className="message-edit-input"
                    autoFocus
                    value={newMessageText}
                    onChange={(e) =>
                      setNewMessageText(e.target.value)
                    }
                  />

                  <button
                    className="action-btn"
                    onClick={handleSaveEdit}
                    disabled={!newMessageText.trim()}
                    title="Save"
                  >
                    <IconCheck size={16} />
                  </button>

                  <button
                    className="action-btn"
                    onClick={handleCancelEdit}
                    title="Cancel"
                  >
                    <IconX size={16} />
                  </button>

                </div>
              ) : (
                message.message.content
              )}
            </div>

            {/* Full date */}
            {!isEditing && (
              <div className="small mt-2 text-end text-white-50">
                {new Date(
                  message.sendAt
                ).toLocaleString()}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Details Modal */}
      {showDetails.isShow && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog  modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">

                {/* Header */}
                <div className="modal-header border-0 px-4 pt-4">

                  <div className="d-flex align-items-center gap-3">

                    <div className="details-header-icon">
                      <IconInfoCircle size={20} />
                    </div>

                    <h5 className="mb-0 fw-bold">
                      Message Details
                    </h5>

                  </div>

                  <button
                    className="btn-close"
                    onClick={() => setShowDetails({ ...showDetails, isShow: false })}
                  />

                </div>

                <div className="modal-body px-4 pb-4">

                  {/* Message Card */}
                  <div className="details-card mb-4">

                    <div className="d-flex justify-content-between align-items-start mb-3">

                      <div>
                        <small className="text-muted text-uppercase fw-semibold">
                          Message
                        </small>

                        <div className="fw-bold fs-6 mt-1">
                          #{showDetails.data.id}
                        </div>
                      </div>

                      <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2">
                        {showDetails.data.createdAt !== showDetails.data.updatedAt
                          ? "Edited"
                          : "Original"}
                      </span>

                    </div>

                    {/* Message content */}
                    <div className="message-preview p-3 rounded-4 mb-3">

                      {showDetails.data.content}

                    </div>

                    {/* Dates */}
                    <div className="d-flex flex-wrap gap-3">

                      <div className="date-info">
                        <div className="small text-muted">
                          Sent
                        </div>

                        <div className="fw-semibold">
                          {new Date(
                            showDetails.data.createdAt
                          ).toLocaleString()}
                        </div>
                      </div>

                      {
                        showDetails.data.createdAt !==
                        showDetails.data.updatedAt && (

                          <div className="date-info">
                            <div className="small text-muted">
                              Last Edited
                            </div>

                            <div className="fw-semibold">
                              {new Date(
                                showDetails.data.updatedAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        )
                      }

                    </div>

                  </div>

                  {/* Compact Summary */}
                  <div className="compact-summary mb-4">

                    <div className="summary-item">

                      <IconEye
                        size={18}
                        className="text-success"
                      />

                      <h5>
                        {
                          showDetails.data.users?.filter(
                            m => m.readAt != null
                          ).length
                        }
                      </h5>

                      <small>Read</small>

                    </div>

                    <div className="summary-item">

                      <IconChecks
                        size={18}
                        className="text-primary"
                      />

                      <h5>
                        {
                          showDetails.data.users?.filter(
                            m => m.deliveredAt != null
                          ).length
                        }
                      </h5>

                      <small>Delivered</small>

                    </div>

                    <div className="summary-item">

                      <IconClock
                        size={18}
                        className="text-warning"
                      />

                      <h5>
                        {
                          showDetails.data.users?.filter(
                            m => m.deliveredAt == null
                          ).length
                        }
                      </h5>

                      <small>Pending</small>

                    </div>

                    <div className="summary-item">

                      <IconMoodSmile
                        size={18}
                        className="text-danger"
                      />

                      <h5>
                        {showDetails.data.reacts}
                      </h5>

                      <small>Reacts</small>

                    </div>

                  </div>

                  {/* Recipients */}
                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h6 className="fw-bold mb-0">
                      {/* Recipients ({.length}) */}
                    </h6>

                    <select
                      className="form-select form-select-sm w-auto"
                      value={recipientFilter}
                      onChange={(e) =>
                        setRecipientFilter(e.target.value)
                      }
                    >
                      <option value="all">All</option>
                      <option value="read">Read</option>
                      <option value="delivered">Delivered</option>
                      <option value="pending">Pending</option>
                      <option value="react">react</option>
                    </select>

                  </div>

                  <div className="recipients-container">

                    {showDetails.data.users
                      .filter(user => {

                        if (recipientFilter === "read")
                          return user.readAt;

                        if (recipientFilter === "delivered")
                          return user.deliveredAt && !user.readAt;

                        if (recipientFilter === "pending")
                          return !user.deliveredAt;

                        if (recipientFilter === "react")
                          return user.react != 0;

                        return true; // all users

                      })
                      .map(user => (

                        <div
                          className="recipient-row"
                          key={user.id}
                        >

                          <div className="d-flex align-items-center gap-3">

                            <div className="recipient-avatar">
                              {user.userId
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>

                            <div>

                              <div
                                className="fw-semibold text-truncate"
                                style={{ maxWidth: 220 }}
                              >
                                {user.userId}
                              </div>

                              <small className="text-muted">

                                {
                                  user.readAt
                                    ? `Read ${new Date(
                                      user.readAt
                                    ).toLocaleTimeString()}`
                                    : user.deliveredAt
                                      ? `Delivered ${new Date(
                                        user.deliveredAt
                                      ).toLocaleTimeString()}`
                                      : "Pending"
                                }

                              </small>

                            </div>

                          </div>

                          <div className="d-flex align-items-center gap-2">

                            {user.readAt ? (

                              <span className="badge bg-success-subtle text-success rounded-pill">
                                Read
                              </span>

                            ) : user.deliveredAt ? (

                              <span className="badge bg-primary-subtle text-primary rounded-pill">
                                Delivered
                              </span>

                            ) : (

                              <span className="badge bg-warning-subtle text-warning rounded-pill">
                                Pending
                              </span>

                            )}

                            {user.react > 0 && (() => {

                              const ReactionIcon =
                                REACTIONS[user.react - 1]?.icon;

                              return ReactionIcon
                                ? <ReactionIcon size={18} />
                                : null;

                            })()}

                          </div>

                        </div>

                      ))}

                  </div>

                </div>

              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}

export default memo(MyMessage);