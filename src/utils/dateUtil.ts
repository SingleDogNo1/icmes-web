/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatDate(
  date: dayjs.Dayjs | undefined = undefined,
  pattern = 'YYYY-MM-DD HH:mm:ss',
) {
  if (!date) return '';
  return dayjs(date).format(pattern);
}

export const dateUtil = dayjs;
