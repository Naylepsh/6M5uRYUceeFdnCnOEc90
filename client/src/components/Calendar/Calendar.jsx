import React, { Fragment, useState, useCallback } from "react";
import { useLocation } from "../../utils/react-router-next";
import { useTransition, animated } from "react-spring";
import {
  format as formatDate,
  subDays,
  addDays,
  isFirstDayOfMonth,
} from "date-fns";
import AnimatedDialog from "../AnimatedDialog";
import { DATE_FORMAT } from "../../tools";
import { useAppState } from "../../states/AppState";
import NewPost from "../NewPost";
import { Day } from "./Day";
import { Weekdays } from "./Weekdays";
import { CalendarNav } from "./CalendarNav";
import "./Calendar.css";
import { createCalendarData } from "../../services/calendar-service";

export function Calendar({ user, posts, modalIsOpen }) {
  const [{ auth }] = useAppState();
  const weeks = createCalendarData(new Date());

  const [newPostDate, setNewPostDate] = useState(null);
  const [dayWithNewPost, setDayWithNewPost] = useState(null);

  const today = formatDate(new Date(), DATE_FORMAT);
  const { navigate, location } = useLocation();

  const startDate =
    location.state && location.state.startDate
      ? location.state.startDate
      : today;

  const showLater = 1;

  const isOwner = auth.uid === user.uid;
  const numWeeks = 5;

  const [prevStart, setPrevStart] = useState(startDate);
  const [transitionDirection, setTransitionDirection] = useState();
  if (prevStart !== startDate) {
    setTransitionDirection(startDate < prevStart ? "earlier" : "later");
    setPrevStart(startDate);
  }

  const transitions = useTransition(
    //gives informations for swiping calendar up/down
    { weeks, startDate },
    (item) => item.startDate,
    {
      from: { y: -105 },
      enter: { y: 0 },
      leave: { y: 105 },
      initial: null,
    }
  );

  const handleNav = (addOrSubDays, direction) => {
    //counts days after swiping
    const date = formatDate(addOrSubDays(startDate, 7 * numWeeks), DATE_FORMAT);
    navigate(".", { state: { startDate: date, direction } });
  };

  const handleEarlierClick = () => handleNav(subDays, "earlier");
  const handleLaterClick = () => handleNav(addDays, "later");

  const closeDialog = () => setNewPostDate(null);

  const handleNewPostSuccess = () => {
    setDayWithNewPost(formatDate(newPostDate, DATE_FORMAT));
    closeDialog();
  };

  const handleAnimationRest = useCallback(() => {
    setDayWithNewPost(null);
  }, [setDayWithNewPost]);

  if (!auth) return null;

  return (
    <Fragment>
      <AnimatedDialog isOpen={!!newPostDate} onDismiss={closeDialog}>
        <NewPost date={newPostDate} onSuccess={handleNewPostSuccess} />
      </AnimatedDialog>
      <div className="Calendar">
        <Weekdays />
        <div className="Calendar_animation_overflow">
          {transitions.map(({ item, props: { y }, key }, index) => {
            if (!item) return null;
            let transform = "translate3d(0px, 0%, 0px)";
            if (transitionDirection === "earlier") {
              transform = y.interpolate((y) => `translate3d(0px, ${y}%, 0px)`);
            } else if (transitionDirection === "later") {
              transform = y.interpolate((y) => `translate3d(0px, ${-y}%, 0px)`);
            }
            return (
              <animated.div
                key={key}
                className="Calendar_animation_wrapper"
                style={{ transform, zIndex: index }}
              >
                {item.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="Calendar_week">
                    {week.map((day, dayIndex) => {
                      const showMonth =
                        weekIndex + dayIndex === 0 ||
                        isFirstDayOfMonth(day.date);
                      return (
                        <Day
                          modalIsOpen={modalIsOpen}
                          user={user}
                          key={dayIndex}
                          showMonth={showMonth}
                          day={day}
                          isOwner={isOwner}
                          onNewPost={() => setNewPostDate(day.date)}
                          hasNewPost={
                            dayWithNewPost === formatDate(day.date, DATE_FORMAT)
                          }
                          onAnimatedTextRest={handleAnimationRest}
                        />
                      );
                    })}
                  </div>
                ))}
              </animated.div>
            );
          })}
        </div>
        <CalendarNav
          showLater={showLater}
          onEarlier={handleEarlierClick}
          onLater={handleLaterClick}
        />
      </div>
    </Fragment>
  );
}
