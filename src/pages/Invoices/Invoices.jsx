import { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IconChevronDown,
  IconChevronUp,
  IconFileInvoice,
  IconFilter,
} from "@tabler/icons-react";

import UserContext from "../../contexts/UserContextProvider";
import { invokeAsync } from "../../Services/api";
import Apis from "../../Api.json";

import InvoiceInformation from "../../components/Invoices/InvoiceInformation/InvoiceInformation";
import PaymentSummary from "../../components/Invoices/InvoiceSummary/InvoiceSummary";
import InvoiceItems from "../../components/Invoices/InvoiceItems/InvoiceItems";
import Toast_Default from "../../components/Toasts/Toasts";

const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY;

const InvoicesApi = `${BASE_URL}${Apis.invoices.all}`;
const CheckoutApi = `${BASE_URL}${Apis.invoices.checkout}`;
const ReceiptApi = `${BASE_URL}${Apis.invoices.receipt}`;

export default function Invoices({ success }) {

  const { User } = useContext(UserContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!User?.token) return;

    const loadInvoices = async () => {
      try {
        setLoading(true);

        const response = await invokeAsync(
          "get",
          InvoicesApi,
          User.token
        );

        const data = response.data ?? response;
        const list = data.items ?? [];

        setInvoices(list);

        if (list.length) {
          setExpandedInvoice(list[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [User?.token]);

  const filteredInvoices = useMemo(() => {
    switch (filter) {
      case "pending":
        return invoices.filter((x) => x.status.toLowerCase() === "pending");

      case "paid":
        return invoices.filter((x) => x.status.toLowerCase() === "paid");

      case "cancelled":
        return invoices.filter((x) => x.status.toLowerCase() === "cancelled");

      default:
        return invoices;
    }
  }, [filter, invoices]);

  const toggleInvoice = (id) => {
    setExpandedInvoice((prev) =>
      prev === id ? null : id
    );
  };

  const printInvoice = async (invoiceId) => {
    try {
      const response = await fetch(
        `${ReceiptApi}/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${User.token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error();

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(
        () => URL.revokeObjectURL(url),
        5000
      );
    } catch {
      alert(
        t("invoices.failedToRetrieveReceipt")
      );
    }
  };

  const viewSubject = (code) => {
    navigate(`/attendance/Lecture/${code}`);
  };

  const goBack = () => navigate(-1);

  const statusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success";

      case "pending":
        return "bg-warning text-dark";

      case "cancelled":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  const statusText = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return t("common.paid");

      case "pending":
        return t("common.pending");

      case "cancelled":
        return t("common.cancelled");

      default:
        return t("common.unknown");
    }
  };


  const payWithStripe = async (invoiceId) => {
    try {
      const response = await invokeAsync(
        "post",
        `${CheckoutApi}/${invoiceId}`,
        User.token
      );

      const checkout = response.data ?? response;

      if (!checkout.checkoutUrl)
        throw new Error();

      window.location.href =
        checkout.checkoutUrl;
    } catch (error) {
      console.error(error);
      alert(t("invoices.unableToCreateCheckout"));
    }
  };
  return (
    <>
      <Helmet>
        <title>
          {t("invoices.title")}
        </title>
      </Helmet>

      {success != null &&
        (success.isSuccess ?
          <Toast_Default message={t("common.successfullyPaid")} />
          :
          <Toast_Default message={t("common.failedToPaid")} />
        )
      }

      <div className="container py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h2 className="fw-bold d-flex align-items-center mb-0">

            <IconFileInvoice
              size={34}
              className="text-primary me-2"
            />

            {t("invoices.myInvoices")}

          </h2>

        </div>

        {/* FILTER */}

        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body">

            <div className="d-flex align-items-center flex-wrap gap-2">

              <IconFilter size={22} />

              <button
                className={`btn ${filter === "all"
                    ? "btn-primary"
                    : "btn-outline-primary"
                  }`}
                onClick={() =>
                  setFilter("all")
                }
              >
                {t("common.all")} (
                {invoices.length})
              </button>

              <button
                className={`btn ${filter === "pending"
                    ? "btn-warning"
                    : "btn-outline-warning"
                  }`}
                onClick={() =>
                  setFilter("pending")
                }
              >
                {t(
                  "common.pending"
                )} (
                {
                  invoices.filter(
                    (x) => x.status.toLowerCase() === "pending"
                  ).length
                }
                )
              </button>

              <button
                className={`btn ${filter === "paid"
                    ? "btn-success"
                    : "btn-outline-success"
                  }`}
                onClick={() =>
                  setFilter("paid")
                }
              >
                {t("common.paid")} (
                {
                  invoices.filter(
                    (x) => x.status.toLowerCase() === "paid"
                  ).length
                }
                )
              </button>

              <button
                className={`btn ${filter === "cancelled"
                    ? "btn-danger"
                    : "btn-outline-danger"
                  }`}
                onClick={() =>
                  setFilter("cancelled")
                }
              >
                {t(
                  "common.cancelled"
                )} (
                {
                  invoices.filter(
                    (x) => x.status.toLowerCase() === "cancelled"
                  ).length
                }
                )
              </button>

            </div>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          filteredInvoices.length === 0 && (
            <div className="alert alert-info text-center">
              {t("invoices.noInvoices")}
            </div>
          )}

        {!loading &&
          filteredInvoices.map(
            (invoice) => (
              <div
                key={invoice.id}
                className="card shadow-sm border-0 mb-4"
              >
                <div
                  className="card-header bg-white"
                  role="button"
                  onClick={() =>
                    toggleInvoice(
                      invoice.id
                    )
                  }
                >
                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <h3 className="fw-bold text-white mb-1">
                        #
                        {invoice.id}
                      </h3>

                      <small className="text-white">
                        {new Intl.DateTimeFormat(
                          i18n.language,
                          {
                            dateStyle:
                              "medium",
                          }
                        ).format(
                          new Date(
                            invoice.createdAt
                          )
                        )}
                      </small>

                    </div>

                    <div className="d-flex align-items-center gap-3">

                      <span
                        className={`badge text-white ${statusBadge(
                          invoice.status
                        )}`}
                      >
                        {statusText(
                          invoice.status
                        )}
                      </span>

                      <strong className="text-white">
                        {Number(
                          invoice.totalAmount
                        ).toLocaleString(
                          i18n.language,
                          {
                            minimumFractionDigits: 2,
                          }
                        )}{" "}
                        {t(
                          "common.egp"
                        )}
                      </strong>

                      {expandedInvoice ===
                        invoice.id ? (
                        <IconChevronUp className="text-white" />
                      ) : (
                        <IconChevronDown className="text-white" />
                      )}

                    </div>

                  </div>
                </div>

                {expandedInvoice ===
                  invoice.id && (
                    <div className="card-body">

                      <div className="row g-4">

                        <div className="col-lg-6">
                          <InvoiceInformation
                            invoice={
                              invoice
                            }
                            t={t}
                            i18n={i18n}
                          />
                        </div>

                        <div className="col-lg-6">
                          <PaymentSummary
                            invoice={
                              invoice
                            }
                            t={t}
                            i18n={i18n}
                            onPay={
                              payWithStripe
                            }
                            onPrint={
                              printInvoice
                            }
                            onBack={
                              goBack
                            }
                          />
                        </div>

                        <div className="col-12">
                          <InvoiceItems
                            items={
                              invoice.items
                            }
                            t={t}
                            i18n={i18n}
                            onViewSubject={
                              viewSubject
                            }
                          />
                        </div>

                      </div>

                    </div>
                  )}
              </div>
            )
          )}
      </div>
    </>
  );
}