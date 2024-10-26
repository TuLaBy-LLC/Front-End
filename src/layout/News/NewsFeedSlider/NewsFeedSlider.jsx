import { useRef } from "react";
import NewsHeader from "../../../components/News/NewsHeader/NewsHeader";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function NewsFeedSlider({
  i18n,
  t,
  news: { items },
  headerMessage,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Define the settings for the KeenSlider
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 4, // Default number of slides to show
      spacing: 10, // Spacing between slides
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      "(max-width: 1200px)": {
        slides: { perView: 4, spacing: 10 }, // For screens 1200px and below
      },
      "(max-width: 992px)": {
        slides: { perView: 3, spacing: 10 }, // For screens 992px and below
      },
      "(max-width: 768px)": {
        slides: { perView: 2, spacing: 10 }, // For screens 768px and below
      },
      "(max-width: 576px)": {
        slides: { perView: 1, spacing: 10 }, // For screens 576px and below
      },
    },
  });

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
              onClick={() => instanceRef.current?.prev()}
            >
              <IconArrowNarrowLeft size={16} />
            </button>
            <button
              className="btn btn-outline-primary slide-next"
              onClick={() => instanceRef.current?.next()}
            >
              <IconArrowNarrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Slider with ref */}
        <div ref={sliderRef} className="keen-slider py-2 bg-light">
          {items.map((news) => (
            <div key={news.id} className="keen-slider__slide px-1">
              <NewsHeader t={t} i18n={i18n} {...news} />
            </div>
          ))}
        </div>       
      </div>
    </>
  );
}
