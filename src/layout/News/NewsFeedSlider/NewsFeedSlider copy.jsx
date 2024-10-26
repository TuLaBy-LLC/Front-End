import { useRef } from "react";
import Slider from "react-slick";
import NewsHeader from "../../../components/News/NewsHeader/NewsHeader";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

export default function NewsFeedSlider({
  i18n,
  t,
  news: { items },
  headerMessage,
}) {
  const sliderRef = useRef(null); // Create a ref for the slider

  const settings = {
    dots: false,
    arrows: false, // Hide default arrows since you're using custom ones
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Default number of slides to show
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200, // For screens 1200px and below
        settings: {
          slidesToShow: 4, // Show 4 slides on large tablets/small desktops
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992, // For screens 992px and below
        settings: {
          slidesToShow: 3, // Show 3 slides on tablets
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For screens 768px and below
        settings: {
          slidesToShow: 2, // Show 2 slides on small tablets/large mobile devices
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576, // For screens 576px and below
        settings: {
          slidesToShow: 1, // Show 1 slide on small mobile devices
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="text-primary mx-5 opacity-50">
        <hr />
      </div>

      <div className="news-slider-container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="m-0">{headerMessage}</h2>

          {/* Custom Prev and Next buttons */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-primary slide-prev"
              onClick={() => sliderRef.current.slickPrev()}
            >
              <IconArrowNarrowLeft size={16} />
            </button>
            <button
              className="btn btn-outline-primary slide-next"
              onClick={() => sliderRef.current.slickNext()}
            >
              <IconArrowNarrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Slider with ref */}
        <Slider ref={sliderRef} {...settings}>
          {items.map((news) => (
            <div key={news.id} className="px-1">
              <NewsHeader t={t} i18n={i18n} {...news} />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
