import React from "react";
import { format as formatDate, isFirstDayOfMonth } from "date-fns";
import { DATE_FORMAT } from "../../tools";
import { useAppState } from "../../states/AppState";
import { Day } from "./Day";
import "./Week.css";

export function Week({
  weekIndex,
  week,
  modalIsOpen,
  user,
  setNewPostDate,
  dayWithNewPost,
  handleAnimationRest,
}) {
  const [{ auth }] = useAppState();
  const isOwner = auth.uid === user.uid;

  return (
    <div key={weekIndex} className="Calendar_week">
      {week.map((day, dayIndex) => {
        const showMonth = shouldShowMonth(day.date, dayIndex, weekIndex);
        return (
          <Day
            modalIsOpen={modalIsOpen}
            user={user}
            key={dayIndex}
            showMonth={showMonth}
            day={day}
            isOwner={isOwner}
            onNewPost={() => setNewPostDate(day.date)}
            hasNewPost={dayWithNewPost === formatDate(day.date, DATE_FORMAT)}
            onAnimatedTextRest={handleAnimationRest}
          />
        );
      })}
    </div>
  );
}

function shouldShowMonth(date, day, week) {
  function isFirstPageOfCalendar(day, week) {
    return week + day === 0;
  }

  return isFirstPageOfCalendar(day, week) || isFirstDayOfMonth(date);
}
