import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useLocation } from "../../utils/react-router-next";
import { format as formatDate, subDays, addDays } from "date-fns";
import AnimatedDialog from "../AnimatedDialog";
import { DATE_FORMAT } from "../../tools";
import NewPost from "../Post/NewPost";
import { Weekdays } from "./Weekdays";
import { CalendarNav } from "./CalendarNav";
import { CalendarService } from "../../services/calendar-service";
import { CalendarAnimation } from "./CalendarAnimation";
import { Week } from "./Week";
import "./Calendar.css";
import { getStartDate } from "./use-start-date";

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

  const { navigate, location } = useLocation();
  const startDate = getStartDate(location);

  const showLater = 1;

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

  const weekDefaultProps = {
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
        <CalendarAnimation>
          {weeks.map((week, weekIndex) => {
            return (
              <Week {...weekDefaultProps} weekIndex={weekIndex} week={week} />
            );
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
