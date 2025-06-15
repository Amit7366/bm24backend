import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getCurrentWeekRange = () => {
  const tz = 'Asia/Dhaka';
  const start = dayjs().tz(tz).startOf('week').add(2, 'hour');
  const end = start.add(6, 'day').add(23, 'hour').add(59, 'minute');
  return { start: start.toDate(), end: end.toDate() };
};
