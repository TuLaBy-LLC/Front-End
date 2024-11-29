import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  IconBellRinging,
  IconCirclePlus,
  IconRefresh,
} from "@tabler/icons-react";
import Apis from "./../../Api.json";
import axios from "axios";
import signalR from "./../../Services/SignalR_Services";
import NotificationItem from "./NotificationItem/NotificationItem";
import i18next from "i18next";
import { NotificationContext } from "../../contexts/NotificationProvider";

const notificationsUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.notifications.notifications
}`;
const notificationHub = import.meta.env.VITE_Notification_Hub_URL_API_KEY;

export default function NotificationsDropDown({ t, User }) {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(true);
  const [index, setIndex] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [moreNotifications, setMoreNotifications] = useState(true);
  const { handleSetActiveModalData } = useContext(NotificationContext);

  const fetchNotifications = async (pageIndex = 1) => {
    // console.log(pageIndex);

    try {
      setSpinner(true);
      const response = await axios.get(notificationsUrl, {
        params: {
          "Pagination.pageSize": 10,
          "Pagination.pageIndex": pageIndex,
        },
        headers: { Authorization: `Bearer ${User.token}` },
      });
      const { data } = response;

      // console.log(data);

      setNotifications((prev) => [...prev, ...data.items]);
      setMoreNotifications(data.totalPages > data.page);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setSpinner(false);
    }
  };

  const handleStartConnection = async () => {
    setSpinner(true);
    try {
      const res = await signalR.start(notificationHub, User.id, User.token);

      if (index == 0) {
        await fetchNotifications(1);
        setNewNotification(false);
        setIndex(1);
      }

      if (res != -1) {
        signalR.receive("ReceiveNotification", (notification) => {
          setNewNotification(true);
          setNotifications((prev) => [notification, ...prev]);
        });
      }

      setNewNotification(false);
    } catch (error) {
      console.error("Error connecting to SignalR:", error);
    } finally {
      setSpinner(false);
    }
  };

  const handleReFreshNotifications = () => {
    setNotifications([]);
    setIndex(1);
    fetchNotifications(1);
  };

  const handleGetMoreNotifications = () => {
    const nextPage = index + 1;
    setIndex(nextPage);
    fetchNotifications(nextPage);
  };

  // useEffect(() => {
  //   return () => {
  //     signalR.stop();
  //   };
  // }, [signalR.stop]);

  return (
    <>
      <button
        className="startConnection nav-link nav-icon-hover"
        id="notificationButton"
        data-bs-auto-close="outside"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={handleStartConnection}
      >
        <IconBellRinging />
        {newNotification && (
          <div className="notificationIcon bg-primary rounded-circle"></div>
        )}
      </button>

      <div
        className="dropdown-menu pb-2"
        aria-labelledby="notificationButton"
        id="notificationDropdown"
      >
        <div
          className="dropdown-container"
          style={{
            minWidth: "300px",
          }}
        >
          {spinner && (
            <div
              id="spinnerOverlay"
              className="overlay d-flex justify-content-center align-items-center"
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between px-3 py-2">
            <div>{t("notifications.notifications")}</div>
            <button
              className="reFetchNotifications btn btn-primary py-1 px-2"
              type="button"
              onClick={handleReFreshNotifications}
            >
              <IconRefresh size={12} />
            </button>
          </div>

          <div id="notificationList" className="list-group">
            {notifications.length > 0 &&
              notifications.map((n) => (
                <NotificationItem
                  handleNotificationPopUp={handleSetActiveModalData}
                  key={n.id}
                  isEnglish={i18next.language == "en"}
                  {...n}
                />
              ))}
              
            {moreNotifications || (
              <p className="text-center text-muted py-2 m-0">
                {t("notifications.noMore")}
              </p>
            )}
          </div>

          <div className="dropdown-footer text-center d-flex align-items-center justify-content-between">
            <Link to="/notifications" className="btn btn-link">
              {t("notifications.viewAll")}
            </Link>
            {moreNotifications && (
              <button
                id="getMoreNotifications"
                className="btn btn-primary py-1 px-2 me-3"
                type="button"
                onClick={handleGetMoreNotifications}
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
