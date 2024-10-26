import React from "react";
import Countdown from "react-countdown";

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed,t }) => {
  if (completed) {
    // Render a complete state
    return <span>{t("misc.liveNow")}</span>;
  } else {
    // Render a countdown
    return (
      <>
        <div className="count-down d-flex align-items-center justify-content-center gap-2">
          <div className="py-2 px-2 bg-white rounded-1 shadow-sm" title="Days">
            {days}
            <span className="tooltip">{t("misc.Days")}</span>
          </div>
          <span className="text-primary fw-bolder fs-5">:</span>
          <div className="py-2 px-2 bg-white rounded-1 shadow-sm" title="Hours">
            {hours}
            <span className="tooltip">{t("misc.Hours")}</span>
          </div>
          <span className="text-primary fw-bolder fs-5">:</span>
          <div
            className="py-2 px-2 bg-white rounded-1 shadow-sm"
            title="Minutes"
          >
            {minutes} <span className="tooltip">{t("misc.Minutes")}</span>
          </div>
          <span className="text-primary fw-bolder fs-5">:</span>
          <div
            className="py-2 px-2 bg-white rounded-1 fw-bolder shadow-sm"
            title="Seconds"
          >
            {seconds}
            <span className="tooltip">{t("misc.Seconds")}</span>
          </div>
        </div>
      </>
    );
  }
};

export default function CountDownTimer({ date, t }) {
  return <Countdown date={new Date(date)} renderer={d=>renderer({...d,t})} />;
}
