import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import UserContext from "../../contexts/UserContextProvider";

import LoadingComponent from "../loading/Loading";

import Apis from "../../Api.json";

import {
  convertDateTime,
  timeAgo
} from "../../Helpers/Methods";

import { invokeAsync } from "../../Services/api";

import {
  IconClockHour10
} from "@tabler/icons-react";

const API_URL =
  `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}` +
  `${Apis.notifications.notification}`;

export default function NotificationDetailsModal({
  recordId,
  notificationId
}) {

  const { t, i18n } = useTranslation();
  const { User } = useContext(UserContext);

  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load notification details
   */
  const loadNotification = useCallback(async () => {

    if (
      !recordId ||
      !notificationId ||
      !User?.token
    ) return;

    try {

      setIsLoading(true);
      setError(null);

      const data = await invokeAsync(
        "get",
        `${API_URL}?recordId=${recordId}&notificationId=${notificationId}`,
        User.token
      );

      setNotification(data);

    } catch (error) {

      console.error(
        "Failed to load notification",
        error
      );

      setError(error);

    } finally {

      setIsLoading(false);
    }

  }, [
    recordId,
    notificationId,
    User?.token
  ]);

  useEffect(() => {
    loadNotification();
  }, [loadNotification]);

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

          {/* Header */}
          <div className="modal-header">

            <h5
              className="modal-title"
              id="notificationModalLabel"
            >
              {t(
                "notifications.notificationDetails"
              )}
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />

          </div>

          {/* Body */}
          <div className="modal-body">

            {isLoading && (
              <LoadingComponent />
            )}

            {error && (
              <div className="alert alert-danger">
                {
                  t(
                    "An error occurred while loading the notification."
                  )
                }
              </div>
            )}

            {notification && (

              <div>

                <div className="d-flex align-items-center">

                  {/* Avatar */}
                  <div className="notification-avatar me-2">

                    <img
                      src={
                        notification.notification
                          .sender?.imageName ||
                        "/path/to/default-image.jpg"
                      }
                      alt="User Avatar"
                      className="img-fluid"
                    />

                  </div>

                  {/* Content */}
                  <div
                    className="ms-2 notification-content"
                    style={{
                      minWidth: 0
                    }}
                  >

                    <div className="notification-head fw-bolder fs-4">

                      {
                        notification.notification.head ||
                        t("No Title")
                      }

                    </div>

                    <div
                      className="notification-message fs-4 mt-2 text-muted"
                      title={
                        notification.notification.message
                      }
                    >

                      {
                        notification.notification.message ||
                        t("No Message")
                      }

                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-2 gap-2">

                      <div className="text-ellipsis">

                        <p
                          className="m-0 text-muted text-ellipsis fs-4"
                          title={
                            notification.notification
                              .sender?.name
                          }
                        >

                          {
                            i18n.language === "en"
                              ? notification.notification
                                  .sender?.name
                              : notification.notification
                                  .sender?.nameAR
                          }

                        </p>

                      </div>

                      <div className="d-flex align-items-center gap-1">

                        <p
                          className="text-muted small m-0 fs-4"
                          title={notification.sendAt}
                        >

                          {
                            timeAgo(
                              new Date(
                                notification.sendAt
                              ),
                              i18n.language === "en"
                            )
                          }

                        </p>

                        <IconClockHour10
                          size={18}
                          className="text-primary"
                        />

                      </div>

                    </div>

                  </div>

                </div>

                {/* Dates */}
                <div className="d-flex flex-column gap-1 mt-3">

                  <div className="d-flex align-items-center gap-2">

                    <p className="m-0 fw-bolder">
                      {t("notifications.sendAt")}:
                    </p>

                    <div className="d-flex align-items-center gap-2">

                      <p className="m-0">
                        {
                          convertDateTime(
                            notification.sendAt
                          )
                        }
                      </p>

                      <IconClockHour10
                        className="text-primary"
                        size={20}
                      />

                    </div>

                  </div>

                  <div className="d-flex align-items-center gap-2">

                    <p className="m-0 fw-bolder">
                      {t("notifications.readAt")}:
                    </p>

                    <div className="d-flex align-items-center gap-2">

                      <p className="m-0">

                        {
                          notification.readAt
                            ? convertDateTime(
                                notification.readAt
                              )
                            : "-"
                        }

                      </p>

                      <IconClockHour10
                        className="text-primary"
                        size={20}
                      />

                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>

          {/* Footer */}
          <div className="modal-footer">

            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              {t("misc.close")}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}