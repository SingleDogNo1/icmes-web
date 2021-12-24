import { dateUtil } from '/@/utils/dateUtil';

export function calcDurationTime(endTime, startTime) {
  const duration = endTime ? endTime - startTime : Number(dateUtil().format('x')) - startTime;

  const seconds = duration / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  if (~~minutes > 60) {
    return ~~hours + ' 小时' + ~~((hours - parseInt(hours)) * 60) + ' 分钟';
  } else {
    return minutes < 1 ? '<1 分钟' : ~~minutes + ' 分钟';
  }
}
