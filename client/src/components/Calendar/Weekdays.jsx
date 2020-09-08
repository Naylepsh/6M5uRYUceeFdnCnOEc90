import React, { useState } from "react";
import "./Weekdays.css";
import { useEffect, useCallback } from "react";

const weekdaysFullNames = [
  "poniedziałek",
  "wtorek",
  "środa",
  "czwartek",
  "piątek",
  "sobota",
  "niedziela",
];

export function Weekdays() {
  const [weekdays, setWeekdays] = useState(weekdaysFullNames);

  const shortenNames = useCallback(() => {
    const newWeekdays =
      window.innerWidth < 768
        ? weekdays.map((day) => day.slice(0, 3))
        : weekdaysFullNames;
    setWeekdays(newWeekdays);
  }, []);

  useEffect(() => {
    shortenNames();
    window.matchMedia("(max-width: 768px)").addListener(shortenNames);
  }, [shortenNames]);

  return (
    <div className="Weekdays">
      {weekdays.map((day, i) => (
        <div key={i}>{day}</div>
      ))}
    </div>
  );
}
