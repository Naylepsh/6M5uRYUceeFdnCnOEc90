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
  const isAnyPost = day.posts.length === 0 ? 0 : 1;

  // console.log("Tutaj dzień: " + day + " a tu posty: " + day.posts);
  return (
    <div
      className={
        "Day" +
        (dayIsToday ? " Day_is_today" : "") +
        (dayIsFuture ? " Day_is_future" : "")
      }
    >
      <div className="Day_date">
        {showMonth && (
          <div className="Day_month">
            {translateMonths(formatDate(day.date, "MMM"))}
          </div>
        )}
        <div className="Day_number">{formatDate(day.date, "DD")}</div>
      </div>
      <div className="Day_minutes">
        {isAnyPost ? (
          <Link
            className="Day_link"
            href={`/${user.uid}/${formatDate(day.date, DATE_FORMAT)}`}
            state={{
              fromCalendar: true,
              ...location.state,
            }}
          >
            {NotesElements(day.posts.length)}
          </Link>
        ) : isOwner ? (
          <button onClick={onNewPost} className="Calendar_add_post_button">
            <FaPlus />
          </button>
        ) : null}
      </div>
    </div>
  );
}

//depending of amount of posts, function returns some divs representing number of notes
function NotesElements(posts) {
  if (posts === 1) {
    return <div className="firstNote"></div>;
  }
  if (posts === 2) {
    return (
      <Fragment>
        <div className="firstNote"></div>
        <div className="secondNote"></div>
      </Fragment>
    );
  }
  if (posts === 3) {
    return (
      <Fragment>
        <div className="firstNote"></div>
        <div className="secondNote"></div>
        <div className="thirdNote"></div>
      </Fragment>
    );
  }
  if (posts === 4) {
    return (
      <Fragment>
        <div className="firstNote"></div>
        <div className="secondNote"></div>
        <div className="thirdNote"></div>
        <div className="fourthNote"></div>
      </Fragment>
    );
  }
  if (posts === 5) {
    return (
      <Fragment>
        <div className="firstNote"></div>
        <div className="secondNote"></div>
        <div className="thirdNote"></div>
        <div className="fourthNote"></div>
        <div className="fifthNote"></div>
      </Fragment>
    );
  }
  if (posts >= 5) {
    return (
      <Fragment>
        <div className="firstNote"></div>
        <div className="secondNote"></div>
        <div className="thirdNote"></div>
        <div className="fourthNote"></div>
        <div className="fifthNote"></div>
        <div className="more">...</div>
      </Fragment>
    );
  }
}
