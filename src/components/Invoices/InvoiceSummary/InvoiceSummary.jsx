import {
  IconArrowLeft,
  IconBrandStripe,
  IconCheck,
  IconClock,
  IconCreditCard,
  IconPrinter,
  IconReceipt2,
  IconX,
  IconInfoCircle,
  IconCalendarEvent,
  IconCash,
  IconWorld,
  IconReceipt,
} from "@tabler/icons-react";

export default function PaymentSummary({
  invoice,
  onPay,
  onPrint,
  onBack,
  t,
  i18n,
}) {
  const statusMap = {
    pending: {
      text: t("common.pending"),
      color: "warning",
      icon: <IconClock size={18} />,
    },
    paid: {
      text: t("common.paid"),
      color: "primary",
      icon: <IconCheck size={18} />,
    },
    cancelled: {
      text: t("common.cancelled"),
      color: "danger",
      icon: <IconX size={18} />,
    },
  };

  const status = statusMap[invoice.status.toLowerCase()] ?? {
    text: t("common.unknown"),
    color: "secondary",
    icon: <IconInfoCircle size={18} />,
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat(i18n.language, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  return (
    <div className="card shadow-sm border-0">

      <div className="card-header bg-white border-0 py-4">
        <div className="d-flex align-items-center">
          <IconReceipt2 size={30} className="text-white me-3" />
          <div>
            <h4 className="mb-0 fw-bold text-white">
              {t("paymentSummary.title")}
            </h4>

            <small className="text-muted text-white">
              {t("paymentSummary.description")}
            </small>
          </div>
        </div>
      </div>

      <div className="card-body">

        {/* Status Banner */}

        <div
          className={`alert alert-${status.color} d-flex align-items-center mb-4`}
        >
          {status.icon}

          <div className="ms-3">
            <div className="fw-bold">
              {status.text}
            </div>

            <small>
              {invoice.status === 1
                ? t("paymentSummary.statusPaid")
                : t("paymentSummary.statusPending")}
            </small>
          </div>
        </div>

        {/* Summary */}

        <div className="row g-3">

          <div className="col-md-6">

            <div className="border rounded-3 p-4">

              <div className="d-flex align-items-center">

                <IconCash
                  size={38}
                  className="text-success me-3"
                />

                <div>

                  <small className="text-muted">
                    {t("paymentSummary.invoiceTotal")}
                  </small>

                  <h3 className="fw-bold mb-0 text-primary">
                    {invoice.totalAmount.toLocaleString(
                      i18n.language,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </h3>

                  <small>
                    {t("common.egp")}
                  </small>

                </div>

              </div>

            </div>

          </div>

          <div className="col-md-6">

            <div className="border rounded-3 p-4">

              <div className="d-flex align-items-center">

                <IconCalendarEvent
                  size={38}
                  className="text-info me-3"
                />

                <div>

                  <small className="text-muted">
                    {t("paymentSummary.paymentDate")}
                  </small>

                  <div className="fw-semibold">

                    {invoice.paidAt
                      ? formatDate(invoice.paidAt)
                      : t("paymentSummary.notPaidYet")}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Details */}

        {invoice.status === 1 && (
          <div className="card bg-light border-0 mt-4">

            <div className="card-body">

              <h5 className="fw-bold mb-3">
                {t("paymentSummary.paymentDetails")}
              </h5>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <small className="text-muted">
                    {t("paymentSummary.paymentMethod")}
                  </small>

                  <div className="fw-semibold">
                    {invoice.paymentMethod ?? "-"}
                  </div>

                </div>

                <div className="col-md-6 mb-3">

                  <small className="text-muted">
                    {t("paymentSummary.gateway")}
                  </small>

                  <div className="fw-semibold">
                    {invoice.gateway ?? "-"}
                  </div>

                </div>

                {invoice.transactionId && (
                  <div className="col-12">

                    <small className="text-muted">
                      {t("paymentSummary.transactionId")}
                    </small>

                    <div
                      className="font-monospace text-break"
                    >
                      {invoice.transactionId}
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* Actions */}

        <div className="d-grid gap-2 mt-4">

          {invoice.status !== 1 && (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onPay(invoice.id)}
            >
              <IconBrandStripe
                size={22}
                className="me-2"
              />

              {t("paymentSummary.payWithStripe")}
            </button>
          )}

          <button
            className="btn btn-outline-secondary"
            onClick={() => onPrint(invoice.id)}
          >
            <IconPrinter
              size={20}
              className="me-2"
            />

            {t("paymentSummary.printInvoice")}
          </button>

          <button
            className="btn btn-light"
            onClick={onBack}
          >
            <IconArrowLeft
              size={20}
              className="me-2"
            />

            {t("common.back")}
          </button>

        </div>

      </div>

    </div>
  );
}