import { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import axios from "axios";
import Apis from "./../../Api.json";
import { getPosition, isPersonInPosition } from "../../Helpers/positions";

const ApiUrl_Lecture = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.recordLectureAttend
}`;
const ApiUrl_Session = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.recordSessionAttend
}`;

export default function CaptureAttendanceModal({
  type = "lecture",
  subjectCode,
  eventCode,
  token,
  lang,
  t,
  place,
}) {
  const [result, setResult] = useState("");
  const [positionStatus, setPositionStatus] = useState(false);
  const [scanNow, setScanNow] = useState(false);
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      setScanNow(false);
    },
    paused: !scanNow,
  });

  useEffect(() => {
    if (place != null) {
      isPersonInPosition(place).then((res) => {
        // console.log(res);
        setPositionStatus(true);
      });
    }
  }, [place]);

  const [response, setResponse] = useState({
    status: false,
    message: null,
    messageAR: null,
    statusCode: null,
  });

  const handleSubmit = async () => {
    setScanNow(false);
    if (result === "" || result === null) return;

    const url = type === "lecture" ? ApiUrl_Lecture : ApiUrl_Session;
    const { latitude, longitude } = await getPosition();
    // console.log({ latitude, longitude });

    await axios
      .post(
        `${url}`,
        {
          eventCode,
          subjectCode,
          otp: result,
          position: { latitude, longitude },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(({ data }) => {
        setResponse({ status: true, ...data });
      })
      .catch(({ response: { data } }) => {
        setResponse({
          status: true,
          ...data,
        });
      });
  };

  const handleInputChange = (e) => {
    setResult(e.target.value);
  };
  // console.log(response);

  return (
    <>
      <div
        className="modal fade"
        id="cature-attendance"
        aria-hidden="true"
        aria-labelledby="cature-attendanceLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="cature-attendanceLabel">
                {t("captureAttendance.title")} {/* Translate this title */}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label={t("misc.close")} // Use translation for close button
                onClick={() => setScanNow(false)}
              />
            </div>
            <div className="modal-body row align-items-center flex-column gap-3 p-0">
              <div className="col-8">
                <video
                  className={`w-100 rounded-2 ${!scanNow && "d-none"}`}
                  ref={ref}
                />
              </div>

              <div className="col-8 text-center">
                <button
                  type="button"
                  disabled={!positionStatus}
                  className="btn btn-dark"
                  onClick={() => setScanNow(true)}
                >
                  {t("captureAttendance.scanNow")}
                </button>
                {scanNow && (
                  <button
                    type="button"
                    className="btn ms-2 btn-outline-dark"
                    onClick={() => setScanNow(false)}
                  >
                    {t("captureAttendance.paused")}
                  </button>
                )}
                {!positionStatus && (
                  <p className="m-0 mt-3 text-danger">
                    {t("captureAttendance.notInPlace")}
                  </p>
                )}

                <p
                  className={`response mx-auto mb-0 mt-3
                    ${
                      response?.statusCode < 400
                        ? "text-success"
                        : "text-danger"
                    }`}
                >
                  {lang === "en" ? response.message : response.messageAR}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                disabled={result === "" && !positionStatus}
                onClick={handleSubmit}
              >
                {t("misc.ok")}
              </button>
              <button
                className="btn btn-outline-dark"
                data-bs-target="#code-modal"
                data-bs-toggle="modal"
                onClick={() => setScanNow(false)}
              >
                {t("captureAttendance.typeCode")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="code-modal"
        aria-hidden="true"
        aria-labelledby="cature-attendanceLabel2"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="cature-attendanceLabel2">
                {t("captureAttendance.typeCodeTitle")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label={t("misc.close")}
                onClick={() => setScanNow(false)}
              />
            </div>
            <div className="modal-body ">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="code-input"
                  disabled={!positionStatus}
                  placeholder={t("captureAttendance.enterCode")}
                  value={result}
                  onChange={handleInputChange}
                />
                <label htmlFor="code-input">
                  {t("captureAttendance.code")}
                </label>
                {!positionStatus && (
                  <p className="m-0 mt-3 text-danger">
                    {t("captureAttendance.notInPlace")}
                  </p>
                )}
              </div>

              <p
                className={`response mx-auto mb-0 mt-3
                  ${
                    response?.statusCode < 400 ? "text-success" : "text-danger"
                  }`}
              >
                {lang === "en" ? response.message : response.messageAR}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                disabled={!positionStatus && result === ""}
                onClick={handleSubmit}
              >
                {t("misc.ok")} {/* Translate OK button */}
              </button>
              <button
                className="btn btn-outline-dark"
                data-bs-target="#cature-attendance"
                data-bs-toggle="modal"
              >
                {t("captureAttendance.captureQRCode")}
                {/* Translate Capture QR-Code button */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
