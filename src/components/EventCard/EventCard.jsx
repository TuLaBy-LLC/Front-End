import { calculateDuration, convertDateTime } from "../../Helpers/Methods";
import CountDownTimer from "../CountDownTimer/CountDownTimer";

export default function EventCard({
  title,
  titleAR,
  startTime,
  place,
  endTime,
  description,
  descriptionAR,
  type = "lecture",
  professor,
  instructor,
  translate: { lang, t },
}) {
  const { name = "N/A", nameAR = "غير متاح" } =
    type == "lecture" ? professor : instructor;

  return (
    <div className="card text-center shadow-none h-100">
      <div
        className="card-header fw-bolder d-flex flex-column justify-content-center align-items-center fs-1rem text-light rounded-top-1 mt-0"
        style={{ minHeight: "80px" }}
        title={lang == "en" ? title : titleAR}
      >
        <span className="fw-normal me-2">{t(`misc.next ${type}`)}:</span>
        {lang == "en" ? title : titleAR}
      </div>
      <div className="card-body pb-3">
        <h5 className="card-title fw-normal fs-5">
          {`${t(
            `persons.${(type = "lecture" ? "professor" : "instructor")}`
          )} : `}
          <span className="fw-bold" title={lang == "en" ? name : nameAR}>
            {lang == "en" ? name : nameAR}
          </span>
        </h5>

        <p className="my-3">{convertDateTime(startTime)}</p>

        <div className=" d-flex justify-content-center align-items-center gap-3 fs-4">
          <p className="d-flex gap-2 mb-0 text-dark border-light-subtle border-end border-3 pe-3">
            <span> {t("misc.place") + ": "}</span>
            <span className="fw-bold">{place.name}</span>
          </p>
          <p className="mb-0 text-dark d-flex gap-2">
            <span> {t("misc.duration") + ": "}</span>{" "}
            <span className="fw-bold">
              {calculateDuration(startTime, endTime)}
            </span>
          </p>
        </div>
      </div>
      <div className="card-footer bg-light bg-opacity-50">
        <p className="fw-bold text-dark">{t("misc.Time Left")} ...</p>

        <CountDownTimer t={t} date={startTime} />
      </div>
    </div>
  );
}
