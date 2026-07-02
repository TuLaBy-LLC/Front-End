import { Helmet } from "react-helmet";
import { useContext, useEffect, useMemo, useState } from "react";
import { SideBarContext } from "../../contexts/SideBarProvider";
import Apis from "../../Api.json";
import { useTranslation } from "react-i18next";
import UserContext from "../../contexts/UserContextProvider";
import { useQuery } from "react-query";
import defaultImage from "./../../assets/images/user-1.jpg";

import LoadingComponent from "../../components/loading/Loading";
import { useNavigate } from "react-router-dom";
import Club from "./../../components/Club/Club";
import { invokeAsync } from "../../Services/api";
import Chat from "../../components/Chat/Chat";
import { useChat } from "../../contexts/ChatProvider";
import {
  IconSearch,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightExpand,
  IconMenu2,
  IconMessageCircle
} from "@tabler/icons-react";

const ApiUrl_Clubs = `${import.meta.env.VITE_Chats_Hub_BASE_URL_API_KEY}${Apis.chats.getAllClubs}`;
const ApiUrl_Profile = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${Apis.profile.profile}`;



export default function Chats() {
  const { sideBarOptions, setSideBarOptions } = useContext(SideBarContext);
  const { t, i18n } = useTranslation();
  const { User, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);

  const {
    data: AllClubsData,
    isLoading: AllClubsDataIsLoading,
    isError: AllClubsDataIsError,
    error: AllClubsDataError,
  } = useQuery(
    `AllClubs`,
    () =>
      invokeAsync(
        "get",
        `${ApiUrl_Clubs}?search.userId=${User.id}`,
        User.token
      ),
    {
      staleTime: 60 * 60 * 24,
      retry: 2,
      onError: (err) => {
        if (err.status == 401) {
          updateUser({}, true);
          navigate("/"); // Redirect to home
        }
      },
    }
  );  

  const { data: UserData } = useQuery(
    `profileData:${User.token}`,
    (_) => invokeAsync("get",ApiUrl_Profile, User.token),
    {
      staleTime: 60 * 60 * 60,
      retry: 2,
      onSuccess: (data) => {
        updateUser({ ...User, imageName: data?.user?.imageName });
      },
      onError: (err) => {
        if (err.status == 401) {
          updateUser({}, true);
          navigate("/"); // Redirect to home
        }
      },
    }
  );

  const {
    setActiveConversation
  } = useChat();

  const handleSelectClub = club => {
    // console.log("handleSelectClub,", club);

    setSelectedClub(club);
    setActiveConversation(club);
  };

  useEffect(() => {
    setSideBarOptions((prev) => ({
      ...prev,
      enable: true,
    }));
  }, []);

  const chatUser = useMemo(() => ({
    id: User.id,
    token: User.token
  }), [User.id, User.token]);

  return (
    <>
      <Helmet>
        <title>Chats</title>
        <link rel="icon" href="../../assets/icons/chats.ico" />
      </Helmet>

      <div
        id="chats"
        data-user-id={User.id}
        className="d-flex bg-white shadow-sm rounded-3 overflow-hidden position-relative"
        style={{ height: "calc(100vh - 60px)" }}
      >
        {AllClubsDataIsLoading ? (
          <LoadingComponent />
        ) : AllClubsDataIsError ? (
          <div className="p-4 w-100">
            <div className="alert bg-transparent alert-warning">
              {t("errors.apiError")}
            </div>
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <aside
              id="chatsSide"
              className={`bg-white border-end d-flex flex-column chats-sidebar ${isSidebarOpen ? "show" : "hide"
                }`}
            >

              {/* Sidebar Header */}
              <header className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light-subtle">
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                  <img
                    src={UserData?.imageName || defaultImage}
                    width="42"
                    height="42"
                    className="rounded-circle border"
                    alt="Profile"
                  />

                  <div className="overflow-hidden">
                    <p
                      className="m-0 fw-semibold text-truncate"
                      title={UserData?.name}
                    >
                      {UserData?.name}
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-light border-0"
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                >
                  {isSidebarOpen ? (
                    <IconLayoutSidebarLeftCollapse size={22} />
                  ) : (
                    <IconLayoutSidebarRightExpand size={22} />
                  )}
                </button>
              </header>

              {/* Search */}
              <div className="p-3 border-bottom">
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <IconSearch size={18} />
                  </span>

                  <input
                    type="text"
                    className="form-control searchInput"
                    placeholder={t("chats.search")}
                  />
                </div>
              </div>

              {/* Clubs List */}
              <div className="list-group flex-grow-1 overflow-auto chat-boxes">
                {!isSidebarOpen && (
                  <button
                    className="btn btn-light position-absolute top-0 m-3"
                    style={{ zIndex: 1000, left: "0%" }}
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <IconLayoutSidebarLeftCollapse size={22} />
                  </button>
                )}
                {AllClubsData.data?.count === 0 ? (
                  <div className="p-3 text-center text-muted">
                    {t("chats.noChats")}
                  </div>
                ) : (
                  AllClubsData.data?.items.map((club) => (
                    <Club
                      key={club.id}
                      club={club}
                      onSelect={handleSelectClub}
                    />
                  ))
                )}
              </div>
            </aside>

            {/* Chat Area */}
            <section className="flex-grow-1 position-relative d-flex flex-column">

              {/* Mobile Toggle */}
              {!isSidebarOpen && (
                <button
                  className="btn btn-light position-absolute top-0 start-0 m-3 d-md-none"
                  style={{ zIndex: 10 }}
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <IconMenu2 size={24} />
                </button>
              )}

              {selectedClub == null ? (
                <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-light-subtle">
                  <div className="text-center">
                    <IconMessageCircle
                      size={70}
                      stroke={1.5}
                      className="text-muted"
                    />

                    <p className="mt-3 fs-5 fw-bold text-muted">
                      {t("chats.welcome")}
                    </p>
                  </div>
                </div>
              ) : (
                <Chat
                  club={selectedClub}
                  t={t}
                  language={i18n.language}
                  user={chatUser}

                />
              )}
            </section>

          </>
        )}
      </div>
    </>
  );
}