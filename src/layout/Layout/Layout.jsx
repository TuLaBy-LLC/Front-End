import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import SideBarComp from "../../components/SideBar/SideBar";
import { useContext, useState } from "react";
import UserContext from "../../contexts/UserContextProvider";
import { SideBarContext } from "../../contexts/SideBarProvider";
import { NotificationContext } from "../../contexts/NotificationProvider";
import NotificationDetailsModal from './../../components/NotificationDetailsModal/NotificationDetailsModal'
export default function Layout() {
  const { User } = useContext(UserContext);
  const Notification = useContext(NotificationContext);
  const { sideBarOptions } = useContext(SideBarContext);

  return (
    <div className="page-wrapper d-flex w-100">
      {sideBarOptions.enable && <SideBarComp />}

      {/* Content */}
      <div className="body-wrapper w-100">
        {/* Header */}
        <Header />
        {/* Header */}

        <div
          className={`container${
            User?.token ? "-fluid" : ""
          } bg-light py-4 position-relative`}
          style={{
            minHeight: "88vh",
          }}
        >
          <Outlet />
        </div>
      </div>
      {/* Content */}

      {/* Notification Pop Up */}
      {User?.token && <NotificationDetailsModal {...Notification.activeModalData} />}
    </div>
  );
}
