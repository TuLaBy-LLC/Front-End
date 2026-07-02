import { Helmet } from "react-helmet";
import { useContext } from "react";
import { SideBarContext } from "../../contexts/SideBarProvider";
import { useEffect } from "react";
import { useQuery } from "react-query";
import UserContext from "../../contexts/UserContextProvider";
import Apis from "./../../Api.json";
import Schedule from "../../components/Schedule/Schedule";
import LoadingComponent from "../../components/loading/Loading";
import { useTranslation } from "react-i18next";
import { convertDate } from "../../Helpers/Methods";
import Error, { Warn } from "../../components/Error/Error";
import { useNavigate } from "react-router-dom";
import { invokeAsync } from "../../Services/api";
import { IconCalendarOff, IconRefresh } from "@tabler/icons-react";
import { useState } from "react";

const SchedulesApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${Apis.getSchedule
  }`;

// Add months and format the updated date
const currentDate = new Date().toDateString();

export default function Attendance() {
  const { sideBarOptions, setSideBarOptions } = useContext(SideBarContext);
  const { User, updateUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery(
    "Schedule",
    () =>
      invokeAsync(
        "get",
        `${SchedulesApiUrl}?Navigations.EnableSessionsForStudent=true&Navigations.EnableLecturesForStudent=true&Search.Date=${currentDate}`,
        User?.token
      ),
    {
      refetchOnWindowFocus: false,
      staleTime: 60 * 60 * 1000, // 1 hour
      retry: 2,
      onError: (err) => {
        if (err.status === 401) {
          updateUser({}, true);
          navigate("/");
        }
      },
    }
  );

  const handleRefresh = async () => {
    await refetch();
  };

  // console.log({ data, isLoading, isError, error });

  useEffect(() => {
    if (!sideBarOptions.enable)
      setSideBarOptions((prev) => ({
        ...prev,
        enable: true,
      }));
  }, []);

  return (
    <>
      <Helmet>
        <title>Attendance</title>
        <link rel="icon" href="../../assets/icons/attendance.ico" />
      </Helmet>

      <div className="">
        {isLoading ? (
          <LoadingComponent />
        ) : isError ? (
          <div className="row mx-4 gap-4 p-4 rounded-2 bg-white shadow-sm">
            <Error {...error} t={t} i18n={i18n} />
          </div>
        ) :
          data.statusCode === 204 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div
                className="bg-white shadow-sm rounded-4 p-5 text-center"
                style={{ maxWidth: "500px", width: "100%" }}
              >
                <div
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-warning-subtle"
                  style={{ width: "80px", height: "80px" }}
                >
                  <IconCalendarOff
                    size={40}
                    className="text-warning"
                  />
                </div>

                <h3 className="fw-bold mb-3">
                  {t("schedule.empty.title")}
                </h3>

                <p className="text-muted fs-5 mb-0">
                  {i18n.language === "en"
                    ? data.message
                    : data.messageAR || t("schedule.empty.description")}
                </p>

                <small className="text-secondary d-block mt-3">
                  {t("schedule.empty.hint")}
                </small>
              </div>
            </div>
          ) : (
            <>
              <div className="row justify-content-around align-items-center mx-4 gap-4 py-4 rounded-2 bg-white shadow-sm">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center bg-white border rounded-3 shadow-sm p-3">
                    <div>
                      <small className="text-muted d-block">
                        {t("attendance.title")}
                      </small>

                      <h5
                        className="mb-0 fw-bold text-primary text-truncate"
                        title={data.title}
                      >
                        {data.title}
                      </h5>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleRefresh}
                      disabled={isFetching}
                      title="Refresh"
                    >
                      <IconRefresh
                        size={20}
                        className={isFetching ? "spin" : ""}
                      />
                    </button>

                  </div>
                </div>

                <div className="col-md-5">
                  <div className="d-flex flex-md-column flex-lg-row bg-light p-3 rounded-2 shadow-sm">
                    <p className="mb-0 text-muted">
                      {t("attendance.startDate")}
                      <span className="text-bolder ms-1">:</span>
                    </p>
                    <span
                      className="ms- fw-bolder fs-1rem text-primary"
                      title={data.starting}
                    >
                      {convertDate(data.starting)}
                    </span>
                  </div>
                </div>
                <div className="d-none d-md-block col-1 text-center">
                  <span className="bg-light rounded-4 py-2 ps-1"></span>
                </div>

                <div className="col-md-5">
                  <div className="d-flex flex-md-column flex-lg-row bg-light p-3 rounded-2 shadow-sm">
                    <p className="mb-0 text-muted">
                      {t("attendance.endDate")}
                      <span className="text-bolder ms-1">:</span>
                    </p>
                    <span
                      className="ms- fw-bolder fs-1rem text-primary"
                      title={data.ending}
                    >
                      {convertDate(data.ending)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="row justify-content-around align-items-center mx-4 gap-4 p-3 rounded-2 bg-white shadow-sm mt-4">
                <Schedule schedule={data} i18n={i18n} t={t} />
              </div>
            </>
          )}
      </div>
    </>
  );
}
