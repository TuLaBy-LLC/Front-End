import Apis from "../../Api.json";
import { useQuery } from "react-query";

import LoadingComponent from "../loading/Loading";
import EventTableRecord from "./EventTableRecord/EventTableRecord";

import { IconRefreshDot } from "@tabler/icons-react";

import { invokeAsync } from "../../Services/api";

const API_URLS = {
  lecture: `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${Apis.getActivatedLectures}`,
  session: `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${Apis.getActivatedSessions}`
};

/**
 * Get lectures/sessions records
 */
const getRecords = async (token, api) => {
  return await invokeAsync(
    "get",
    api,
    token
  );
};

export default function EventTable({
  isLecture = true,
  t,
  lang,
  token,
  code
}) {

  const eventType = isLecture
    ? "lecture"
    : "session";

  const personType = isLecture
    ? "Professor"
    : "Instructor";

  const api =
    `${API_URLS[eventType]}?subjectCode=${code}` +
    `&navigations.enable${personType}=true`;

  const queryKey = [
    "Subject",
    code,
    token,
    eventType,
    "Records"
  ];

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery(
    queryKey,
    () => getRecords(token, api),
    {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false
    }
  );

  console.log(data);
  

  const renderContent = () => {

    if (isLoading) {
      return <LoadingComponent />;
    }

    if (isError) {
      return (
        <div className="p-4">
          <div className="alert bg-transparent alert-warning">
            {error?.message}
          </div>
        </div>
      );
    }

    if (!data?.count) {
      return (
        <div className="p-4">
          <div className="alert bg-transparent alert-info mb-0">
            <p className="mb-0">
              {
                t(
                  `errors.${
                    isLecture
                      ? "Lectures"
                      : "Sessions"
                  }Records`
                )
              }
            </p>
          </div>
        </div>
      );
    }

    return (
      <table className="table text-nowrap mb-0 align-middle">

        <thead className="text-dark fs-4">
          <tr>

            <th className="border-bottom-0">
              <h6 className="fw-semibold mb-0">
                {t("misc.title")}
              </h6>
            </th>

            <th className="border-bottom-0">
              <h6 className="fw-semibold mb-0">
                {t("misc.presence")}
              </h6>
            </th>

            <th className="border-bottom-0">
              <h6 className="fw-semibold mb-0">
                {t("misc.bouns")}
              </h6>
            </th>

            <th className="border-bottom-0">
              <h6 className="fw-semibold mb-0">
                {
                  t(
                    `persons.${
                      isLecture
                        ? "professor"
                        : "instructor"
                    }`
                  )
                }
              </h6>
            </th>

            <th className="border-bottom-0">
              <h6 className="fw-semibold mb-0">
                {t("misc.date")}
              </h6>
            </th>

          </tr>
        </thead>

        <tbody className="list-items fs-1">

          {data.items.map(record => (
            <EventTableRecord
              key={record.code}
              isLecture={isLecture}
              lang={lang}
              {...record}
            />
          ))}

        </tbody>

      </table>
    );
  };

  return (
    <div className="shadow-sm px-3 py-4 position-relative bg-light">

      {/* Refresh Button */}
      <div className="position-absolute top-0 end-0">

        <button
          type="button"
          className="btn btn-transparent p-0 px-2"
          onClick={refetch}
          title={t("misc.refresh")}
        >
          <IconRefreshDot size={16} />
        </button>

      </div>

      <div className="table-responsive">
        {renderContent()}
      </div>

    </div>
  );
}