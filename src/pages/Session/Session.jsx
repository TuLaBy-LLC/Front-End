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
import axios from "axios";
import { useParams } from "react-router-dom";
import CaptureAttendanceModal from "../../components/CaptureAttendanceModal/CaptureAttendanceModal";
import EventTable from "../../components/EventTable/EventTable";

const ApiUrl_Session = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.getNextSession
}`;

const ApiUrl_SessionStatistics = `${
  import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY
}${Apis.getSessionStatistics}`;

export const getApi = async (token, api = ApiUrl_Session, query) => {
  try {
    const response = await axios.get(`${api}?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(response);
    return response.data;
  } catch ({ response: { data } }) {
    // console.log(data);

    throw data;
  }
};

// Add months and format the updated date
const currentDate = new Date().toDateString();

export default function Session() {
  const { sideBarOptions, setSideBarOptions } = useContext(SideBarContext);
  const { User } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const [showTable, setshowTable] = useState(false);
  const params = useParams();

  // console.log(params);

  const {
    data: dataSession,
    isLoading: sessionIsLoading,
    isError: sessionIsError,
    error: sessionError,
  } = useQuery(
    `Subject[${params?.code}][${User?.token}].Session`,
    () =>
      getApi(
        User.token,
        ApiUrl_Session,
        `SubjectCode=${params?.code}&NearestDate=${currentDate}&Navigations.EnableInstructor=true&Navigations.EnablePlace=true`
      ),
    {
      staleTime: 60 * 60 * 24,
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
    () => getApi(User.token, ApiUrl_SessionStatistics + `/${params?.code}`),
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
          ) : dataSession?.statusCode == 204 ? (
            <div className="p-4">
              <div className="alert bg-transparent alert-warning">
                {dataSession.message}
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
