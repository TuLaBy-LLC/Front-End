import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContextProvider";
import axios from "axios";
import Apis from "./../../Api.json";
import LoadingComponent from "../../components/loading/Loading";
import NotificationList from "../../components/NotificationList/NotificationList";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import FiltrationPanel, {
  queryStringToObject,
} from "../../components/FiltrationPanel/FiltrationPanel";
import { IconFilter, IconRefresh } from "@tabler/icons-react";
import { useQuery } from "react-query";
import Error from "../../components/Error/Error";
import Pagination, { GetPaginationValues } from "../../components/Pagination/Pagination";
import { handleQueryFormat, setQueryStringInURL } from "../../Helpers/helpersHandleQueries";

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.notifications.notifications
}`;

const __NotificationSpecificationsProperties = {
  navigations: {
    enableclub: "checkbox",
    enablenotification: "checkbox",
  },
  search: {
    id: "int",
    isread: "checkbox", // representing a boolean
    isunread: "checkbox", // representing a boolean
    sendat: "datetime-local",
    readat: "datetime-local",
    clubid: "string",
    senderid: "string",
    sendername: "string",
    sendernamear: "string",
    notificationid: "int",
    notificationhead: "string",
  },
  sort: {
    sorts: [],
  },
  pagination: {
    pageindex: "int",
    pagesize: "int",
  },
};

const AvailableSearchPropertiesToSortWith = {
  id: "id",
  sendat: "Send At",
  readat: "Read At",
};

const getNotifications = async (url, token) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch ({ response }) {
    throw response;
  }
};

export default function Notifications() {
  const [pageLoading, setPageLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const { User, updateUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState((_) => {
    let q = location.search;
    let first = q.length == 0;

    if (!location.search.includes("navigations.enableclub")) {
      q = `${q}${first ? "" : "&"}navigations.enableclub=true`;
      first = false;
    }

    if (!location.search.includes("navigations.enablenotification")) {
      q = `${q}${first ? "" : "&"}navigations.enablenotification=true`;
      first = false;
    }

    setQueryStringInURL(q, "notifications");
    return q;
  });

  const { data, isLoading, error, isError, refetch } = useQuery(
    `notifications[${ApiUrl}${handleQueryFormat(query)}]`,
    () => getNotifications(`${ApiUrl}${handleQueryFormat(query)}`, User.token),
    {
      staleTime: 60 * 1000,
      retry: 2,
      onError: (err) => {
        // console.log(err);
        if (err.status == 401) {
          updateUser({}, true);
          navigate("/"); // Redirect to home

        }
      },
      onSettled: (s, e) => {
        setPageLoading(false);
      },
    }
  );

  const handleFiltration = (query) => {
    setQuery(query);

    setQueryStringInURL(query, "notifications");
  };

  
  const handlePagination = (e) => {
    e.preventDefault();

    const updatedQueryString = GetPaginationValues(e.target, query);

    setQuery(updatedQueryString);
    setQueryStringInURL(updatedQueryString, "notifications");
  };

  return (
    <>
      <Helmet>
        <title>{t("notifications.notifications")}</title>
      </Helmet>

      {pageLoading ? (
        <LoadingComponent active={pageLoading} />
      ) : isError ? (
        <Error {...error} />
      ) : (
        <>
          <section className="">
            <div className="container">
              <div className="row justify-content-center g-4 pt-4">
                <div className="col-12 col-lg-8 position-relative">
                  <div className="h-100 bg-white p-3 shadow-sm rounded-2">
                    {isLoading ? (
                      <LoadingComponent bgClass="bg-white" active={isLoading} />
                    ) : (
                      <div className="">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h1 className="h2 mb-0">
                            {t("notifications.notifications")}...
                          </h1>

                          <div className="d-flex justify-content-center-align-items-center gap-2">
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#panel-modal"
                              className="p-0 px-2 btn btn-outline-dark"
                            >
                              <IconFilter size={15} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={refetch}
                            >
                              <IconRefresh size={15} />
                            </button>
                          </div>
                        </div>
                        <Pagination handlePagination={handlePagination} {...data} />

                        <div
                          className=""
                          style={{
                            maxHeight: "65vh",
                            overflowY: "auto",
                          }}
                        >
                          <NotificationList
                            notifications={data}
                            t={t}
                            isEnglish={i18n.language == "en"}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-lg-none text-primary px-5">
                  <hr />
                </div>

                <div className="col-12 col-lg-4">
                  <div className="rounded-1">
                    {User.token && (
                      <ProfileCard t={t} i18n={i18n} token={User.token} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <FiltrationPanel
        t={t}
        initialValues={queryStringToObject(
          query,
          __NotificationSpecificationsProperties
        )}
        NavigationProperties={
          __NotificationSpecificationsProperties.navigations
        }
        SearchProperties={__NotificationSpecificationsProperties.search}
        SortProperties={AvailableSearchPropertiesToSortWith}
        setSpecs={handleFiltration}
      />
    </>
  );
}
