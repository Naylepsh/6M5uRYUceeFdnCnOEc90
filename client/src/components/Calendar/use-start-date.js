import { format as formatDate } from "date-fns";
import { DATE_FORMAT } from "../../tools";

export function getStartDate(location) {
  const today = formatDate(new Date(), DATE_FORMAT);
  const startDate =
    location.state && location.state.startDate
      ? location.state.startDate
      : today;

  return startDate;
}
