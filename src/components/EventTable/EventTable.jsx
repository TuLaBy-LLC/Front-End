import { useState } from "react";
import { convertDateTime } from "../../Helpers/Methods";
import Apis from "../../Api.json";
import { useQuery } from "react-query";
import axios from "axios";
import LoadingComponent from "../loading/Loading";
import EventTableRecord from "./EventTableRecord/EventTableRecord";
import { IconRefreshDot } from "@tabler/icons-react";

const ApiUrl = {
  lecture: `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
    Apis.getActivatedLectures
  }`,
  session: `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
    Apis.getActivatedSessions
  }`,
};

export const getRecords = async (token, api) => {
  try {
    const response = await axios.get(api, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(response);

    return response.data;
  } catch ({ response: { data } }) {
    throw data;
  }
};

export default function EventTable({ isLecture = true, t, lang, token, code }) {
  const { data, isLoading, isError, error, refetch } = useQuery(
    `Subject[${code}][${token}].${isLecture ? "Lectures" : "Sessions"}Records`,
    () =>
      getRecords(
        token,
        ApiUrl[isLecture ? "lecture" : "session"] +
          `?subjectCode=${code}&navigations.enable${
            isLecture ? "Professor" : "Instructor"
          }=true`
      ),
    {
      staleTime: 60 * 60 * 24,
      refetchOnWindowFocus: false,
    }
  );
  // console.log(data);

  return (
    <div className="shadow-sm px-3 py-4 position-relative bg-light">
       <div className="position-absolute top-0 end-0 ">
        <button type="button" className="btn btn-transparent p-0 px-2" onClick={refetch}>
          <IconRefreshDot size={14} />
        </button>
      </div>
      <div className="table-responsive">
        {isLoading ? (
          <LoadingComponent />
        ) : isError ? (
          <div className="p-4">
            <div className="alert bg-transparent alert-warning">
              {error.message}
            </div>
          </div>
        ) : data?.count > 0 ? (
          <>
            {/* Float Btn Refresh Table */}

            <table className="table text-nowrap mb-0 align-middle">
              <thead className="text-dark fs-4">
                <tr>
                  <th className="border-bottom-0">
                    <h6 className="fw-semibold mb-0">{t("misc.title")}</h6>
                  </th>
                  <th className="border-bottom-0">
                    <h6 className="fw-semibold mb-0">{t("misc.presence")}</h6>
                  </th>
                  <th className="border-bottom-0">
                    <h6 className="fw-semibold mb-0">{t("misc.bouns")}</h6>
                  </th>
                  <th className="border-bottom-0">
                    <h6 className="fw-semibold mb-0">
                      {t(`persons.${isLecture ? "professor" : "instructor"}`)}
                    </h6>
                  </th>
                  <th className="border-bottom-0">
                    <h6 className="fw-semibold mb-0">{t("misc.date")}</h6>
                  </th>
                </tr>
              </thead>
              <tbody className="list-items fs-1">
                {/* <!-- Records --> */}
                {data?.items.map((record) => (
                  <EventTableRecord
                    isLecture={isLecture}
                    key={record.code}
                    lang={lang}
                    {...record}
                  />
                ))}
                {/* <!-- Records --> */}
              </tbody>
            </table>
          </>
        ) : (
          <div className="p-4">
            <div className="alert bg-transparent alert-info mb-0">
              <p className="mb-0">
                {t(`errors.${isLecture ? "Lectures" : "Sessions"}Records`)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
