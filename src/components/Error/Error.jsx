import { useTranslation } from "react-i18next";

export default function Error({
  statusCode = 400,
  message = "Bad Request",
  messageAR,
  details = null,
  errors = {},
  t,
  i18n
}) {
  const errorList = Object.keys(errors).flatMap((key) => errors[key]);
console.log(i18n);

  return (
    <>
      {errorList.length === 0 ? (
        <div className="alert alert-danger bg-transparent">{message=="Bad Request"? t("errors.apiError"):(i18n.language == "en"? message : messageAR)}</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {errorList.map((error, index) => (
            <div
              key={index}
              className="d-flex align-items-center gap-2 alert alert-danger bg-transparent"
            >
              <span className="p-1 bg-danger rounded-circle"></span>
              {error}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function Warn({ message }) {
  return <div className="alert alert-info bg-transparent">{message}</div>;
}
