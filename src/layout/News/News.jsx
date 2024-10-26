import { useState } from "react";
import NewsHeader from "../../components/News/NewsHeader/NewsHeader";
import Apis from "./../../Api.json";
import axios from "axios";
import { useQuery } from "react-query";
import LoadingComponent from "../../components/loading/Loading";
import { Link } from "react-router-dom";

export const ApiUrl_Public = `${
  import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY
}${Apis.news.getAllNewsPublic}?pagination.pageSize=2&Navigations.EnablePublisher=true`;
const ApiUrl_Private = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.news.getAllNewsPrivate
}?pagination.pageSize=2&Navigations.EnablePublisher=true`;

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

export default function News({ User, t, i18n }) {
  const [activeTab, setActiveTab] = useState("latest");
  const [privateDataLoaded, setPrivateDataLoaded] = useState(false);

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
  } = useQuery(`publicNews[${ApiUrl_Public}]`, () => getAllNewsAPI(ApiUrl_Public, t), {
    staleTime: 60 * 60 * 60,
  });

  // console.log(dtaPublic);

  const {
    data: dtaPrivate,
    isLoading: isLoadingPrivate,
    error: errorPrivate,
    isError: isErrorPrivate,
  } = useQuery(
    `PrivateNews[${ApiUrl_Public}]`,
    () => getAllNewsAPI(ApiUrl_Private, t, User?.token),
    {
      staleTime: 60 * 60,
      enabled: privateDataLoaded, // Only fetch private data if privateDataLoaded is true
    }
  );

  return (
    <>
      {isLoadingPublic || (isLoadingPrivate && privateDataLoaded) ? (
        <LoadingComponent />
      ) : (
        <>
          {/* Intro News Tabs Area */}
          <div className="intro-news-tab p-3 pb-0 bg-white shadow-sm rounded-2">
            {/* Intro News Filter */}
            <div className="intro-news-filter d-flex justify-content-between align-items-center px-2">
              <Link className="fs-4" to={`/news?type=${activeTab}`}>
                {t("news.header.all")}
              </Link>
              <nav className="w-75">
                <div
                  className="nav nav-tabs row row-cols-3 justify-content-end w-100"
                  id="nav-tab"
                  role="tablist"
                >
                  <button
                    type="button"
                    className={`nav-item nav-link mw-fit-content p-2 ${
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
                      className={`nav-item nav-link mw-fit-content p-2 overflow-hidden ${
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
              </nav>
            </div>
            <div
              className="tab-content pt-3 overflow-y-auto overflow-x-hidden px-2"
              style={{ maxHeight: "160vh" }}
              id="nav-tabContent"
            >
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
                ) : dtaPublic == null || dtaPublic?.length == 0 ? (
                  <div className="alert alert-danger bg-transparent">
                    {t("news.0")}
                  </div>
                ) : (
                  <>
                    <div className="row g-4 mb-5 px-0">
                      {dtaPublic.items.slice(0, 2).map((x) => (
                        <div key={x.id} className="col-12 col-md-6">
                          <NewsHeader t={t} i18n={i18n} {...x} />
                        </div>
                      ))}
                    </div>

                    {/* multiple-news */}
                    {/* <div className="row g-4">
                      {dtaPublic.items.slice(2).map((x) => (
                        <div key={x.id} className="col-12 col-sm-6 px-4">
                          <SingleNews {...x} />
                        </div>
                      ))}
                    </div> */}
                    {/* multiple-news */}
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
                  ) : !dtaPrivate || dtaPrivate?.length == 0 ? (
                    <div className="alert alert-danger bg-transparent">
                      {t("news.0")}
                    </div>
                  ) : (
                    <>
                      <div className="row g-4 mb-5 px-0">
                        {dtaPrivate?.items.slice(0, 2).map((x) => (
                          <div key={x.id} className="col-12 col-md-6">
                            <NewsHeader t={t} i18n={i18n} {...x} />
                          </div>
                        ))}
                      </div>

                      {/* multiple-news */}
                      {/* <div className="row g-4">
                        {dtaPrivate?.items.slice(2).map((x) => (
                          <div key={x.id} className="col-12 col-sm-6 px-4">
                            <SingleNews {...x} />
                          </div>
                        ))}
                      </div> */}
                      {/* multiple-news */}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* ##### Intro News Area End ##### */}
        </>
      )}
    </>
  );
}
