import React, { useMemo, useState } from "react";
import EventRelativeData from "./EventRelativeData/EventRelativeData";
import { Link, useNavigate } from "react-router-dom";

// Helper function to format date and time
const formatTime = (time) =>
  new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const formatDate = (time) =>
  new Date(time).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });

const ScheduleModal = React.memo(({ event, id, language }) => {
  // console.log(event);
  const [relativeDataIsLoading, setrelativeDataIsLoading] = useState(false);

  // Memoize the formatted time, date, and language-specific fields
  const formattedStartTime = useMemo(
    () => formatTime(event.startTime),
    [event.startTime]
  );
  const formattedEndTime = useMemo(
    () => formatTime(event.endTime),
    [event.endTime]
  );
  const formattedDate = useMemo(
    () => formatDate(event.startTime),
    [event.startTime]
  );
  const navigate = useNavigate();

  // Memoize the event title and description based on language
  const title = useMemo(
    () => (language === "en" ? event.title : event.titleAR),
    [language, event.title, event.titleAR]
  );
  const description = useMemo(
    () => (language === "en" ? event.description : event.descriptionAR),
    [language, event.description, event.descriptionAR]
  );

  const handleNavigate = (e) => {
    e.preventDefault();
    document.querySelector(`#modal-close-${id}`)?.click();
    navigate(
      `/attendance/${
        Object(event).hasOwnProperty("professorCode") ? "Lecture" : "Session"
      }/${event.subjectCode}`
    );
  };

  return (
    <div
      className="modal fade"
      id={id} // Modal ID
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content px-4 pt-3 position-relative">
          <div
            className={`position-absolute p-2 py-1 top-0 start-0 text-white ${
              event.activated ? "bg-success" : "bg-danger"
            }`}

            style={{borderBottomRightRadius:".375rem"}}
          >
            {event.activated ? "Activated" : "Not Activated"}
          </div>
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h3
              className="modal-title fs-5 text-muted text-start"
              id={`${id}Label`}
            >
              {title}
            </h3>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body pb-1">
            <div className="d-flex align-items-between align-items-center text-start mb-3 gap-3">
              <div
                className="bg-primary-subtle text-primary d-flex flex-column justify-content-center align-items-center rounded-circle"
                style={{ minWidth: "5rem", minHeight: "5rem" }}
              >
                <span className="fs-4 fw-semibold">
                  {formattedDate.split(" ")[0]}
                </span>
                <span className="text-uppercase">
                  {formattedDate.split(" ")[1]}
                </span>
              </div>

              <div className="ms-3">
                <span className="fw-bold">{title}</span>
                <br />
                <small className="text-muted">
                  {formattedStartTime} to {formattedEndTime}
                </small>
              </div>
            </div>
            <div className="text-primary px-5">
              <hr />
            </div>

            <div className="d-flex flex-column text-start gap-2">
              <div className="">
                <strong className="me-2">
                  {language === "en" ? "Description" : "الوصف"}:
                </strong>
                {description || "No description available"}
              </div>

              {relativeDataIsLoading != null && (
                <div className="">
                  <button
                    type="button"
                    onClick={(_) => setrelativeDataIsLoading(true)}
                    className="btn btn-primary w-100 mt-3"
                  >
                    {relativeDataIsLoading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      ></span>
                    ) : language == "en" ? (
                      "Show Relative Data"
                    ) : (
                      "أعرض البيانات المرتبطه"
                    )}
                  </button>
                </div>
              )}

              <EventRelativeData
                isLecture={Object(event).hasOwnProperty("professorCode")}
                language={language}
                setDataIsLoading={setrelativeDataIsLoading}
                loadData={relativeDataIsLoading}
                code={event.code}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              id={`modal-close-${id}`}
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {language === "en" ? "Close" : "إغلاق"}
            </button>
            <Link
              className="btn btn-primary"
              onClick={handleNavigate}
              to={`/attendance/${
                Object(event).hasOwnProperty("professorCode")
                  ? "Lecture"
                  : "Session"
              }/${event.subjectCode}`}
            >
              {language === "en" ? "Show" : "أعرض"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ScheduleModal;
