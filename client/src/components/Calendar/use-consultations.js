import { useState, useEffect } from "react";
import { getWeeks } from "./get-weeks";

export function useConsultations(date) {
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
