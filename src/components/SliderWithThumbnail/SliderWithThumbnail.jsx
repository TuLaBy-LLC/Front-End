import React, { useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function ThumbnailPlugin(mainRef) {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx) {
      slider.slides[idx].classList.add("active");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

export default function SliderWithThumbnail({ news, title }) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
    },
    autoplay: {
      delay: 3000,
      stopOnInteraction: true,
    },
  });

  const [thumbnailRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <div className="row justify-content-center">
      {/* Main Image Slider */}
      <div className="col-10 col-md-8 col-lg-6">
        <div
          ref={sliderRef}
          className="keen-slider images-slider mb-5"
          style={{ height: "300px" }}
        >
          {news?.images?.map(({ imageName }, index) => (
            <div key={index} className="keen-slider__slide">
              <img
                className={`img-fluid w-100`}
                src={imageName}
                alt={`image ${index + 1} of ${title}`}
              />
            </div>
          ))}
        </div>
        <div
          ref={thumbnailRef}
          className="keen-slider thumbnail-slider mt-5"
          style={{ height: "50px" }}
        >
          {news?.images?.map(({ imageName }, index) => (
            <div key={index} className="keen-slider__slide thumbnail-slide">
              <img
                className="img-fluid w-100"
                src={imageName}
                alt={`thumbnail ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
</div>
  );
}
