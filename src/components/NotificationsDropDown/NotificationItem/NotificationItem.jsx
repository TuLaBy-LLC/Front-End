import React, { useState } from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "./../../../Helpers/Methods";
import { IconClockHour10 } from "@tabler/icons-react";
import defaultImage from "./../../../assets/images/user-1.jpg";

export default function NotificationItem({
  isEnglish,
  isFullView = false,
  handleNotificationPopUp,
  notification,
  sendAt,
  readAt,
  notificationId,
  id,
}) {
  const sender = notification.sender;
  const [isRead, setIsRead] = useState(readAt);

  return (
    <button
      type="button"
      data-bs-toggle="modal"
      onClick={(_) => {
        handleNotificationPopUp(id, notificationId);
        setIsRead(new Date());
      }}
      data-bs-target="#notification-modal"
      className={`list-group-item list-group-item-action d-flex align-items-center rounded-1 ${
        isFullView ? "py-3" : "py-2"
      } ${isRead == null ? "bg-light-subtle" : ""}`}
    >
      <div className="notification-avatar me-2">
        <img src={sender.imageName || defaultImage} alt="User Avatar" />
      </div>
      <div className="ms-2 notification-content" style={{ minWidth: 0 }}>
        <div
          className={`notification-head fw-bolder ${isFullView ? "fs-4" : ""}`}
        >
          {notification.head}
        </div>
        <div
          className={`notification-message ${
            isFullView ? "fs-4" : "text-truncate"
          } mt-2 text-muted`}
          title={notification.message}
        >
          {notification.message}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2 gap-2">
          <div className="text-ellipsis">
            <p
              className={`m-0 text-muted text-ellipsis ${
                isFullView ? "fs-4" : "fs-3"
              } ${!isEnglish ? "d-none" : ""}`}
              data-translate="en-us"
              title={sender.name}
            >
              {sender.name}
            </p>
            <p
              className={`m-0 text-muted text-ellipsis ${
                isFullView ? "fs-4" : "fs-3"
              } ${isEnglish ? "d-none" : ""}`}
              data-translate="ar-eg"
              title={sender.nameAR}
            >
              {sender.nameAR}
            </p>
          </div>
          <div className="d-flex justify-content-between align-items-center gap-1">
            <p
              className={`text-muted text-ellipsis small m-0 ${
                isFullView ? "fs-4" : "fs-3"
              }`}
              title={sendAt}
            >
              {timeAgo(new Date(sendAt), isEnglish)}
            </p>
            <IconClockHour10
              size={isFullView ? 25 : 15}
              className="text-primary"
            />
          </div>
        </div>
      </div>
    </button>
  );
}
