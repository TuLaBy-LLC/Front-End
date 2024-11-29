import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import UserContext from "../../contexts/UserContextProvider";
import NotificationSettings from "../../components/NotificationSettings/NotificationSettings";
import {
  IconAvocado,
  IconBellRinging,
  IconBellRinging2,
  IconBlobFilled,
  IconNotification,
  IconPrismOff,
  IconShieldLock,
  IconShoppingCartDiscount,
  IconSquareRoundedChevronRight,
} from "@tabler/icons-react";
import Toast_Default from "../../components/Toasts/Toasts";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [showToast, setShowToast] = useState({
    activate: false,
    message: "",
    messageAR: "",
    success: true,
  });
  const { t, i18n } = useTranslation();
  const User = useContext(UserContext);
  // console.log(token);

  const handleToast = ({ message = "", messageAR = "", statusCode = true }) => {
    setShowToast({
      activate: true,
      message,
      messageAR,
      success: statusCode < 400,
    });
  };

  return (
    <>
      <Helmet>
        <title>{t("Settings.Settings")}</title>
        <link rel="icon" href="../../assets/icons/settings.ico" />
      </Helmet>

      {showToast.activate && (
        <Toast_Default
          setActivate={setShowToast}
          statusIsSuccess={showToast.success}
          message={
            i18n.language == "en" ? showToast.message : showToast.messageAR
          }
          time={7000}
        />
      )}

      <div
        className="settings container"
        style={{
          minHeight: "80vh",
        }}
      >
        <h1 className="h3 mb-4 shadow-sm bg-white rounded-2 p-4">
          {t("settings.settings")}
        </h1>
        <div className="row gutters-sm">
          <div className="col-md-4 d-none d-md-block">
            <div className="card">
              <div className="card-body">
                <nav className="nav flex-column align-items-start nav-pills">
                  <button
                    className={`nav-item nav-link has-icon nav-link-faded w-100 ${
                      activeTab === "notifications" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <IconBellRinging />
                    {t("notifications.notifications")}
                  </button>
                  <button
                    className={`nav-item nav-link has-icon nav-link-faded w-100 ${
                      activeTab === "security" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("security")}
                  >
                    <IconShieldLock />
                    {t("security.security")}
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="col-md-8 d-md-none mb-3">
            <div className="card bg-white p-3">
              <nav className="nav nav-tabs" role="tablist">
                <button
                  className={`nav-item nav-link has-icon nav-link-faded ${
                    activeTab === "notifications" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <IconBellRinging />
                </button>

                <button
                  className={`nav-item nav-link has-icon nav-link-faded ${
                    activeTab === "security" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <IconShieldLock />
                </button>
              </nav>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card">
              <div className="card-body p-4">
                {activeTab === "security" && (
                  <div>
                    <h6>{t("security.settings")}</h6>
                    <hr />
                  </div>
                )}
                {activeTab === "notifications" && (
                  <div>
                    <h6>{t("notifications.settings")}</h6>
                    <hr />

                    <NotificationSettings
                      handleToast={handleToast}
                      {...User}
                      t={t}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
