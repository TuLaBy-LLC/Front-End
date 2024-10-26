import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useContext, useEffect } from "react";
import UserContext from "../../contexts/UserContextProvider";
import { useState } from "react";
import NewsHeader from "../../components/News/NewsHeader/NewsHeader";
import Apis from "./../../Api.json";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingComponent from "../../components/loading/Loading";
import { Link, useLocation } from "react-router-dom";
import NewsFeedSlider from "../../layout/News/NewsFeedSlider/NewsFeedSlider";
import FiltrationPanel, {
  queryStringToObject,
} from "../../components/FiltrationPanel/FiltrationPanel";
import { IconFilter } from "@tabler/icons-react";

export const ApiUrl_Public = `${
  import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY
}${Apis.news.getAllNewsPublic}`;
const ApiUrl_Private = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.news.getAllNewsPrivate
}`;

const handleQueryFormat = (query) => {
  return query[0] == "?" ? query : `?${query}`;
};

export const getAllNewsAPI = async (url, t = null, token = "") => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log(data);
    return data;
  } catch (error) {
    throw { message: t != null ? t("errors.apiError") : "Not Available..!" };
  }
};

export default function NewsFeed() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const { User } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("latest");
  const [privateDataLoaded, setPrivateDataLoaded] = useState(false);
  const [query, setQuery] = useState(location.search);
  // console.log(query);

  const handelTabChange = (tabTitle) => {
    setActiveTab(tabTitle);
    if (tabTitle === "announcements" && !privateDataLoaded) {
      setPrivateDataLoaded(true);
    }
  };

  const {
    data: dtaPublic,
    isLoading: isLoadingPublic,
    error: errorPublic,
    isError: isErrorPublic,
  } = useQuery(
    `publicNews[${ApiUrl_Public}${handleQueryFormat(query)}]`,
    () => getAllNewsAPI(`${ApiUrl_Public}${handleQueryFormat(query)}`, t),
    {
      staleTime: 60 * 60 * 60,
      // onSuccess: (_) => {
      //   console.log(_);
      // },
    }
  );

  const {
    data: dtaPrivate,
    isLoading: isLoadingPrivate,
    error: errorPrivate,
    isError: isErrorPrivate,
  } = useQuery(
    `PrivateNews[${ApiUrl_Private}${handleQueryFormat(query)}]`,
    () =>
      getAllNewsAPI(
        `${ApiUrl_Private}${handleQueryFormat(query)}`,
        t,
        User?.token
      ),
    {
      staleTime: 60 * 60,
      enabled: privateDataLoaded, // Only fetch private data if privateDataLoaded is true
    }
  );

  const handleFiltration = (query) => {
    setQuery(query);
    // Edit the browser URL when the data is fetched successfully
    const newUrl = `/news?${query}`;
    window.history.replaceState(null, null, newUrl); // Updates the URL without navigating
  };

useEffect(() => {
  setQuery(location.search)
  
}, [location])

  return (
    <>
      <Helmet>
        <title>News</title>
        <link rel="icon" href="../../assets/icons/news.svg" />
      </Helmet>

      {isLoadingPublic || (isLoadingPrivate && privateDataLoaded) ? (
        <LoadingComponent />
      ) : (
        <>
          {/* Intro News Tabs Area */}
          <div className="intro-news-tab p-3 pb-0 bg-white shadow-sm rounded-2">
            {/* Intro News Filter */}
            <div className="intro-news-filter d-flex justify-content-between align-items-center px-2">
              <Link className="fs-1rem" to={`/news?type=${activeTab}`}>
                {t("news.header.all")}
              </Link>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="nav nav-tabs d-flex justify-content-end border-end border-dark border-3"
                  id="nav-tab"
                  role="tablist"
                >
                  <button
                    type="button"
                    className={`nav-item nav-link mw-fit-content p-2 py-1 ${
                      activeTab === "latest" && "active"
                    }`}
                    id="latest"
                    title={t("news.header.Latest")}
                    data-toggle="tab"
                    role="tab"
                    aria-controls="latest-news"
                    aria-selected="true"
                    onClick={() => handelTabChange("latest")}
                  >
                    <p className="text-ellipsis mb-0">
                      {t("news.header.Latest")}
                    </p>
                  </button>

                  {User.token && (
                    <button
                      type="button"
                      className={`nav-item nav-link mw-fit-content p-2 py-1 overflow-hidden ${
                        activeTab === "announcements" && "active"
                      }`}
                      id="announcements"
                      title={t("news.header.Announcements")}
                      data-toggle="tab"
                      role="tab"
                      aria-controls="announcements-news"
                      aria-selected="false"
                      onClick={() => handelTabChange("announcements")}
                    >
                      <p className="text-ellipsis mb-0">
                        {t("news.header.Announcements")}
                      </p>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#panel-modal"
                  className="p-0 px-2 btn btn-outline-dark"
                >
                  <IconFilter size={15} />
                </button>
              </div>
            </div>
            <div className="tab-content py-3 px-2" id="nav-tabContent">
              <div
                className={`tab-pane fade ${
                  activeTab === "latest" && "show active"
                }`}
                id="latest-news"
                role="tabpanel"
                aria-labelledby="latest"
              >
                {isErrorPublic ? (
                  <div className="alert alert-danger bg-transparent">
                    {errorPublic.message}
                  </div>
                ) : dtaPublic == null || dtaPublic?.items.length == 0 ? (
                  <div className="alert alert-danger bg-transparent">
                    {t("news.0")}
                  </div>
                ) : (
                  <>
                    <div className="row g-4 mb-5 px-4 px-md-0">
                      {dtaPublic.items.slice(0, 2).map((x) => (
                        <div key={x.id} className="col-12 col-md-6">
                          <NewsHeader t={t} i18n={i18n} {...x} />
                        </div>
                      ))}
                    </div>

                    <NewsFeedSlider
                      headerMessage={"Latest News..."}
                      i18n={i18n}
                      t={t}
                      news={dtaPublic}
                    />
                  </>
                )}
              </div>

              {User.token && (
                <div
                  className={`tab-pane fade ${
                    activeTab === "announcements" && "show active"
                  }`}
                  id="announcements-news"
                  role="tabpanel"
                  aria-labelledby="announcements"
                >
                  {isErrorPrivate ? (
                    <div className="alert alert-danger bg-transparent">
                      {errorPrivate.message}
                    </div>
                  ) : !dtaPrivate || dtaPrivate?.items.length == 0 ? (
                    <div className="alert alert-danger bg-transparent">
                      {t("news.0")}
                    </div>
                  ) : (
                    <>
                      <div className="row g-4 mb-5 px-4 px-md-0">
                        {dtaPrivate?.items.slice(0, 2).map((x) => (
                          <div key={x.id} className="col-12 col-md-6">
                            <NewsHeader t={t} i18n={i18n} {...x} />
                          </div>
                        ))}
                      </div>

                      <NewsFeedSlider
                        news={dtaPrivate}
                        headerMessage={"Announcements News..."}
                        i18n={i18n}
                        t={t}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <FiltrationPanel
            t={t}
            initialValues={queryStringToObject(query)}
            setSpecs={handleFiltration}
          />
        </>
      )}
    </>
  );
}
