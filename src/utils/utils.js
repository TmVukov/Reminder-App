export const convertDateToMs = (alarms) => {
  //replace month and day (to convert it to ms)
  let formattedAlarms = alarms
    .map((e) => e.split('/'))
    .map((e) => [e[1], e[0], e[2], e[3]].join('/'));

  //convert dates to ms
  return formattedAlarms.map((e) => Date.parse(e));
};
