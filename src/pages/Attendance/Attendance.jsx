import { Helmet } from "react-helmet";
import SideBarComp from "../../components/SideBar/SideBar";
import { useContext } from "react";
import { SideBarContext } from "../../contexts/SideBarProvider";
import { useEffect } from "react";
import { useQuery } from "react-query";
import UserContext from "../../contexts/UserContextProvider";
import axios from "axios";
import Apis from "./../../Api.json";
import Schedule from "../../components/Schedule/Schedule";
import LoadingComponent from "../../components/loading/Loading";
import { useTranslation } from "react-i18next";
import { convertDate } from "../../Helpers/Methods";
import Error, { Warn } from "../../components/Error/Error";

const SchedulesApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.getSchedule
}`;

const getSchedules = async (url, token) => {
  // console.log(url);
  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(data);

    return data;
  } catch ({ response: { data } }) {
    // console.log(data);
    throw data;
  }
};

// Add months and format the updated date
const currentDate = new Date().toDateString();

export default function Attendance() {
  const { sideBarOptions, setSideBarOptions } = useContext(SideBarContext);
  const { User } = useContext(UserContext);
  const { t ,i18n} = useTranslation();

  const { data, isLoading, isError, error } = useQuery("Schedule", (_) =>
    getSchedules(
      `${SchedulesApiUrl}?Navigations.EnableSessionsForStudent=true&Navigations.EnableLecturesForStudent=true&Search.Date=${currentDate}`,
      User?.token
    ),{
      refetchOnWindowFocus: false
    }
  );

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
            <Error {...error} />
          </div>
        ) : data.statusCode == 204 ? (
          <div className="row mx-4 gap-4 p-4 rounded-2 bg-white shadow-sm">
            <Warn message={data.message} />
          </div>
        ) : (
          <>
            <div className="row justify-content-around align-items-center mx-4 gap-4 py-4 rounded-2 bg-white shadow-sm">
              <div className="col-12">
                <p className="mb-0 text-muted bg-light p-3 rounded-2 shadow-sm">
                  {t("attendance.title")}
                  <span className="text-bolder ms-1">:</span>
                  <span
                    className="ms-2 fw-bolder fs-1rem text-primary"
                    title={data.title}
                  >
                    {data.title}
                  </span>
                </p>
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
              <Schedule schedule={data} i18n={i18n} t={t}/>
            </div>
          </>
        )}
      </div>
    </>
  );
}
