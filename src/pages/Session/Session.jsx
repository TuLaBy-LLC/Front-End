import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { SideBarContext } from "../../contexts/SideBarProvider";
import Apis from "../../Api.json";
import EventCard from "../../components/EventCard/EventCard";
import { useTranslation } from "react-i18next";
import StatisticsCard from "../../components/StatisticsCard/StatisticsCard";
import { useQuery } from "react-query";
import UserContext from "../../contexts/UserContextProvider";
import LoadingComponent from "../../components/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import CaptureAttendanceModal from "../../components/CaptureAttendanceModal/CaptureAttendanceModal";
import EventTable from "../../components/EventTable/EventTable";
import { invokeAsync } from "../../Services/api";
import { IconSchoolOff } from "@tabler/icons-react";

const ApiUrl_Session = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${Apis.getNextSession
  }`;

const ApiUrl_SessionStatistics = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY
  }${Apis.getSessionStatistics}`;


// Add months and format the updated date
const currentDate = new Date().toDateString();

export default function Session() {
  const { sideBarOptions, setSideBarOptions } = useContext(SideBarContext);
  const { User, updateUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const [showTable, setshowTable] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  // console.log(params);

  const {
    data: dataSession,
    isLoading: sessionIsLoading,
    isError: sessionIsError,
    error: sessionError,
  } = useQuery(
    `Subject[${params?.code}][${User?.token}].Session`,
    () =>
      invokeAsync("get",
        `${ApiUrl_Session}?SubjectCode=${params?.code}&NearestDate=${currentDate}&Navigations.EnableInstructor=true&Navigations.EnablePlace=true`,
        User.token,
      ),
    {
      staleTime: 60 * 60 * 24,
      retry: 2,
      onError: (err) => {
        if (err.status == 401) {
          updateUser({}, true);
          navigate("/"); // Redirect to home

        }
      }
    }
  );
  // console.log(dataSession);

  const {
    data: dataSessionStatistics,
    isLoading: sessionStatisticsIsLoading,
    isError: sessionStatisticsIsError,
    error: sessionStatisticsError,
    refetch: sessionStatisticsRefetch,
  } = useQuery(
    `Subject[${params?.code}][${User?.token}].SessionStatistics`,
    () => invokeAsync("get", ApiUrl_SessionStatistics + `/${params?.code}`, User.token),
    {
      staleTime: 60 * 60 * 24,
      enabled: false,
    }
  );
  // console.log(dataSessionStatistics);

  useEffect(() => {
    setSideBarOptions((prev) => ({
      ...prev,
      enable: true,
    }));
  }, []);

  return (
    <>
      <Helmet>
        <title>Session</title>
        <link rel="icon" href="../../assets/icons/Session.ico" />
      </Helmet>

      <div className="container pt-5">
        <div className="row bg-white gy-4 rounded-1 shadow-sm pb-4">
          {sessionIsLoading ? (
            <LoadingComponent />
          ) : dataSession?.statusCode === 204 ? (
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-center py-5">
                <div
                  className="bg-white shadow-sm rounded-4 p-5 text-center border"
                  style={{ maxWidth: "500px", width: "100%" }}
                >
                  <div
                    className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-warning-subtle"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <IconSchoolOff
                      size={40}
                      className="text-warning"
                    />
                  </div>

                  <h3 className="fw-bold mb-3">
                    {t("session.empty.title")}
                  </h3>

                  <p className="text-muted fs-5 mb-0">
                    {i18n.language === "en"
                      ? dataSession.message
                      : dataSession.messageAR || t("session.empty.description")}
                  </p>

                  <small className="text-secondary d-block mt-3">
                    {t("session.empty.hint")}
                  </small>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="col-12 col-md-6">
                <div className="h-100 shadow-sm rounded-1">
                  {sessionIsError ? (
                    <div className="p-4">
                      <div className="alert bg-transparent alert-warning">
                        {sessionError.message}
                      </div>
                    </div>
                  ) : dataSession != null ? (
                    <EventCard
                      {...dataSession}
                      type="session"
                      translate={{ t, lang: i18n.language }}
                    />
                  ) : (
                    <div className="p-4">
                      <div className="alert bg-transparent alert-info">
                        <p className="mb-0">{t("errors.UpcomingSessions")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="h-100 shadow-sm">
                  {dataSessionStatistics == null ? (
                    <div className="text-center py-4">
                      <button
                        type="button"
                        className="btn btn-outline-primary mx-auto"
                        onClick={sessionStatisticsRefetch}
                      >
                        {sessionStatisticsIsLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          t("misc.showStatistics")
                        )}
                      </button>
                    </div>
                  ) : (
                    <StatisticsCard
                      attends={dataSessionStatistics.attended}
                      total={dataSessionStatistics.total}
                      totalMarks={dataSessionStatistics.totalMark}
                      grade={dataSessionStatistics.grade}
                      percentage={
                        (
                          dataSessionStatistics.attended /
                          dataSessionStatistics.total
                        ).toFixed(2) * 100
                      }
                      t={t}
                      refetch={sessionStatisticsRefetch}
                    />
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex gap-3 p-4">
                  {/* <!-- Split dropup button --> */}
                  <div className="btn-group dropup">
                    <button
                      type="button"
                      className="btn btn-primary dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {t("misc.Capture Attendance")}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          data-bs-target="#cature-attendance"
                          data-bs-toggle="modal"
                        >
                          QR
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          data-bs-target="#code-modal"
                          data-bs-toggle="modal"
                        >
                          Code
                        </button>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-primary py-2 fs-3"
                    onClick={() => setshowTable(true)}
                  >
                    {t("misc.Show Sessions")}
                  </button>
                </div>
              </div>

              {showTable && (
                <div className="col-12">
                  <div className="">
                    <EventTable
                      isLecture={false}
                      lang={i18n.language}
                      t={t}
                      code={params?.code}
                      token={User?.token}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <CaptureAttendanceModal
        type="session"
        t={t}
        lang={i18n.language}
        subjectCode={params?.code}
        eventCode={dataSession?.code}
        token={User?.token}
        place={dataSession?.place}
      />
    </>
  );
}
