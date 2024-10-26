import React, { useMemo } from "react";
import ScheduleModal from "../ScheduleModal/ScheduleModal";
import { convertDate } from "../../Helpers/Methods";

// Function to compare dates without time (same day)
const SameDate = (currentDate, date) => {
  const current = new Date(currentDate).setHours(0, 0, 0, 0);
  const target = new Date(date).setHours(0, 0, 0, 0);
  return current - target;
};

// Function to compare dates with time (exact datetime)
const SameDateTime = (currentDate, date) => {
  return new Date(currentDate) - new Date(date);
};

// Helper to convert time strings to AM/PM format
const formatTimeTo12Hour = (time) => {
  const [hours, minutes] = time.split(":");
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Define day names in English and Arabic
const dayNames = {
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  ar: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ],
};

export default function Schedule({ schedule, i18n, t }) {

  // Generate array of 7 days starting from the schedule's start date
  const days = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(schedule.starting);
    dayDate.setDate(dayDate.getDate() + i);
    return {
      dayName: dayNames[i18n.language][dayDate.getDay()], // Get day name based on current language
      dayDate: dayDate.setHours(0, 0, 0, 0),
      events: [],
    };
  });

  // Predefined time slots for the schedule
  const timeSlots = [
    { start: "08:30", end: "10:00" },
    { start: "10:00", end: "11:30" },
    { start: "11:30", end: "13:00" },
    { start: "13:00", end: "14:30" },
    { start: "14:30", end: "16:00" },
    { start: "16:00", end: "17:30" },
    { start: "17:30", end: "19:00" },
    { start: "19:00", end: "20:30" },
    { start: "20:30", end: "22:00" },
  ];

  // Combine and sort events (lectures and sessions) by start time
  const allEvents = [...schedule.lectures, ...schedule.sessions].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  // Distribute events to the correct day based on their start time
  allEvents.forEach((event) => {
    days.forEach((day) => {
      if (SameDate(new Date(event.startTime), day.dayDate) === 0) {
        day.events.push(event);
      }
    });
  });

  // Renders each event into buttons inside the table
  const renderEvents = (events, key) => {
    // console.log(events);
    
    return events.map((event, index) => (
      <div
        key={index}
        className={
          events.length > 1 && index < events.length - 1
            ? "border-2 border-bottom border-secondary"
            : ""
        }
      >
        <button
          className={`link link-primary bg-transparent py-2 px-0 fs-3 fw-bolder text-center border-0 p-0 m-0 ${event.activated && "text-muted"}`}
          title={event.title}
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#${event.code}`} // Ensure the id matches the target modal
        >
          {i18n.language === "en" ? event.title : event.titleAR}
        </button>
        {/* Modal for displaying event details */}
        {useMemo(
          () => (
            <ScheduleModal
              event={event}
              id={`${event.code}`}
              language={i18n.language}
            />
          ),
          [event, i18n.language]
        )}
      </div>
    ));
  };

  // Handles filtering and rendering events for each day and timeslot
  const handleEvent = (timeSlot) => {
    return days.map((day, i) => {
      const startTimeSlot = new Date(day.dayDate).setHours(
        ...timeSlot.start.split(":").map(Number)
      );
      const endTimeSlot = new Date(day.dayDate).setHours(
        ...timeSlot.end.split(":").map(Number)
      );

      // Filter events that occur within the current timeslot
      const dayEvents = day.events.filter((event) => {
        const eventStart = new Date(event.startTime);
        return eventStart >= startTimeSlot && eventStart < endTimeSlot;
      });

      // Render N/A if no events, otherwise render the events
      if (dayEvents.length === 0) {
        return <td key={i}>N/A</td>;
      } else {
        return <td key={i}>{renderEvents(dayEvents, i)}</td>;
      }
    });
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped align-middle text-center">
        <thead>
          <tr>
            <th>{t("times.Time")}</th>
            {days.map((day, index) => (
              <th key={index}>
                <div className="d-flex flex-column gap-2">
                  <p className="m-0">{day.dayName}</p>
                  <p className="text-muted m-0 fs-2 text-nowrap">{convertDate(day.dayDate)}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {timeSlots.map((timeSlot, index) => (
            <tr key={index}>
              <th scope="row" className="fs-3">
                {`${formatTimeTo12Hour(timeSlot.start)} - ${formatTimeTo12Hour(
                  timeSlot.end
                )}`}
              </th>
              {handleEvent(timeSlot)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
