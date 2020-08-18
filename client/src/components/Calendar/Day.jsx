import React, { Fragment } from "react";
import { useLocation, Link } from "../../utils/react-router-next";
import { FaPlus } from "react-icons/fa";
import { format as formatDate, isToday, isFuture } from "date-fns";
import { DATE_FORMAT, translateMonths } from "../../tools";
import "./Day.css";

//Provides "boxes" with days
export function Day({ user, day, showMonth, isOwner, onNewPost }) {
  const dayIsToday = isToday(day.date);
  const dayIsFuture = isFuture(day.date);
  const { location } = useLocation();

  return (
    <div className={getDayClasses(dayIsToday, dayIsFuture)}>
      <div className="Day_minutes">
        {getDayDate(showMonth, day.date)}
        {getDayDetails(user, day, location, isOwner, onNewPost)}
      </div>
    </div>
  );
}

function getDayDate(showMonth, date) {
  return (
    <div className="Day_date">
      {showMonth && (
        <div className="Day_month">
          {translateMonths(formatDate(date, "MMM"))}
        </div>
      )}
      <div className="Day_number">{formatDate(date, "DD")}</div>
    </div>
  );
}

function getDayDetails(user, day, location, isOwner, onNewPost) {
  const isAnyPost = day.posts.length === 0 ? 0 : 1;

  return isAnyPost ? (
    <Link
      className="Day_link"
      href={`/${user.uid}/${formatDate(day.date, DATE_FORMAT)}`}
      state={{
        fromCalendar: true,
        ...location.state,
      }}
    >
      {createNotes(day.posts.length)}
    </Link>
  ) : isOwner ? (
    <button onClick={onNewPost} className="Calendar_add_post_button">
      <FaPlus />
    </button>
  ) : null;
}

function getDayClasses(dayIsToday, dayIsFuture) {
  return (
    "Day" +
    (dayIsToday ? " Day_is_today" : "") +
    (dayIsFuture ? " Day_is_future" : "")
  );
}

//depending of amount of posts, function returns some divs representing number of notes
function createNotes(posts) {
  const allPossibleNotes = [
    <div key="firstNote" className="firstNote"></div>,
    <div key="secondNote" className="secondNote"></div>,
    <div key="thirdNote" className="thirdNote"></div>,
    <div key="fourthNote" className="fourthNote"></div>,
    <div key="fifthNote" className="fifthNote"></div>,
    <div key="moreNotes" className="more">
      ...
    </div>,
  ];
  const numberOfNotesToDisplay = posts < 6 ? posts : 6;
  const notesToDisplay = allPossibleNotes.slice(0, numberOfNotesToDisplay);
  return <Fragment>{notesToDisplay}</Fragment>;
}
