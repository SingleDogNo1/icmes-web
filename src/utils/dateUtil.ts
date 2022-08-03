/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(
  date: dayjs.Dayjs | number | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(
  date: dayjs.Dayjs | number | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatDate(
  date: dayjs.Dayjs | number | undefined = undefined,
  pattern = 'YYYY-MM-DD HH:mm:ss',
) {
  if (!date) return '';
  return dayjs(date).format(pattern);
}

/**
 * 传入两个时间节点,计算时间差(支持相差天/小时), 参数不区分开始结束时间
 * @param {number} time1 一个时间节点
 * @param {number} time2 另一个时间节点
 * @param {string} unit 差值单位(天/小时)
 * @returns
 */
export function diffDateTime(time1: number, time2: number, unit: 'days' | 'hours' = 'hours') {
  const diffSeconds = Math.abs(dayjs(time1).diff(dayjs(time2), 'seconds'));

  let string = '';
  if (unit === 'days') {
    const days = ~~(diffSeconds / 60 / 60 / 24);
    const hours = ~~((diffSeconds - days * 24 * 60 * 60) / (60 * 60));
    const minutes = ~~((diffSeconds - (days * 24 * 60 * 60 + hours * 60 * 60)) / 60);
    const seconds = diffSeconds - (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60);
    if (days) {
      string += days + '天';
    }
    string += hours + '小时' + minutes + '分钟' + seconds + '秒';
  } else if (unit === 'hours') {
    const hours = ~~(diffSeconds / 60 / 60);
    const minutes = ~~((diffSeconds - hours * 60 * 60) / 60);
    const seconds = diffSeconds - (hours * 60 * 60 + minutes * 60);

    if (hours) {
      string += hours + '小时';
    }

    string += minutes + '分钟' + seconds + '秒';
  }

  return string;
}

export const dateUtil = dayjs;
