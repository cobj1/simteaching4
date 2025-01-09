export const TimeRangeGenerators = (
  start: string | number | Date,
  stop: string | number | Date
) => {
  const dateRange = [];
  const startDate = new Date(start);
  const stopDate = new Date(stop);
  const startDay = (startDate.getTime() / 1000 / 60 / 60 / 24).toFixed(0);
  const stopDay = (stopDate.getTime() / 1000 / 60 / 60 / 24).toFixed(0);
  const rangeDayCount = Number.parseInt(stopDay) - Number.parseInt(startDay);
  for (let i = 0; i <= rangeDayCount; i++) {
    dateRange.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000));
  }
  return dateRange;
};
