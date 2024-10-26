import { useEffect } from "react";
import ApexCharts from "apexcharts";
import { IconRefreshDot } from "@tabler/icons-react";

export default function StatisticsCard({
  t,
  attends,
  total,
  percentage,
  grade,
  totalMarks,
  refetch
}) {
  useEffect(() => {
    var chart;
    if (percentage != null) {
      var breakup = {
        color: "#adb5bd",
        series: [percentage, 100 - percentage],
        labels: [t("misc.presence"), t("misc.absence")],
        chart: {
          width: 250,
          type: "donut",
          fontFamily: "Plus Jakarta Sans', sans-serif",
          foreColor: "#f00",
        },
        plotOptions: {
          pie: {
            startAngle: 0,
            endAngle: 360,
            donut: {
              size: "75%",
            },
          },
        },
        stroke: {
          show: false,
        },

        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },
        colors: ["var(--bs-primary)", "var(--bs-gray-200)"],

        responsive: [
          {
            breakpoint: 991,
            options: {
              chart: {
                width: 150,
              },
            },
          },
          {
            breakpoint: 768,
            options: {
              chart: {
                width: 180,
              },
            },
          },
          {
            breakpoint: 561,
            options: {
              chart: {
                width: 150,
              },
            },
          },
        ],
        tooltip: {
          theme: "dark",
          fillSeriesColor: false,
        },
      };

      chart = new ApexCharts(document.getElementById("chart"), breakup);
      chart?.render();
    }

    // Cleanup function
    return () => {
      chart?.destroy();
    };
  }, [percentage, t]);

  // console.log(percentage);
  return (
    <div className="card shadow-none h-100 position-relative ">
      <div className="position-absolute top-0 end-0 ">
        <button type="button" className="btn btn-transparent p-0 px-2 text-white" onClick={refetch}>
          <IconRefreshDot size={14} />
        </button>
      </div>
      <div
        className="card-header fw-bolder d-flex justify-content-center align-items-center fs-1rem text-light rounded-top-1 mt-0"
        style={{
          minHeight: "80px",
          "--mainColor": "var(--bs-pink)",
          "--secColor": "var(--bs-primary)",
        }}
      >
        {t("misc.Attendance Statistics")} ...
      </div>
      <div className="card-body py-4 px-3">
        {percentage == null ? (
          <div className="alert alert-warning bg-transparent">
            No Statistics Found
          </div>
        ) : (
          <>
            <div className="row align-items-center ">
              <div className="col-8 col-sm-6">
                <div className="border-end border-3">
                  <h4 className="fw-semibold mb-3 text-primary">
                    {percentage} %
                  </h4>
                  <div className="d-flex gap-2 flex-column">
                    <div className="d-flex align-items-center w-50">
                      <span className="round-8 bg-primary rounded-circle me-2 d-inline-block p-1"></span>
                      <span className="fs-3 text-muted">
                        {t("misc.presence")}:{" "}
                      </span>
                      <span className="text-dark fw-bolder fs-4 ms-2 ms-lg-auto">
                        {attends}
                      </span>
                    </div>
                    <div className="d-flex align-items-center w-50">
                      <span className="round-8 bg-light-primary rounded-circle me-2 d-inline-block p-1"></span>
                      <span className="fs-3 text-muted">
                        {t("misc.absence")}:{" "}
                      </span>
                      <span className="text-dark fw-bolder fs-4 ms-2 ms-lg-auto">
                        {total - attends}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4 col-sm-6">
                <div className="d-flex justify-content-center">
                  <div id="chart"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="card-footer bg-light bg-opacity-50 d-flex justify-content-around align-items-center pb-4 ">
        <span className="d-flex align-items-center gap-2">
          <p className="text-muted m-0">{t("misc.totalMarks")}:</p>
          <p className="fw-bolder text-dark m-0">{totalMarks ?? "N/A"}</p>
        </span>
        <span className="d-flex align-items-center gap-2">
          <p className="text-muted m-0">{t("misc.grade")}:</p>
          <p className="fw-bolder text-dark m-0">{grade ?? "N/A"}</p>
        </span>
      </div>
    </div>
  );
}
