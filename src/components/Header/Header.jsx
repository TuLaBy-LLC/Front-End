import {
  IconBellRinging,
  IconLanguage,
  IconLogin,
  IconMenu2,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useContext } from "react";
import UserContext from "../../contexts/UserContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubNavBar from "../SubNavBar/SubNavBar";
import { SideBarContext } from "../../contexts/SideBarProvider";
import userImg from './../../assets/images/user-1.jpg'

export default function Header() {
  const { User, handleLogout } = useContext(UserContext);
  const { sideBarOptions,setSideBarOptions } = useContext(SideBarContext);

  const { t, i18n } = useTranslation();

  const changeLanguage_ = () => {
    // console.log(i18n);
    i18n.changeLanguage(i18n.language == "ar" ? "en" : "ar");
  };
  const navigate = useNavigate();

  const handelLogoutBtn = () => {
    handleLogout();

    navigate("/");
  };

  return (
    <>
      {/* <!--  Header Start --> */}
      <header className="app-header">
        <main className="top">
          <nav className="top navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <ul className="navbar-nav">
              {sideBarOptions.enable  && (
                <li className="nav-item">
                  <button
                    type="button"
                    className="nav-link nav-icon-hover d-xl-none"
                    onClick={() =>
                      setSideBarOptions((p) => ({
                        ...p,
                        toggle: !p.toggle,
                      }))
                    }
                  >
                    <IconMenu2 />
                  </button>
                </li>
              )}

              <li className="nav-item">
                <a className="nav-link nav-icon-hover" href="">
                  <IconBellRinging />
                  <div className="notification bg-primary rounded-circle"></div>
                </a>
              </li>
            </ul>

            <div
              className="navbar-collapse justify-content-end px-3"
              id="navbarNav"
            >
              <ul className="navbar-nav flex-row align-items-center gap-1 justify-content-end">
                <li>
                  <button
                    type="button"
                    onClick={changeLanguage_}
                    className="btn btn-outline-primary d-flex align-items-center gap-2 fs-3"
                  >
                    <IconLanguage size={18} />
                    <span className=" d-none d-md-inline">
                      {t("misc.Language")}
                    </span>
                  </button>
                </li>

                {User.token ? (
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link nav-icon-hover placeholder-glow"
                      id="drop2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={User.imageName}
                        alt=""
                        width="35"
                        height="35"
                        className={`rounded-circle ${
                          User.imageName ? "" : "placeholder"
                        }`}
                      />
                    </button>
                    <div
                      className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                      aria-labelledby="drop2"
                    >
                      <div className="d-flex flex-column">
                        <Link
                          to={`/profile`}
                          className="d-flex align-items-center gap-2 dropdown-item"
                        >
                          <IconUser />
                          <p className="mb-0 fs-3">{t("misc.My Profile")}</p>
                        </Link>
                        <Link
                          to={`settings`}
                          className="d-flex align-items-center gap-2 dropdown-item"
                        >
                          <IconSettings />
                          <p className="mb-0 fs-3">{t("misc.Settings")}</p>
                        </Link>
                        <button
                          onClick={handelLogoutBtn}
                          className="btn btn-outline-primary mx-3 mt-2"
                        >
                          {t("security.Logout")}
                        </button>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li>
                    <button
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#login-modal"
                      className="btn btn-primary text-light d-flex align-items-center gap-2 fs-3"
                    >
                      <span>{t("security.Login")}</span>
                      <IconLogin size={20} />
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </main>

        {/* Sub Menue */}
        {User?.id && (
          <div className="sub-navbar container">
            <SubNavBar t={t} />
          </div>
        )}
      </header>
      {/* <!--  Header End --> */}
    </>
  );
}
