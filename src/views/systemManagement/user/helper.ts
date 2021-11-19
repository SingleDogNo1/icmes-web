import { RoleProxyType } from '/@/enums/roleEnum';
import { formatDate } from '/@/utils/dateUtil';

export const formatToDate = (date: string | number) => formatDate(date, 'YYYY-MM-DD');

/**
 * @description 计算代理类型和代理周期
 * 代理类型为 corn 表达式格式, 共七个占位符, 每个占位符索引指代对应星期几. 1 表示已代理, 0 表示未代理
 * 所以如果是七个1，表示每天都被代理，及全时段代理，否则为代理周期内的某几天
 */
export const parseProxyType = (type: string) =>
  type.includes('0') ? RoleProxyType.PERIOD : RoleProxyType.ALL;

export const parseProxyCycle = (type: string) => {
  const weekdayDict = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  if (!type.includes('0')) {
    return '全周期';
  } else {
    const cycleArr = type.split('').reduce((res, pre, index) => {
      if (pre === '1') {
        res.push(weekdayDict[index]);
      }
      return res;
    }, [] as string[]);

    return cycleArr.join('、');
  }
};
