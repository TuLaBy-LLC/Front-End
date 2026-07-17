import {
  IconBook2,
  IconEye,
  IconSchool,
  IconCoins,
  IconCalendar,
  IconHash,
} from "@tabler/icons-react";

export default function InvoiceItems({
  items = [],
  onViewSubject,
  t,
  i18n,
}) {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white border-0 py-4">
        <div className="d-flex justify-content-between align-items-center">

          <div className="d-flex align-items-center">
            <IconBook2
              size={30}
              className="text-white me-3"
            />

            <div>
              <h4 className="fw-bold mb-0 text-white">
                {t("invoiceItems.title")}
              </h4>

              <small className="text-muted text-white">
                {t("invoiceItems.description")}
              </small>
            </div>
          </div>

          <span className="badge bg-primary rounded-pill fs-6 px-3 py-2">
            {items.length} {t("invoiceItems.subjectsCount")}
          </span>

        </div>
      </div>

      <div className="table-responsive">

        <table className="table align-middle table-hover mb-0">

          <thead className="table-light">

            <tr>

              <th style={{ width: 90 }} />

              <th>{t("invoiceItems.subject")}</th>

              <th className="text-center">
                {t("invoiceItems.credits")}
              </th>

              <th className="text-center">
                {t("invoiceItems.semester")}
              </th>

              <th className="text-center">
                {t("invoiceItems.price")}
              </th>

              <th style={{ width: 140 }} />

            </tr>

          </thead>

          <tbody>

            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-5 text-muted"
                >
                  <IconSchool
                    size={42}
                    className="mb-3"
                  />

                  <div>
                    {t("invoiceItems.noSubjects")}
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const subject = item.subjectOffer.subject;

                return (
                  <tr key={subject.code}>

                    {/* Image */}

                    <td>

                      <img
                        src={subject.coverImage}
                        alt={subject.title}
                        width={70}
                        height={70}
                        className="rounded shadow-sm border object-fit-cover"
                      />

                    </td>

                    {/* Subject */}

                    <td>

                      <div className="fw-bold fs-6">
                        {i18n.language.startsWith("ar")
                          ? subject.titleAR
                          : subject.title}
                      </div>

                      <div className="text-muted small mt-1">

                        <span className="me-2">
                          <IconHash
                            size={14}
                            className="me-1"
                          />

                          {subject.code}
                        </span>

                      </div>

                    </td>

                    {/* Credits */}

                    <td className="text-center">

                      <span className="badge bg-info-subtle text-info border">

                        <IconBook2
                          size={15}
                          className="me-1"
                        />

                        {subject.credits}

                      </span>

                    </td>

                    {/* Semester */}

                    <td className="text-center text-muted">

                      <IconCalendar
                        size={16}
                        className="me-1"
                      />

                      {subject.semester}

                    </td>

                    {/* Price */}

                    <td className="text-center">

                      <div className="fw-bold text-primary fs-5">

                        {Number(item.price).toLocaleString(
                          i18n.language,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}

                      </div>

                      <small className="text-muted">

                        <IconCoins
                          size={14}
                          className="me-1"
                        />

                        {t("common.egp")}

                      </small>

                    </td>

                    {/* Action */}

                    <td>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          onViewSubject(subject.code)
                        }
                      >

                        <IconEye
                          size={17}
                          className="me-1"
                        />

                        {t("invoiceItems.view")}

                      </button>

                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}