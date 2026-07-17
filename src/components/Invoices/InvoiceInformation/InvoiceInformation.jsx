import {
  IconHash,
  IconFlag,
  IconBooks,
  IconCash,
  IconCalendarEvent,
  IconCreditCard,
  IconClock,
  IconFileInvoice,
} from "@tabler/icons-react";

export default function InvoiceInformation({ invoice, t, i18n }) {
  const statusMap = {
    pending: {
      text: t("common.pending"),
      badge: "bg-warning text-dark",
    },
    paid: {
      text: t("common.paid"),
      badge: "bg-primary",
    },
    cancelled: {
      text: t("common.cancelled"),
      badge: "bg-danger",
    },
  };

  const status = statusMap[invoice.status.toLowerCase() ] ?? {
    text: t("common.unknown"),
    badge: "bg-secondary",
  };

 
const formatDate = (date) =>
  new Intl.DateTimeFormat(i18n.language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-transparent border-0 pt-4 px-4">
        <h4 className="text-white fw-bold mb-0 d-flex align-items-center">
          <IconFileInvoice
            size={26}
              className="me-2"
            />

            {t("invoiceInformation.title")}
          </h4>
        </div>

        <div className="card-body">

          <div className="row">
            <div className="col-sm-5 border-end">
              <h6 className="mb-0 d-flex align-items-center">
                <IconHash
                  size={18}
                  className="text-primary me-2"
                />
                {t("invoiceInformation.invoiceId")}
              </h6>
            </div>

            <div className="col-sm-7 fw-semibold">
              #{invoice.id}
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-sm-5 border-end">
              <h6 className="mb-0 d-flex align-items-center">
                <IconFlag
                  size={18}
                  className="text-primary me-2"
                />
                {t("invoiceInformation.status")}
              </h6>
            </div>

            <div className="col-sm-7">
              <span className={`badge ${status.badge} px-3 py-2`}>
                {status.text}
              </span>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-sm-5 border-end">
              <h6 className="mb-0 d-flex align-items-center">
                <IconBooks
                  size={18}
                  className="text-primary me-2"
                />
                {t("invoiceInformation.subjects")}
              </h6>
            </div>

            <div className="col-sm-7">
              {invoice.items.length} {t("invoiceInformation.subjectsCount")}
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-sm-5 border-end">
              <h6 className="mb-0 d-flex align-items-center">
                <IconCash
                  size={18}
                  className="text-primary me-2"
                />
                {t("invoiceInformation.totalAmount")}
              </h6>
            </div>

            <div className="col-sm-7 text-primary fw-bold fs-5">
              {invoice.totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}{" "}
            {t("common.egp")}
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-sm-5 border-end">
            <h6 className="mb-0 d-flex align-items-center">
              <IconCalendarEvent
                size={18}
                className="text-primary me-2"
              />
              {t("invoiceInformation.createdAt")}
            </h6>
          </div>

          <div className="col-sm-7 text-muted">
            {formatDate(invoice.createdAt)}
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-sm-5 border-end">
            <h6 className="mb-0 d-flex align-items-center">
              <IconCreditCard
                size={18}
                className="text-primary me-2"
              />
              {t("invoiceInformation.paidAt")}
            </h6>
          </div>

          <div className="col-sm-7 text-muted">
            {invoice.paidAt ? (
              formatDate(invoice.paidAt)
            ) : (
              <span className="text-warning d-flex align-items-center">
                <IconClock size={18} className="me-2" />
                {t("invoiceInformation.waitingForPayment")}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}