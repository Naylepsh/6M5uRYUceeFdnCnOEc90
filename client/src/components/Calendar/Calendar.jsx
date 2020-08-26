import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useLocation } from "../../utils/react-router-next";
import { useTransition } from "react-spring";
import { format as formatDate, subDays, addDays } from "date-fns";
import AnimatedDialog from "../AnimatedDialog";
import { DATE_FORMAT } from "../../tools";
import NewPost from "../Post/NewPost";
import { Weekdays } from "./Weekdays";
import { CalendarNav } from "./CalendarNav";
import { CalendarService } from "../../services/calendar-service";
import "./Calendar.css";
import { CalendarAnimation } from "./CalendarAnimation";
import { Week } from "./Week";

const pagesInCalendar = 5 * 7;

function getWeeks(date) {
  const dataLoader = new CalendarService(date);
  return dataLoader.getCalendar();
}

function useConsultations(date) {
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    async function fetchConsultations() {
      const data = await getWeeks(date);
      setWeeks(data);
      console.log("sent request for new weeks value");
    }

    fetchConsultations();
  }, [date]);

  return [weeks, setWeeks];
}

export function Calendar({ user, modalIsOpen }) {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [weeks, setWeeks] = useConsultations(calendarDate);
  const [newPostDate, setNewPostDate] = useState(null);
  const [dayWithNewPost, setDayWithNewPost] = useState(null);

  const today = formatDate(new Date(), DATE_FORMAT);
  const { navigate, location } = useLocation();

  const startDate =
    location.state && location.state.startDate
      ? location.state.startDate
      : today;

  const showLater = 1;

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
    const date = formatDate(
      addOrSubDays(startDate, pagesInCalendar),
      DATE_FORMAT
    );
    navigate(".", { state: { startDate: date, direction } });
  };

  const handleEarlierClick = () => {
    const newDate = subDays(calendarDate, pagesInCalendar);
    setCalendarDate(newDate);
    handleNav(subDays, "earlier");
  };
  const handleLaterClick = () => {
    const newDate = addDays(calendarDate, pagesInCalendar);
    setCalendarDate(newDate);
    handleNav(addDays, "later");
  };

  const closeDialog = () => setNewPostDate(null);

  const handleNewPostSuccess = async () => {
    const newWeeks = await getWeeks(calendarDate);
    setWeeks(newWeeks);

    setDayWithNewPost(formatDate(newPostDate, DATE_FORMAT));
    closeDialog();
  };

  const handleAnimationRest = useCallback(() => {
    setDayWithNewPost(null);
  }, [setDayWithNewPost]);

  const weekProps = {
    modalIsOpen,
    user,
    setNewPostDate,
    dayWithNewPost,
    handleAnimationRest,
  };

  return (
    <Fragment>
      <AnimatedDialog isOpen={!!newPostDate} onDismiss={closeDialog}>
        <NewPost date={newPostDate} onSuccess={handleNewPostSuccess} />
      </AnimatedDialog>
      <div className="Calendar">
        <Weekdays />
        <CalendarAnimation
          transitions={transitions}
          transitionDirection={transitionDirection}
          {...weekProps}
        >
          {weeks.map((week, weekIndex) => {
            const props = {
              weekIndex,
              week,
              ...weekProps,
            };
            return <Week {...props} />;
          })}
        </CalendarAnimation>
        <CalendarNav
          showLater={showLater}
          onEarlier={handleEarlierClick}
          onLater={handleLaterClick}
        />
      </div>
    </Fragment>
  );
}
