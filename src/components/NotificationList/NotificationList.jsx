import { useContext } from "react";
import { NotificationContext } from "../../contexts/NotificationProvider";
import NotificationItem from "../NotificationsDropDown/NotificationItem/NotificationItem";

export default function NotificationList({ notifications, isEnglish, t }) {
  const {handleSetActiveModalData} = useContext(NotificationContext)

  const items = notifications.items;

  return items?.length > 0 ? (
    <>
      {items.map((notification) => (
        <div className="border-0 border-bottom" key={notification.id}>
          <NotificationItem
            handleNotificationPopUp={handleSetActiveModalData}
            isFullView={true}
            isEnglish={isEnglish}
            {...notification}
          />
        </div>
      ))}
      {notifications.page >= notifications.totalPages ? (
        <div className="d-flex align-items-center justify-content-center p-4 border-0 border-bottom">
          {t("notifications.noMore")}
        </div>
      ) : (
        <></>
      )}
    </>
  ) : (
    <>{t("notifications.noMore")}</>
  );
}
