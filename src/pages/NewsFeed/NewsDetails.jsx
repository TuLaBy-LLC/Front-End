import { Helmet } from "react-helmet";
import Apis from "./../../Api.json";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/loading/Loading";
import { convertDateTime } from "../../Helpers/Methods";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import UserContext from "../../contexts/UserContextProvider";
import NewsSlider from "../../components/News/NewsSlider/NewsSlider";
import Error from "../../components/Error/Error";
import {
  IconBellRinging,
  IconEye,
  IconPencil,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled
} from "@tabler/icons-react";

import SliderWithThumbnail from "../../components/SliderWithThumbnail/SliderWithThumbnail";
import Toast_Default from "../../components/Toasts/Toasts";
import { invokeAsync } from "../../Services/api";

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${Apis.news.getNews
  }`;

const newsApiAction = (isLikesAction, id, isIncrement = true) => {
  let segment = Apis.news.action[isLikesAction ? "likes" : "views"];
  if (isLikesAction) segment = isIncrement ? segment.add : segment.remove;

  return `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${Apis.news.action.base
    }/${id}/${segment}`;
};


const handleNewsAction = async (
  newsId,
  token,
  setNews,
  isIncrement = true,
  isLikesAction = true
) => {
  // Retrieve localStorage data
  const localData = JSON.parse(window.localStorage.getItem("newsItems")) || [];

  // Find the index of the current news item in localStorage
  const currentNewsIndex = localData.findIndex(
    (news) => news.id === newsId && news.token === token
  );

  try {
    // Determine the API endpoint based on the action (likes or views)
    const api = newsApiAction(isLikesAction, newsId, isIncrement);

    // Make the PUT request to the API with the token authorization
    const response = await invokeAsync("put", api, token);

    // Log the response for debugging
    // console.log(response);

    // Update the state with the new like or view count
    setNews((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        likes: prev.data.likes + (isLikesAction ? (isIncrement ? 1 : -1) : 0),
        views: prev.data.views + (!isLikesAction ? 1 : 0),
      },
      isLikedNewsBefore: isLikesAction
        ? isIncrement
          ? true
          : false
        : prev.isLikedNewsBefore,
      response: { ...response },
    }));

    // Update localStorage data
    if (currentNewsIndex !== -1) {
      // Update existing news item in localStorage
      localData[currentNewsIndex] = {
        ...localData[currentNewsIndex],
        likes: isLikesAction && isIncrement ? 1 : 0,
        views: !isLikesAction ? 1 : 0,
      };
    } else {
      // Add new entry for the news item in localStorage
      localData.push({
        id: newsId,
        token: token,
        likes: isLikesAction && isIncrement ? 1 : 0,
        views: !isLikesAction ? 1 : 0,
      });
    }

    // Save the updated localData back to localStorage
    window.localStorage.setItem("newsItems", JSON.stringify(localData));
  } catch (error) {
    // Handle error case and update the response part of the state
    setNews((prev) => ({
      ...prev,
      response: error.response
        ? { ...error.response.data }
        : { message: "An error occurred", messageAR: "حدث خطأ" },
    }));
  }
};

export default function NewsDetails() {
  const { t, i18n } = useTranslation();
  const { User } = useContext(UserContext);
  const { id } = useParams();
  const [news, setNews] = useState({
    data: {},
    isLoading: true,
    error: null,
    isLikedNewsBefore: false,
    response: {
      statusCode: null,
      message: "",
      messageAR: "",
    },
  });
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    setIsLoadingNews(true);

    invokeAsync("get", `${ApiUrl}/${id}`)
      .then((res) => {

        // Retrieve localStorage data
        const localData =
          JSON.parse(window.localStorage.getItem("newsItems")) || [];

        // Find the index of the current news item in localStorage
        const currentNewsIndex = localData.findIndex(
          (news) => news.id === id && news.token === User.token
        );

        if (currentNewsIndex == -1) {
          const newNewsAction = {
            id,
            token: User.token,

            likes: 0,
            views: 1,
          };
          localData.push(newNewsAction);
          window.localStorage.setItem("newsItems", JSON.stringify(localData));
          // console.log("send View Update");

          handleNewsAction(id, User.token, setNews, null, false);
        }
        setNews((prev) => ({
          ...prev,
          data: res,
          isLikedNewsBefore:
            currentNewsIndex == -1
              ? false
              : localData[currentNewsIndex].likes == 1,
          isLoading: false,
        }));
        setIsLoadingNews(false);
      })
      .catch((err) => {
        setNews((prev) => ({
          ...prev,
          isLoading: false,
          error: err,
        }));
        setIsLoadingNews(false);
      });
  }, [id]);

  // console.log(news);

  return (
    <>
      <Helmet>
        <title>
          {(news.data == null && t("news.news")) ||
            (i18n.language == "en" ? news.data.title : news.data.titleAR)}
        </title>
        <link rel="icon" href="../../assets/icons/news.svg" />
      </Helmet>

      {news.response.statusCode && (
        <Toast_Default
          statusIsSuccess={news.response.statusCode < 400}
          message={
            i18n.language == "en"
              ? news.response.message
              : news.response.messageAR
          }
          time={4000}
        />
      )}

      {news.response.statusCode && news.isLikedNewsBefore == true && (
        <Toast_Default
          statusIsSuccess={news.response.statusCode < 400}
          message={
            i18n.language == "en"
              ? news.response.message
              : news.response.messageAR
          }
          time={4000}
        />
      )}

      {news.response.statusCode && news.isLikedNewsBefore == false && (
        <Toast_Default
          statusIsSuccess={news.response.statusCode < 400}
          message={
            i18n.language == "en"
              ? news.response.message
              : news.response.messageAR
          }
          time={4000}
        />
      )}
      {news.isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="news-details row px-3 justify-content-center mt-4">

          <div className="col-lg-8">
            <div
              className="bg-white shadow-sm rounded-4 p-4 p-lg-5 position-relative overflow-hidden"
              style={{ minHeight: "100vh" }}
            >
              {news.data?.isBreakingNews && (
                <div
                  className="position-absolute top-0 start-0 px-4 py-2 bg-danger text-white fw-bold d-flex align-items-center gap-2 rounded-end-4 shadow-sm"
                  style={{ zIndex: 10 }}
                >
                  <IconBellRinging size={18} />
                  {t("news.isBreaking")}
                </div>
              )}

              {news.error != null ? (
                <Error {...news.error} t={t} i18n={i18n} />
              ) : isLoadingNews ? (
                <LoadingComponent />
              ) : (
                <>
                  {/* Hero Section */}
                  <div className="row g-4 align-items-start">

                    {/* Cover Image */}
                    <div className="col-lg-6">
                      <div className="overflow-hidden rounded-4 shadow-sm border">
                        <img
                          src={news.data?.coverImage}
                          className="img-fluid w-100"
                          style={{
                            maxHeight: "450px",
                            objectFit: "cover"
                          }}
                          alt={`${news.data?.title} Image Cover`}
                        />
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="col-lg-6">

                      <div className="d-flex flex-column gap-4">

                        {/* Author */}
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
                          <span className="text-muted fw-semibold">
                            {t("news.wroteBy")}
                          </span>

                          <Link
                            to={`/news?search.publisherId=${news.data?.publisherId}`}
                            className="text-decoration-none fw-bold d-flex align-items-center gap-2"
                            title="Show Articles By This Author"
                          >
                            <IconPencil size={18} />
                            {
                              i18n.language === "en"
                                ? news.data?.publisher.name
                                : news.data?.publisher.nameAR
                            }
                          </Link>
                        </div>

                        {/* Tags */}
                        <div className="border-bottom pb-3">
                          <div className="text-muted fw-semibold mb-2">
                            {t("news.tags")}
                          </div>

                          <div className="d-flex flex-wrap gap-2">

                            {news.data?.tags
                              ?.split(" ")
                              .map(tag => (
                                <Link
                                  key={tag}
                                  to={`/news?search.tags=${tag}`}
                                  className="badge bg-light text-primary border text-decoration-none px-3 py-2 rounded-pill"
                                  title={`Search for ${tag}`}
                                >
                                  #{tag}
                                </Link>
                              ))}
                          </div>
                        </div>

                        {/* Publication Date */}
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
                          <span className="text-muted fw-semibold">
                            {t("news.date")}
                          </span>

                          <span className="fw-bold text-danger">
                            {convertDateTime(
                              news.data?.publicationDate
                            )}
                          </span>
                        </div>

                        {/* Statistics */}
                        <div className="row g-3">

                          {/* Likes */}
                          <div className="col-6">
                            <div className="border rounded-4 p-3 text-center bg-light-subtle">

                              <div className="text-muted small mb-2">
                                {t("misc.likes")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center gap-2">

                                <span className="fw-bold fs-3">
                                  {news.data?.likes}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleNewsAction(
                                      id,
                                      User.token,
                                      setNews,
                                      !news.isLikedNewsBefore
                                    )
                                  }
                                  className={`btn p-0 border-0 ${news.isLikedNewsBefore
                                      ? "text-primary"
                                      : "text-muted"
                                    }`}
                                  title={
                                    news.isLikedNewsBefore
                                      ? "Unlike"
                                      : "Like"
                                  }
                                >
                                  {news.isLikedNewsBefore ? (
                                    <IconThumbUpFilled size={22} />
                                  ) : (
                                    <IconThumbUp size={22} />
                                  )}
                                </button>

                              </div>

                            </div>
                          </div>

                          {/* Views */}
                          <div className="col-6">
                            <div className="border rounded-4 p-3 text-center bg-light-subtle">

                              <div className="text-muted small mb-2">
                                {t("misc.views")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center gap-2">

                                <span className="fw-bold fs-3">
                                  {news.data?.views}
                                </span>

                                <IconEye
                                  size={22}
                                  className="text-primary"
                                />

                              </div>

                            </div>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Divider */}
                  <div className="my-5">
                    <hr className="border-primary opacity-25 border-2" />
                  </div>

                  {/* Article Content */}
                  <article>

                    <h1 className="display-6 fw-bold text-center mb-4 text-capitalize">
                      {
                        i18n.language === "en"
                          ? news.data?.title
                          : news.data?.titleAR
                      }
                    </h1>

                    <div
                      className="mx-auto mb-5"
                      style={{ maxWidth: "120px" }}
                    >
                      <hr className="border-primary border-3 rounded opacity-50" />
                    </div>

                    <div
                      className="post-body fs-5 lh-lg text-secondary"
                      style={{
                        whiteSpace: "pre-line"
                      }}
                    >
                      {
                        i18n.language === "en"
                          ? news.data?.content
                          : news.data?.contentAR
                      }
                    </div>

                  </article>

                  {/* Gallery */}
                  {news.data?.images.length > 0 && (
                    <div className="mt-5">
                      <SliderWithThumbnail
                        title={news.data?.title}
                        news={news.data}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-lg-4 mt-5 mt-lg-0 position-relative">
            <div className="row justify-content-center">
              {User?.token && (
                <div className="col-12 col-sm-9 col-md-6 col-lg-12 mt-4">
                  <ProfileCard t={t} i18n={i18n} {...User} />
                </div>
              )}

              <div
                className={`col-12 col-sm-9 col-md-6 col-lg-12 ${User?.code && " mt-4"
                  }`}
              >
                <div className="news-slider bg-white shadow-sm rounded-2">
                  <NewsSlider t={t} i18n={i18n} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
