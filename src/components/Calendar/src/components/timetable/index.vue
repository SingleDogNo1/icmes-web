<template>
  <div
    :class="[
      `${timetableCls}`,
      {
        prev: tableIndex === 0,
        current: tableIndex === 1,
        next: tableIndex === 2,
      },
    ]"
  >
    <div :class="`${timetableCls}-wrap`">
      <div :class="[`mode-${tableMode}`]">
        <template v-if="tableMode === 'monthRange'">
          <div class="date-container">
            <span>{{ formatRangeMonth[0] }}</span>
            <span>{{ formatRangeMonth[1] }}</span>
          </div>
          <div class="week-container">
            <span v-for="(week, index) in weeks" :key="index">{{ week }}</span>
          </div>
        </template>
        <div :class="`${timetableCls}-content`">
          <div v-for="(days, k1) in monthRender.value" :key="k1" :class="`${timetableCls}-row`">
            <div
              v-for="(child, k2) in days"
              :key="k2"
              :class="[
                `${timetableCls}-day`,
                {
                  today: child.isToday,
                  dayoff: k2 === (monFirst ? 5 : 0) || k2 === 6,
                  disabled: child.disabled,
                  'prev-month-day': child.prevMonthDay,
                  'next-month-day': child.nextMonthDay,
                  'row-first': k2 === 0,
                  'row-last': k2 === 6,
                  'month-last-date': child.lastDay,
                  'month-first-date': 1 === child.day,
                  'mc-last-month': child.lastMonth,
                  'mc-next-month': child.nextMonth,
                  'calendar-holiday': child.holiday,
                  'calendar-isTerm': child.isTerm,
                  isLunarFestival: child.isAlmanac || child.isLunarFestival,
                  isGregorianFestival: child.isGregorianFestival,
                },
                child.className,
                child.selectedClassName,
                child.rangeClassName,
              ]"
              @click="select(child)"
            >
              <div :class="`${timetableCls}-day-container`">
                <span class="calendar-date">{{ child.day }}</span>
                <div
                  :class="[`${timetableCls}-slot-element`, child.tileContent.className]"
                  v-if="child.tileContent"
                  >{{ child.tileContent.content }}</div
                >
                <div v-if="child.remark">{{ child.remark }}</div>
                <div
                  class="calendar-almanac"
                  :class="{
                    'calendar-holiday': child.holiday,
                    'calendar-isTerm': child.isTerm,
                    isLunarFestival: child.isAlmanac || child.isLunarFestival,
                    isGregorianFestival: child.isGregorianFestival,
                  }"
                >
                  {{ child.holiday || child.lunarHoliday || child.gregorianHoliday || child.lunar }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="backgroundText" :class="`${timetableCls}-background`">{{ month }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'TimeTableComp',
  };
</script>

<script lang="ts" setup>
  import { ref, reactive, watch, toRefs, unref } from 'vue';
  import {
    disabledDate,
    computedPrevDay,
    date2ymd,
    selectOption,
    multiOption,
    rangeOption,
    multiRangeOption,
    getLunarInfo,
    isCurrentMonthToday,
    setTileContent,
    setRemark,
    computedPrevMonth,
    computedNextYear,
    computedNextDay,
  } from './computed';
  import { rangeSelect, singleSelect, multiSelect, multiRange } from './controller';
  import { computedNextMonth, computedPrevYear } from '../../utils';
  import { TimeTableInterface } from '../../types';
  import { basicTableProps } from '../../props';
  import { useDesign } from '/@/hooks/web/useDesign';

  const disabledDateHandle = disabledDate();
  const setRemarkHandle = setRemark();
  const setTileContentHandle = setTileContent();

  const { prefixCls: timetableCls } = useDesign('calendar-timetable');

  const props: TimeTableInterface = defineProps(basicTableProps);
  const emit = defineEmits(['onSelect', 'onMonthChange']);

  const {
    year,
    month,
    selectMode,
    tableMode: propsTableMode,
    monFirst,
    begin: propsBegin,
    end: propsEnd,
    completion: propsCompletion,
    day,
    tileContent,
    disabled,
    remarks,
    holidays,
    customDays,
    selectDate,
  } = toRefs(props);

  const tableMode = ref(propsTableMode);
  const begin = ref(propsBegin);
  const end = ref(propsEnd);
  const completion = ref(propsTableMode.value === 'week' || propsCompletion.value);
  const formatRangeMonth = ref([year?.value, month?.value]);
  disabledDateHandle.update(disabled.value);
  setRemarkHandle.update(remarks.value);
  setTileContentHandle.update(tileContent?.value);

  function selectComputed(date: string) {
    switch (selectMode.value) {
      case 'range':
        return rangeOption({ selectDate: selectDate?.value, date } as any);
      case 'multiRange':
        return multiRangeOption({ selectDate: selectDate?.value, date } as any);
      case 'multi':
        return multiOption({ selectDate: selectDate?.value, date } as any);
      case 'select':
        return selectOption({ selectDate: selectDate?.value, date });
    }
  }

  function select(child: any) {
    const { date, prevMonthDay, nextMonthDay } = child;

    if (prevMonthDay || nextMonthDay) {
      if (propsTableMode.value === 'monthRange') return;

      return emit('onMonthChange', { prevMonthDay, nextMonthDay });
    }

    let selectValue;
    switch (selectMode.value) {
      case 'select':
        selectValue = singleSelect(selectDate?.value as string, date);
        break;
      case 'multi':
        selectValue = multiSelect(selectDate?.value as string[], date);
        break;
      case 'range':
        selectValue = rangeSelect(selectDate?.value as { start?: string; end?: string }, date);
        break;
      case 'multiRange':
        selectValue = multiRange(selectDate?.value as { start?: string; end?: string }[], date);
        break;
    }

    emit('onSelect', selectValue);
  }

  function setDisabledDate(options: { year: string; month: string; i: string; date: string }) {
    const { year: disYear, month: disMonth, i, date } = options;
    const dateTimestamp = +new Date(Number(disYear), Number(disMonth) - 1, Number(i));
    const disabledOptions = {} as { disabled: boolean };
    if (begin.value) {
      const [beginY, beginM, beginD] = begin.value.split('-');
      const beginTimestamp = +new Date(Number(beginY), Number(beginM) - 1, Number(beginD));
      if (beginTimestamp > dateTimestamp) {
        disabledOptions.disabled = true;
      }
    }

    if (end.value) {
      const [endY, endM, endD] = end.value.split('-');
      const endTimestamp = +new Date(Number(endY), Number(endM) - 1, Number(endD));
      if (endTimestamp < dateTimestamp) {
        disabledOptions.disabled = true;
      }
    }

    if (disabledDateHandle.isDisabled(date)) {
      disabledOptions.disabled = true;
    }

    return disabledOptions;
  }

  function getToday(date: string) {
    return {
      isToday: isCurrentMonthToday(date),
    };
  }

  function renderOption({ year, month, i }: any) {
    const date = `${year}-${month}-${i}`;
    const modeOptions = {
      selectedClassName: selectComputed(date),
    };

    const customDay = unref(customDays);

    let customCls = '';
    for (const key in customDay) {
      const element = customDay[key];
      if (element.includes(date)) {
        customCls = key;
      }
    }

    const options = {
      day: i,
      className: customCls,
      holiday: holidays?.value?.[`${month}-${i}`],
      ...getLunarInfo(year, month, i, props.lunar),
      ...setRemarkHandle.getRemark(date),
      ...setTileContentHandle.getTileContent(date),
      ...setDisabledDate({ year, month, i, date }),
      ...getToday(date),
    };

    return Object.assign(options, modeOptions);
  }

  const monthRender = reactive({
    value: render({ year: year?.value, month: month?.value, day: day?.value }),
  });

  function render({ year, month, day }: any) {
    completion.value = propsTableMode.value === 'week' || propsCompletion.value;
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); //what day is the first day of the month
    const lastDateOfCurrentMonth = new Date(year, month, 0).getDate(); //last date of current month
    const lastDateOfLastMonth = new Date(year, month - 1, 0).getDate(); // last day Of last month

    let firstWeekDayCompletionCount;
    if (monFirst?.value) {
      firstWeekDayCompletionCount = (firstDayOfMonth === 0 ? 7 : firstDayOfMonth) - 1;
    } else {
      firstWeekDayCompletionCount = firstDayOfMonth === 0 ? 0 : firstDayOfMonth;
    }

    const firstWeekDayCount = 7 - firstWeekDayCompletionCount;
    const temp: any[] = [];

    if (tableMode.value === 'week') {
      let dayOfCurrentWeek = new Date(year, month - 1, day).getDay() - (monFirst?.value ? 1 : 0); // what day is the current week
      if (dayOfCurrentWeek === -1) {
        // when current day is sunday and use monFirst mode
        dayOfCurrentWeek = 6;
      }

      temp.push(renderOption({ year, month, i: day }));

      let countDate = [year, month, day];
      for (let i = 0; i < dayOfCurrentWeek; i++) {
        const [y, m, d] = countDate;
        const prevDate = computedPrevDay(y, m, d);
        countDate = date2ymd(prevDate);
        temp.unshift(renderOption({ year: countDate[0], month: countDate[1], i: countDate[2] }));
      }

      countDate = [year, month, day];
      for (let i = dayOfCurrentWeek; i < 6; i++) {
        const [y, m, d] = countDate;
        const nextDate = computedNextDay(y, m, d);
        countDate = date2ymd(nextDate);
        temp.push(renderOption({ year: countDate[0], month: countDate[1], i: countDate[2] }));
      }

      return [temp];
    }

    let line = 0;
    for (let i = 1; i <= lastDateOfCurrentMonth; i++) {
      if (!Array.isArray(temp[line])) temp[line] = [];

      if (line === 0) {
        temp[line].push(renderOption({ year, month, i }));
        if (temp[line].length === firstWeekDayCount) {
          line += 1;
        }
      } else {
        temp[line].push(renderOption({ year, month, i }));
        if (temp[line].length === 7) line += 1;
      }
    }

    if (completion.value) {
      //completion prev month
      let completionCounting = 0;
      const [prevYear, prevMonth] = [computedPrevYear(year, month), computedPrevMonth(month)];
      while (firstWeekDayCompletionCount !== completionCounting) {
        temp[0].unshift(
          Object.assign(
            renderOption({
              year: prevYear,
              month: prevMonth,
              i: lastDateOfLastMonth - completionCounting,
            }),
            { prevMonthDay: true, disabled: true },
          ),
        );
        completionCounting += 1;
      }

      //completion next month
      const completionWeeksCount = 5 - line > 0 ? 5 - line : 0;
      const [nextYear, nextMonth] = [computedNextYear(year, month), computedNextMonth(month)];

      if (!Array.isArray(temp[line])) temp[line] = [];

      const lastWeekDayCompletionCount = 7 - temp[line].length + 7 * completionWeeksCount;
      let completionCountingNext = 0;

      while (lastWeekDayCompletionCount !== completionCountingNext) {
        if (temp[line].length === 7) {
          line += 1;
          temp[line] = [];
          continue;
        }

        completionCountingNext += 1;
        temp[line].push(
          Object.assign(
            renderOption({ year: nextYear, month: nextMonth, i: completionCountingNext }),
            { nextMonthDay: true, disabled: true },
          ),
        );
      }
    } else if (firstWeekDayCompletionCount) {
      temp[0].unshift(...Array.from({ length: firstWeekDayCompletionCount }).fill('PLACEHOLDER'));
    }

    return temp;
  }

  function refreshRender() {
    monthRender.value = render({ year: year?.value, month: month?.value, day: day?.value });
  }

  function formatYearAndMonth() {
    const { format } = props;
    if (format) {
      formatRangeMonth.value = format(year?.value as any, month?.value as any);
    } else {
      formatRangeMonth.value = [`${year?.value}-`, month?.value];
    }
  }

  formatYearAndMonth();

  watch(
    () => props.timestamp,
    () => {
      disabledDateHandle.update(disabled.value);
      setRemarkHandle.update(remarks.value);
      setTileContentHandle.update(tileContent?.value);
      refreshRender();
    },
  );

  watch(
    () => [props.monFirst, props.completion, props.year, props.month, props.day],
    () => {
      refreshRender();
    },
  );

  watch(
    () => props.month,
    () => {
      formatYearAndMonth();
    },
  );
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-calendar-timetable';

  .@{prefix-cls} {
    background: #fff;
    padding-bottom: 10px;
    .@{prefix-cls}-wrap {
      .date-container {
        background: @white;
        padding: 10px 0;
        color: #646464;
        text-align: center;
        font-size: 16px;
      }

      .week-container {
        width: 100%;
        display: flex;
        align-items: center;
        height: 30px;
        margin-top: 10px;

        span {
          flex: 1;
          text-align: center;
          color: #6b7897;
        }
      }

      .@{prefix-cls}-row {
        overflow: hidden;
        .@{prefix-cls}-day {
          -webkit-tap-highlight-color: transparent;
          width: 14.285714285714285%;
          position: relative;
          float: left;
          // color: #7c86a2;
          color: @primary-color;
          cursor: pointer;
          padding: 1%;
          box-sizing: border-box;

          &:before {
            content: '';
            padding-top: 100%;
            display: block;
            position: relative;
            z-index: 1;
          }

          &.selected-range-includes {
            &:after {
              content: '';
              display: block;
              position: absolute;
              width: 100%;
              height: 86%;
              background: lighten(@primary-color, 50%);
              top: 7%;
              z-index: 1;
            }
          }

          &.selected-range-start {
            &:after {
              content: '';
              display: block;
              position: absolute;
              width: 100%;
              height: 86%;
              background: lighten(@primary-color, 50%);
              top: 7%;
              z-index: 0;
              left: 50%;
            }

            &.selected-range-not-complete,
            &.row-last {
              &:after {
                content: none;
              }
            }
          }
          .@{prefix-cls}-day-container {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            padding: 1%;
            z-index: 3;
          }

          &.day-selected {
            &:before {
              @apply rounded;
              background: @primary-color;
              overflow: hidden;
            }

            .calendar-date,
            .calendar-almanac {
              color: @white;
            }

            &.selected-range-includes {
              .calendar-date,
              .calendar-almanac {
                color: @primary-color;
              }
            }
          }

          &.dayoff {
            .calendar-date {
              color: @highlight-color;
            }
          }

          .calendar-date {
            width: 100%;
            display: block;
            position: absolute;
            text-align: center;
            top: 50%;
            transform: translateY(-50%);
          }

          .calendar-almanac {
            display: block;
            position: absolute;
            bottom: 8%;
            font-size: 12px;
            width: 100%;
            text-align: center;

            &.calendar-holiday,
            &.calendar-isTerm {
              color: @highlight-color;
            }
          }
          .@{prefix-cls}-slot-element {
            font-size: 12px;
            position: absolute;
            top: 0;
          }

          &.disabled {
            pointer-events: none;
            .@{prefix-cls}-day-container {
              .calendar-date,
              .calendar-almanac {
                color: @disabled-color;
              }
            }

            &.prev-month-day,
            &.next-month-day {
              pointer-events: inherit;
            }
          }
        }
      }

      .@{prefix-cls}-content {
        position: relative;
        .@{prefix-cls}-background {
          position: absolute;
          top: 50%;
          text-align: center;
          width: 100%;
          font-size: 200px;
          transform: translateY(-50%);
          font-weight: 900;
          color: #f4f5f9;
        }
      }
    }
  }
</style>
