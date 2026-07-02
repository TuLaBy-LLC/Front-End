import React, {
  useState,
  useEffect,
  useContext
} from "react";
import { Link } from "react-router-dom";
import {
  IconBellRinging,
  IconCirclePlus,
  IconRefresh,
} from "@tabler/icons-react";
import i18next from "i18next";
import Apis from "./../../Api.json";
import NotificationItem from "./NotificationItem/NotificationItem";
import {
  NotificationContext
} from "../../contexts/NotificationProvider";
import { invokeAsync } from "../../Services/api";


const notificationsUrl =
  `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${Apis.notifications.notifications
  }`;

export default function NotificationsDropDown({
  t,
  User
}) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [pageIndex, setPageIndex] = useState(1);
  const [spinner, setSpinner] = useState(false);
  const [moreNotifications, setMoreNotifications] =
    useState(true);

  const {
    notifications,
    setNotifications,
    newNotification,
    resetNotificationBadge,
    handleSetActiveModalData
  } = useContext(NotificationContext);

  /**
 * Fetch notifications
 */
  const fetchNotifications = async (
    page = 1,
    reset = false
  ) => {
    try {
      setSpinner(true);

      const data = await invokeAsync(
        "get",
        `${notificationsUrl}?Pagination.pageSize=10&Pagination.pageIndex=${page}`,
        User.token
      );

      setNotifications(prev =>
        reset
          ? data.items
          : [...prev, ...data.items]
      );

      setMoreNotifications(
        data.totalPages > data.page
      );

    } catch (error) {

      console.error(
        "Error fetching notifications:",
        error
      );

    } finally {

      setSpinner(false);
    }
  };

  /**
   * Initial load
   */
  useEffect(() => {

   

  }, [User?.token]);

  /**
   * Refresh notifications
   */
  const handleRefreshNotifications =
    async () => {

      setPageIndex(1);

      await fetchNotifications(
        1,
        true
      );

      resetNotificationBadge();
    };

  /**
   * Load more
   */
  const handleGetMoreNotifications =
    async () => {

      const nextPage = pageIndex + 1;

      setPageIndex(nextPage);

      await fetchNotifications(nextPage);
    };

  /**
   * Bell clicked
   */
  const handleBellClick = () => {
     if (!User?.token)
      return;

    fetchNotifications(1, true);
    resetNotificationBadge();

  };

  /**
   * Set interval to handle time ago
   * 
   */
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  return (
    <>
      <button
        className="nav-link nav-icon-hover"
        id="notificationButton"
        data-bs-auto-close="outside"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={handleBellClick}
      >
        <IconBellRinging />

        {newNotification && (
          <div className="notificationIcon bg-primary rounded-circle" />
        )}
      </button>

      <div
        className="dropdown-menu pb-2"
        aria-labelledby="notificationButton"
        id="notificationDropdown"
      >
        <div
          className="dropdown-container"
          style={{ minWidth: "300px" }}
        >

          {spinner && (
            <div
              id="spinnerOverlay"
              className="overlay d-flex justify-content-center align-items-center"
            >
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between px-3 py-2">
            <div>
              {t("notifications.notifications")}
            </div>

            <button
              className="btn btn-primary py-1 px-2"
              type="button"
              onClick={
                handleRefreshNotifications
              }
            >
              <IconRefresh size={12} />
            </button>
          </div>

          <div
            id="notificationList"
            className="list-group"
          >
            {notifications.map(n => (
              <NotificationItem
                currentTime={currentTime}

                key={n.id}
                {...n}
                isEnglish={
                  i18next.language === "en"
                }
                handleNotificationPopUp={
                  handleSetActiveModalData
                }
              />
            ))}

            {!moreNotifications && (
              <p className="text-center text-muted py-2 m-0">
                {t("notifications.noMore")}
              </p>
            )}
          </div>

          <div className="dropdown-footer text-center d-flex align-items-center justify-content-between">
            <Link
              to="/notifications"
              className="btn btn-link"
            >
              {t("notifications.viewAll")}
            </Link>

            {moreNotifications && (
              <button
                id="getMoreNotifications"
                className="btn btn-primary py-1 px-2 me-3"
                type="button"
                onClick={
                  handleGetMoreNotifications
                }
              >
                <IconCirclePlus size={12} />
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}