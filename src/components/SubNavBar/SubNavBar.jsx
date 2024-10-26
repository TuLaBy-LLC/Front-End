import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SubNavBar({t}) {
  const { pathname } = useLocation("");

  const [activeLink, setActiveLink] = useState(pathname.slice(1));
  // console.log(pathname.split("/"));
  useEffect(() => {
    setActiveLink(pathname.split("/")[1]);
  }, [pathname]);

  return (
    <>
      {/* Main Menu */}
      <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bolder">
            {t("TuLaBy")}
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li
                className={`nav-item hover-event ${
                  activeLink === "" && "active"
                }`}
              >
                <Link
                  className="nav-link"
                  to="/"
                  onClick={(_) => setActiveLink("")}
                >
                  {t("misc.Home")}
                </Link>
              </li>

              <li
                className={`nav-item hover-event ${
                  activeLink === "news" && "active"
                }`}
              >
                <Link
                  className="nav-link"
                  to="/news"
                  onClick={(_) => setActiveLink("news")}
                >
                  {t("news.news")}
                </Link>
              </li>

              <li
                className={`nav-item hover-event ${
                  activeLink === "attendance" && "active"
                }`}
              >
                <Link
                  className="nav-link"
                  to="/attendance"
                  onClick={(_) => setActiveLink("attendance")}
                >
                  {t("misc.Attendance")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
