const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatTimeStamp = (unix_timestamp: number) => {
  const date = new Date(unix_timestamp * 1000);
  const year = date.getFullYear();

  const month = months[date.getMonth()];
  const dateToday = date.getDate();

  // Hours part from the timestamp
  const hours = date.getHours();

  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();

  // Seconds part from the timestamp
  const seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  const formattedTime =
    dateToday +
    " " +
    month +
    " " +
    year +
    "_" +
    hours +
    ":" +
    minutes.substr(-2) +
    ":" +
    seconds.substr(-2);

  const formattedDate = year + "/" + (date.getMonth() + 1) + "/" + dateToday;

  return {
    formattedFullDateAndTime: formattedTime,
    formattedDate,
  };
};
