export const serverDateTimeToLocalDateTime = (serverDate) => {
  const dateInUTC = new Date(serverDate);
  return new Date(
    dateInUTC.getTime() - dateInUTC.getTimezoneOffset() * 60 * 1000
  );
};

export const localDateToServerDateTime = (date) => {
  const adjustedDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000
  );
  return adjustedDate.toISOString().split(".")[0].replace("T", " ");
};

export const formatlocalDateTime = (date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const dayMonthUeatFormat = (date) => {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + "/" + mm + "/" + yyyy;
};
