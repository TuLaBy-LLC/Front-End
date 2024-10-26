import React, { useState } from "react";
import { useQuery } from "react-query";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import LoadingComponent from "../../loading/Loading";
import NewsHeader from "../NewsHeader/NewsHeader";
import { Link } from "react-router-dom";
import { getAllNewsAPI } from "../../../layout/News/News";
import Apis from "./../../../Api.json";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

const ApiUrl_Public = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.news.getAllNewsPublic
}`;

function NewsSlider({ i18n, t }) {
  const { data, isLoading, isError } = useQuery(
    "publicNews",
    () => getAllNewsAPI(ApiUrl_Public),
    {
      staleTime: 60 * 60 * 1000, // 60 minutes
    }
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1, // Show 1 slide at a time
      spacing: 5, // Adjust spacing between slides
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      "(max-width: 1200px)": {
        slides: { perView: 3, spacing: 10 }, // Show 3 slides on large tablets/small desktops
      },
      "(max-width: 992px)": {
        slides: { perView: 2, spacing: 10 }, // Show 2 slides on tablets
      },
      "(max-width: 768px)": {
        slides: { perView: 1, spacing: 10 }, // Show 1 slide on small tablets
      },
    },
  });

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="news-slider pb-5 pt-4 px-4">
          <Link to={`/news`} className="h5 mb-3 d-block">
            {t("news.news")}...
          </Link>

          {/* Slider */}
          <div ref={sliderRef} className="keen-slider">
            {data?.items.map((news) => (
              <div key={news.id} className="keen-slider__slide">
                <NewsHeader t={t} i18n={i18n} {...news} />
              </div>
            ))}
          </div>

          {/* Custom Navigation */}
          {loaded && instanceRef.current && (
            <div className="navigation-wrapper mt-3 d-flex justify-content-center gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => instanceRef.current?.prev()}
                disabled={currentSlide === 0}
              >
                <IconArrowNarrowLeft size={16} />
              </button>

              <button
                className="btn btn-outline-primary"
                onClick={() => instanceRef.current?.next()}
                disabled={
                  currentSlide ===
                  instanceRef.current.track.details.slides.length - 1
                }
              >
                <IconArrowNarrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default NewsSlider;
