export function hasTransitions() {
  const element = document.createElement('div');
  const property = [
    'transitionProperty',
    'WebkitTransition',
    'MozTransition',
    'OTransition',
    'msTransition',
  ];

  for (const value of property) {
    if ((element.style as any)[value] !== undefined) return true;
  }

  return false;
}

export function noop() {}

export function computedNextYear(year: string | number, month: string | number): number {
  if (Number(month) + 1 > 12) {
    return Number(year) + 1;
  }
  return Number(year);
}

export function computedPrevYear(year: string | number, month: string | number): number {
  if (Number(month) - 1 - 1 < 0) {
    return Number(year) - 1;
  }

  return +year;
}

export function date2ymd(date: string): number[] {
  const [y, m, d] = date.split('-');
  return [Number(y), Number(m), Number(d)];
}

export function offloadFn(fn: any) {
  setTimeout(fn || noop, 0);
}

export function language(): string {
  return (navigator.language || (navigator as any).browserLanguage).toLowerCase();
}

export function isZh(languageValue?: string) {
  if (languageValue) {
    return languageValue === 'cn';
  }
  return language() === 'zh-cn';
}

export const enWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
export const zhWeeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export const enMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
export const zhMonths = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

export function getWeeks(languageParam: string) {
  return isZh(languageParam) ? zhWeeks : enWeeks;
}

export function getMonths(languageParam: string | undefined) {
  return isZh(languageParam) ? zhMonths : enMonths;
}

export function computedNextMonth(month: string | number) {
  if (Number(month) + 1 > 12) {
    return 1;
  } else {
    return Number(month) + 1;
  }
}

export function computedPrevMonth(month: string | number): number {
  if (Number(month) - 1 === 0) {
    return 12;
  } else {
    return Number(month) - 1;
  }
}

export function getDateByCount(date: string, count: number): string {
  const [y, m, d] = date2ymd(date);
  const timestamp = +new Date(y, m - 1, d);
  const dateObj = new Date(timestamp + count * 86400000);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  return `${year}-${month + 1}-${day}`;
}

export function getPrevDate(
  year: string | number,
  month: string | number,
  day?: string | number,
): any[] {
  if (day) {
    return date2ymd(getDateByCount(`${year}-${month}-${day}`, -7));
  }
  return [computedPrevYear(year, month), computedPrevMonth(month)];
}

export function getNextDate(
  year: string | number,
  month: string | number,
  day?: string | number,
): any[] {
  if (day) {
    return date2ymd(getDateByCount(`${year}-${month}-${day}`, 7));
  }
  return [computedNextYear(year, month), computedNextMonth(month)];
}

export function delay(time?: number) {
  return new Promise((resolve) => setTimeout(() => resolve(true), time || 0));
}

export function getToday(needArray?: boolean) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (needArray) {
    return [year, month, day];
  }
  return [year, month, day].join('-');
}

export function getSomeNextMonths(year: string | number, month: string | number, count: number) {
  let currentYear = year;
  let currentMonth = month;
  return Array.from({ length: count }).map((v, index) => {
    if (!index) {
      return `${currentYear}-${currentMonth}`;
    }
    const [y, m] = getNextDate(currentYear, currentMonth);
    currentYear = y;
    currentMonth = m;
    return `${currentYear}-${currentMonth}`;
  });
}
