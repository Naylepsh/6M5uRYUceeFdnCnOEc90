import { useState, useEffect } from "react";
import { getCalendar } from "./get-calendar";

export function useCalendar(date) {
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    async function fetchConsultations() {
      const data = await getCalendar(date);
      setCalendar(data);
      console.log("sent request for new weeks value");
    }

    fetchConsultations();
  }, [date]);

  return [calendar, setCalendar];
}
