import React, { useContext, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
  sidebarClasses,
} from "react-pro-sidebar";
import {
  IconBook,
  IconChevronsLeft,
  IconChevronsRight,
  IconLogout,
  IconPresentationAnalytics,
  IconSlideshow,
} from "@tabler/icons-react";
import logoLight from "./../../assets/images/logo-light.png";
import UserContext from "../../contexts/UserContextProvider";
import { SideBarContext } from "../../contexts/SideBarProvider";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingComponent from "../loading/Loading";
import Apis from "../../Api.json";
import { useTranslation } from "react-i18next";

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.getSubjects
}`;

const getSubjects = async (token) => {
  try {
    const response = await axios.get(ApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch ({ response: { data } }) {
    throw data;
  }
};

const MenuMemo = React.memo(Menu);

const SideBarComp = () => {
  const { User, handleLogout } = useContext(UserContext);
  const { sideBarOptions, setSideBarOptions } = useContext(SideBarContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const { data, isLoading, isError, error } = useQuery(
    `subjects[${User?.token}]`,
    () => getSubjects(User.token),
    {
      staleTime: 60 * 60 * 60,
      refetchOnWindowFocus: false, // Prevent refetching data on window focus
    }
  );
  // console.log({ data, isLoading, isError, error ,i18n});

  const handelLogoutBtn = () => {
    handleLogout();
    navigate("/");
  };

  const menuComponent = useMemo(() => {
    if (isLoading) {
      return <LoadingComponent />;
    } else if (isError) {
      return (
        <>
          <div className="alert bg-transparent alert-warning">
            <p className="">{error.message}</p>

            {error?.error?.map((er, i) => (
              <p key={i} className="">
                {er}
              </p>
            ))}
          </div>
          ;
        </>
      );
    } else if (data?.count > 0) {
      return (
        <MenuMemo
          className="overflow-scroll px-1 mb-3"
          menuItemStyles={{
            button: {
              ["&"]: {
                borderRadius: "8px",
                marginBlock: "1.5px",
                fontSize: ".75rem",
              },
              [`&:hover`]: {
                backgroundColor: "#5d87ff1a",
                color: "var(--bs-primary)",
              },
              [`&.${menuClasses.active}`]: {
                backgroundColor: "var(--bs-primary)",
                color: "var(--bs-white)",
              },
            },
          }}
        >
          {data?.items.map(({ code, title, titleAR }) => (
            <SubMenu
              key={code}
              icon={<IconBook size={20} />}
              label={i18n.language == "en" ? title : titleAR}
              active={
                location.pathname.includes(`/attendance/Lecture/${code}`) ||
                location.pathname.includes(`/attendance/Session/${code}`)
              }
            >
              <MenuItem
                component={<Link to={`/attendance/Lecture/${code}`} />}
                active={location.pathname.startsWith(
                  `/attendance/Lecture/${code}`
                )}
                icon={<IconSlideshow size={16} />}
              >
                {t("misc.lectures")}
              </MenuItem>
              <MenuItem
                component={<Link to={`/attendance/Session/${code}`} />}
                active={location.pathname.startsWith(
                  `/attendance/Session/${code}`
                )}
                icon={<IconPresentationAnalytics size={16} />}
              >
                {t("misc.sessions")}
              </MenuItem>
            </SubMenu>
          ))}
        </MenuMemo>
      );
    }
  }, [data, isLoading, isError, error, location.pathname,i18n.language]);

  useEffect(() => {
    if (location.pathname.split("/")[1] != "attendance") {
      setSideBarOptions((prev) => ({
        ...prev,
        enable: false,
      }));
    }
  }, [location.pathname]);

  return (
    <>
      <Sidebar
        toggled={sideBarOptions.toggle}
        collapsed={sideBarOptions.collapse}
        breakPoint="xl"
        collapsedWidth="150px"
        onBackdropClick={(_) =>
          setSideBarOptions((p) => ({ ...p, toggle: !p.toggle }))
        }
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            position: "sticky",
            top: "0",
            overflow: "visible",
            backgroundColor: "var(--bs-white)",
            height: "100vh",
            zIndex: "500",
            display: "flex",
            flexDirection: "column",
          },
          [`.${sidebarClasses.container} nav > ul > li`]: {
            [`& > .${menuClasses.button}`]: {
              fontWeight: "bold",
              paddingLeft: "10px",
            },
            [`& > a`]: {
              ["&"]: {
                fontSize: ".9rem",
              },
              [`&.${menuClasses.active}`]: {
                backgroundColor: "#5d87ff1a",
                color: "var(--bs-primary)",
              },
            },
          },
        }}
        width="270px"
      >
        {/* Collapse Toggle Btn */}
        <div
          className="collapse-btn d-none d-xl-flex bg-white p-2"
          style={{ width: "50px", height: "50px", zIndex: "401" }}
        >
          <button
            type="button"
            className="nav-link text-primary nav-icon-hover rounded-circle shadow-sm w-100 h-100"
            id="headerCollapse"
            onClick={() =>
              setSideBarOptions((p) => ({ ...p, collapse: !p.collapse }))
            }
          >
            {sideBarOptions.collapse ? (
              <IconChevronsRight />
            ) : (
              <IconChevronsLeft />
            )}
          </button>
        </div>
        {/* Collapse Toggle Btn */}

        <div className="brand-logo d-flex align-items-center justify-content-between mb-4">
          <Link to="/" className="text-nowrap logo-img">
            <img src={logoLight} className="w-100" alt="" />
          </Link>
          <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
          >
            <i className="ti ti-x fs-8"></i>
          </div>
        </div>

        {!isLoading &&
          (data?.count > 0 ? (
            menuComponent
          ) : (
            <div className="px-3">
              <div className="alert bg-transparent alert-warning">
                {t("warning.subjects0")}
              </div>
            </div>
          ))}

        <div className="mt-auto mb-3 position-sticky bottom-0 pb-4">
          <button
            type="button"
            onClick={handelLogoutBtn}
            className="btn btn-outline-danger d-flex justify-content-center align-items-center mx-auto gap-3 w-75 py-2 fs-3"
          >
            <span >LogOut</span>
            <IconLogout size={20} />
          </button>
        </div>
      </Sidebar>
    </>
  );
};

export default SideBarComp;
