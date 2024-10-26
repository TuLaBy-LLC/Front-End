import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import SideBarComp from "../../components/SideBar/SideBar";
import { useContext, useState } from "react";
import UserContext from "../../contexts/UserContextProvider";
import { SideBarContext } from "../../contexts/SideBarProvider";

export default function Layout() {
  const { User } = useContext(UserContext);
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
            User?.jwt_token ? "-fluid" : ""
          } min-vh-100 bg-light py-4 position-relative`}
        >
          <Outlet />
        </div>
      </div>
      {/* Content */}
    </div>
  );
}
