import { convertDateTime } from "../../../Helpers/Methods";

export default function EventTableRecord({
  isLecture = true,
  lang,
  code = 688621,
  title = "N/A",
  titleAR = "غير متاح",
  startTime = "2024-04-25 10:53:00",
  lectureAttendances,
  sessionAttendances,
  professor = null,
  instructor = null,
}) {
  // console.log(lectureAttendances  );

  const { name = "N/A", nameAR = "غير متاح" } =
    (isLecture ? professor : instructor) || {};
  const { bonus = 0.0, isPresence = false } =
    (isLecture && lectureAttendances && lectureAttendances.length > 0
      ? lectureAttendances[0]
      : sessionAttendances && sessionAttendances.length > 0
      ? sessionAttendances[0]
      : {}) || {};

  return (
    <tr data-code={code}>
      <td className="border-bottom-0">
        <h6 className="fs-3 fw-semibold mb-0">{lang == "en" ? title : titleAR}</h6>
      </td>
      <td className="border-bottom-0">
        <h6 className="fw-semibold mb-0">
          <div className="checkbox-wrapper-19">
            <input
              type="checkbox"
              checked={isPresence}
              id="cbtest-19"
              readOnly
            />
            <label
              htmlFor="cbtest-19"
              className="check-box"
              aria-label={isPresence ? "Presence" : "Absence"}
            />
          </div>
        </h6>
      </td>
      <td className="border-bottom-0">
        <h6 className="fw-semibold mb-1">{bonus}</h6>
      </td>
      <td className="border-bottom-0">
        <h6 className="fw-semibold mb-1">{lang == "en" ? name : nameAR}</h6>
      </td>

      <td className="border-bottom-0">
        <h6 className="fw-semibold mb-1">{convertDateTime(startTime)}</h6>
      </td>
    </tr>
  );
}
