import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UserContext from "../../contexts/UserContextProvider";
import axios from "axios";
import Apis from "../../Api.json";
import LoadingComponent from "../loading/Loading"; // Assuming this component is available
import { convertDateTime, timeAgo } from "../../Helpers/Methods"; // Assuming this helper is defined
import { IconClockHour10 } from "@tabler/icons-react";

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.notifications.notification
}`;

const getNotification = async (recordId, notificationId, token) => {
  try {
    const { data } = await axios.get(
      `${ApiUrl}?recordId=${recordId}&notificationId=${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default function NotificationDetailsModal({ recordId, notificationId }) {
  const { t, i18n } = useTranslation();
  const { User } = useContext(UserContext);
  const [notification, setNotification] = useState({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (recordId && notificationId) {
      setNotification({ data: null, isLoading: true, error: null });
      getNotification(recordId, notificationId, User.token)
        .then((data) => {
          setNotification({ data, isLoading: false, error: null });
        })
        .catch((error) => {
          setNotification({ data: null, isLoading: false, error });
        });
    }
  }, [recordId, notificationId, User.token]);

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      id="notification-modal"
      role="dialog"
      aria-labelledby="notificationModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="notificationModalLabel">
              {t("notifications.notificationDetails")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="modal-close-filterModal"
            />
          </div>

          <div className="modal-body">
            {/* Loading state */}
            {notification.isLoading && <LoadingComponent />}

            {/* Error state */}
            {notification.error && (
              <div className="alert alert-danger">
                {t("An error occurred while loading the notification.")}
              </div>
            )}

            {/* Notification content */}
            {notification.data && (
              <div className="">
                <div className="d-flex align-items-center">
                  <div className="notification-avatar me-2">
                    <img
                      src={
                        notification.data.notification.sender.imageName ||
                        "/path/to/default-image.jpg" // Replace with your default image path
                      }
                      alt="User Avatar"
                      className="img-fluid"
                    />
                  </div>
                  <div
                    className="ms-2 notification-content"
                    style={{ minWidth: 0 }}
                  >
                    <div className="notification-head fw-bolder fs-4">
                      {notification.data.notification.head || t("No Title")}
                    </div>
                    <div
                      className="notification-message fs-4 mt-2 text-muted"
                      title={notification.data.notification.message}
                    >
                      {notification.data.notification.message ||
                        t("No Message")}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2 gap-2">
                      <div className="text-ellipsis">
                        <p
                          className="m-0 text-muted text-ellipsis fs-4"
                          title={notification.data.notification.sender.name}
                        >
                          {i18n.language === "en"
                            ? notification.data.notification.sender.name
                            : notification.data.notification.sender.nameAR}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-1">
                        <p
                          className="text-muted text-ellipsis small m-0 fs-4"
                          title={notification.data.sendAt}
                        >
                          {timeAgo(
                            new Date(notification.data.sendAt),
                            i18n.language === "en"
                          )}
                        </p>
                        {/* Replace this icon with your actual Icon component */}
                        <IconClockHour10 size={18} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column gap-1 mt-3">
                  <div className="d-flex align-items-center gap-2">
                    <p className="m-0 fw-bolder">
                      {t("notifications.sendAt")}:{" "}
                    </p>

                    <div className="d-flex align-items-center gap-2">
                      <p className="m-0">
                        {convertDateTime(notification.data.sendAt)}
                      </p>
                      <IconClockHour10 className="text-primary" size={20} />
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <p className="m-0 fw-bolder">
                      {t("notifications.readAt")}:{" "}
                    </p>

                    <div className="d-flex align-items-center gap-2">
                      <p className="m-0">
                        {convertDateTime(notification.data.readAt)}
                      </p>
                      <IconClockHour10 className="text-primary" size={20} />{" "}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="modal-close-filterModal"
            >
              {t("misc.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
