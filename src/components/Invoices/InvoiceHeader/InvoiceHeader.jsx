import React from "react";

export default function InvoceHeader({
  invoice,
  onPay,
  onPrint,
  onBack,
}) {
  const badgeClass = {
    Paid: "bg-primary",
    Pending: "bg-warning text-dark",
    Cancelled: "bg-danger",
  }[invoice.status] || "bg-secondary";

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US");

  return (
    <div className="row g-3">
      {/* Invoice Information */}
      <div className="col-md-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-flex justify-content-center align-items-center"
                    style={{ width: 70, height: 70 }}
                  >
                    <i className="ti ti-receipt-2 text-primary fs-4"></i>
                  </div>

                  <div>
                    <h3 className="fw-bold mb-1">
                      Invoice #{invoice.id}
                    </h3>

                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className={`badge ${badgeClass} px-3 py-2 fs-6`}>
                        {invoice.status}
                      </span>

                      <small className="text-muted">
                        <i className="ti ti-calendar me-1"></i>
                        Created At: {formatDate(invoice.createdAt)}
                      </small>

                      {invoice.paidAt ? (
                        <small className="text-primary">
                          <i className="ti ti-circle-check me-1"></i>
                          Paid At: {formatDate(invoice.paidAt)}
                        </small>
                      ) : (
                        <small className="text-warning">
                          <i className="ti ti-clock me-1"></i>
                          Waiting for payment
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="col-lg-4">
                <div className="text-lg-end mt-4 mt-lg-0">
                  <h6 className="text-muted mb-1">
                    Total Amount
                  </h6>

                  <h2 className="text-primary fw-bold mb-3">
                    {Number(invoice.totalAmount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    EGP
                  </h2>

                  <div className="d-flex justify-content-lg-end gap-2">
                    <button
                      className="btn btn-outline-secondary d-flex align-items-center"
                      onClick={() => onPrint(invoice.id)}
                    >
                      <i className="ti ti-printer me-1"></i>
                      Print
                    </button>

                    <button
                      className="btn btn-outline-dark d-flex align-items-center"
                      onClick={onBack}
                    >
                      <i className="ti ti-arrow-left me-1"></i>
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body">
            {invoice.status === "Paid" ? (
              <>
                <h6 className="fw-bold mb-3">
                  Payment Information
                </h6>

                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label text-muted">
                      Payment Method
                    </label>

                    <div>
                      {invoice.paymentMethod ? (
                        <span className="badge bg-info fs-6">
                          {invoice.paymentMethod}
                        </span>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>

                  <div className="col-6">
                    <label className="form-label text-muted">
                      Gateway
                    </label>

                    <div>
                      {invoice.gateway ? (
                        <span className="badge bg-secondary">
                          {invoice.gateway}
                        </span>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>

                  {invoice.transactionId && (
                    <div className="col-12">
                      <label className="form-label text-muted">
                        Transaction ID
                      </label>

                      <div className="fw-semibold text-break">
                        {invoice.transactionId}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="d-grid">
                <button
                  className="btn btn-primary"
                  onClick={() => onPay(invoice.id)}
                >
                  <i className="ti ti-brand-stripe me-2"></i>
                  Pay with Stripe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}