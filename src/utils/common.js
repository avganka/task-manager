import dayjs from "dayjs";

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes() % 12);

  return `${hours}:${minutes}`;
};

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

export const isOneDay = (dateA, dateB) => {
  const a = dayjs(dateA);
  const b = dayjs(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};
