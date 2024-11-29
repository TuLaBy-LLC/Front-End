import { useTranslation } from "react-i18next";

export default function Error({
  statusCode = 400,
  message = "Bad Request",
  details = null,
  errors = {},
}) {
  const errorList = Object.keys(errors).flatMap((key) => errors[key]);
  const { t } = useTranslation();

  return (
    <>
      {errorList.length === 0 ? (
        <div className="alert alert-danger bg-transparent">{message=="Bad Request"? t("errors.apiError"):message}</div>
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
