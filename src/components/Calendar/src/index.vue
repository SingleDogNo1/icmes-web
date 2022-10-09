<template>
  <div :class="[prefixCls, `${prefixCls}-mode-${tableMode}`, className]">
    <Tools
      @on-month-change="onToolsMonthChange"
      @next-month="nextMonthChange"
      @next-year="nextYearChange"
      @prev-month="prevMonthChange"
      @prev-year="prevYearChange"
      @select-month="selectMonth"
      @select-year="selectYear"
      :month="month"
      :year="year"
      :monFirst="monFirst"
      :timetableHeight="timetableHeight"
      :format="format"
      :tableMode="tableMode"
      :weeks="weeksInner"
      :months="months"
      :language="language"
    />
    <div :style="{ height: timetableHeight + 'px' }">
      <Swipe
        :initialSlide="1"
        :useSwipe="useSwipeInner"
        @swiper-change-end="swiperChangeEnd"
        @container-change="containerChange"
        ref="swipeRef"
      >
        <Slide :useSwipe="useSwipeInner" v-for="(item, index) in timetableList.list" :key="index">
          <TimeTable
            :tableIndex="index"
            :language="language"
            :timestamp="timestamp"
            :weeks="weeksInner"
            ref="timetableRef"
            :useSwipe="useSwipeInner"
            :month="item.month"
            :year="item.year"
            :day="item.day"
            :remarks="remarks"
            :holidays="holidays"
            :customDays="customDays"
            :tileContent="tileContent"
            :disabled="disabled"
            :completion="completion"
            :monFirst="monFirst"
            :tableMode="tableMode"
            :selectMode="selectMode"
            :selectDate="selectDateInner"
            :begin="begin"
            :end="end"
            :format="format"
            :lunar="lunar && lunarFun"
            :backgroundText="backgroundText"
            @on-select="onSelect"
            @on-month-change="monthChange"
          />
        </Slide>
      </Swipe>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'CalendarComp',
  };
</script>

<script lang="ts" setup>
  import { ref, reactive, watch, toRefs } from 'vue';
  import { CalendarInterface } from './types';
  import Tools from './components/tools/index.vue';
  import Swipe from './components/swipe/index.vue';
  import Slide from './components/swipe/slide.vue';
  import TimeTable from './components/timetable/index.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import {
    delay,
    enWeeks,
    getToday,
    isZh,
    zhWeeks,
    computedNextMonth,
    computedPrevMonth,
    getDateByCount,
    date2ymd,
    getPrevDate,
    getNextDate,
    getSomeNextMonths,
    getMonths,
  } from './utils';
  import { basicCalendarProps } from './props';
  import lunarFun from './utils/lunar';

  const props: CalendarInterface = defineProps(basicCalendarProps);

  const emit = defineEmits([
    'onSelect',
    'nextMonth',
    'nextYear',
    'prevMonth',
    'prevYear',
    'selectMonth',
    'selectYear',
    'onMonthChange',
    'onYearChange',
  ]);

  const {
    tileContent,
    monFirst,
    monthRange,
    mode: tableMode,
    selectMode,
    selectDate,
    remarks,
    weeks,
    language: propLanguage,
  } = toRefs(props);
  const timestamp = ref(+new Date()); // listener timestamp change to refresh timetable
  const [todayYear, todayMonth, todaytDay] = getToday(true) as number[];
  const year = ref(todayYear);
  const month = ref(todayMonth);
  const day = ref(todaytDay);
  const timetableHeight = ref(undefined);
  const months = ref(getMonths(propLanguage?.value));
  const swipeRef = ref();
  const timetableRef = ref();
  const weeksInner = ref(computedWeek());
  const useSwipeInner = ref(tableMode.value === 'monthRange' ? false : props.useSwipe);
  const initSelectValue =
    selectDate?.value ||
    {
      select: '',
      multi: [],
      multiRange: [],
      range: { start: '', end: '' },
    }[selectMode.value];
  const timetableList = reactive({ list: getTimetableList() });
  const selectDateInner = ref(initSelectValue);
  const { prefixCls } = useDesign('calendar');

  function swiperChangeEnd(index: number) {
    const isWeekMode = tableMode.value === 'week';
    if (index === 2) {
      const [nextYear, nextMonth, nextDay] = getNextDate(
        year.value,
        month.value,
        isWeekMode ? day.value : undefined,
      );
      year.value = nextYear;
      month.value = nextMonth;

      if (isWeekMode) {
        day.value = nextDay;
      }

      emit('onMonthChange', year.value, month.value);
      return swipeRef.value.slide(1, 0);
    }

    if (index === 0) {
      const [prevYear, prevMonth, prevDay] = getPrevDate(
        year.value,
        month.value,
        isWeekMode ? day.value : undefined,
      );
      year.value = prevYear;
      month.value = prevMonth;

      if (isWeekMode) {
        day.value = prevDay;
      }

      emit('onMonthChange', year.value, month.value);
      return swipeRef.value.slide(1, 0);
    }
  }

  function computedWeek() {
    if (Array.isArray(props.weeks)) return props.weeks;

    const language = isZh(propLanguage?.value) ? 'zh' : 'en';
    const weeksArray = {
      en: enWeeks,
      zh: zhWeeks,
    }[language];

    if (monFirst?.value) {
      return weeksArray.reduce(
        (previousValue: any, currentValue: any, index: number) => {
          if (!index) {
            previousValue.first = currentValue;
            return previousValue;
          }

          previousValue.week.push(currentValue);

          if (index === weeksArray.length - 1) {
            return [...previousValue.week, previousValue.first];
          }

          return previousValue;
        },
        { first: undefined, week: [] },
      );
    }

    return weeksArray;
  }

  function getTimetableList(): { year: any; month: any; day?: any; id?: any }[] {
    const isWeekMode = tableMode.value === 'week';

    if (tableMode.value === 'monthRange') {
      const monthRangeData = monthRange?.value || getSomeNextMonths(year?.value, month?.value, 3);

      return monthRangeData.map((item: string) => {
        const [rangeYear, rangeMonth] = item.split('-');
        return { year: rangeYear, month: rangeMonth };
      });
    }

    if (isWeekMode) {
      const [prevYear, prevMonth, prevDay] = getPrevDate(year.value, month.value, day.value);
      const [nextYear, nextMonth, nextDay] = getNextDate(year.value, month.value, day.value);
      return [
        {
          year: prevYear,
          month: prevMonth,
          day: prevDay,
          id: `${prevYear}-${prevMonth}-${prevDay}`,
        },
        {
          year: year.value,
          month: month.value,
          day: day.value,
          id: `${year.value}-${month.value}-${day.value}`,
        },
        {
          year: nextYear,
          month: nextMonth,
          day: nextDay,
          id: `${nextYear}-${nextMonth}-${nextDay}`,
        },
      ];
    }

    if (!useSwipeInner.value) {
      return [
        {
          year: year.value,
          month: month.value,
          day: day.value,
          id: `${year.value}-${month.value}-${day.value}`,
        },
      ];
    }

    const [prevYear, prevMonth] = getPrevDate(year.value, month.value);
    const [nextYear, nextMonth] = getNextDate(year.value, month.value);
    return [
      { year: prevYear, month: prevMonth, id: `${prevYear}-${prevMonth}` },
      { year: year.value, month: month.value, id: `${year.value}-${month.value}` },
      { year: nextYear, month: nextMonth, id: `${nextYear}-${nextMonth}` },
    ];
  }

  function nextMonthChange(_currentYear: number | string, currentMonth: number | string) {
    if (tableMode.value === 'week') {
      const nextDate = getDateByCount(`${year.value}-${month.value}-${day.value}`, 7);
      const [nextYear, nextMonth, nextDay] = date2ymd(nextDate);
      year.value = nextYear;
      month.value = nextMonth;
      day.value = nextDay;

      emit('nextMonth', nextYear, nextMonth, nextDay);
      return emit('onMonthChange', nextYear, nextMonth, nextDay);
    }
    const nextMonth = computedNextMonth(currentMonth);
    month.value = nextMonth;
    year.value = nextMonth === 1 ? Number(year.value) + 1 : year.value;

    emit('nextMonth', year.value, month.value, day.value);
    emit('onMonthChange', year.value, month.value, day.value);
  }

  function nextYearChange(_currentYear: number, currentMonth: number) {
    if (tableMode.value === 'week') {
      const nextDate = getDateByCount(`${year.value}-${month.value}-${day.value}`, 7);
      const [prevYear, prevMonth, prevDay] = date2ymd(nextDate);
      year.value = prevYear + 1;
      month.value = prevMonth;
      day.value = prevDay;

      emit('nextYear', prevYear + 1, prevMonth, prevDay, day.value);
      return emit('onYearChange', prevYear + 1, prevMonth, prevDay, day.value);
    }

    year.value = Number(year.value) + 1;
    month.value = currentMonth;

    emit('nextYear', year.value, currentMonth, day.value);
    emit('onYearChange', year.value, currentMonth, day.value);
  }

  function prevMonthChange(_currentYear: number | string, currentMonth: number | string) {
    if (tableMode.value === 'week') {
      const nextDate = getDateByCount(`${year.value}-${month.value}-${day.value}`, -7);
      const [prevYear, prevMonth, prevDay] = date2ymd(nextDate);
      year.value = prevYear;
      month.value = prevMonth;
      day.value = prevDay;

      emit('prevMonth', prevYear, prevMonth, prevDay);
      return emit('onMonthChange', prevYear, prevMonth, prevDay);
    }
    const prevMonth = computedPrevMonth(currentMonth);
    month.value = prevMonth;
    year.value = prevMonth === 12 ? Number(year.value) - 1 : year.value;

    emit('prevMonth', year.value, month.value, day.value);
    emit('onMonthChange', year.value, month.value, day.value);
  }

  function prevYearChange(_currentYear: number, currentMonth: number) {
    if (tableMode.value === 'week') {
      const nextDate = getDateByCount(`${year.value}-${month.value}-${day.value}`, -7);
      const [prevYear, prevMonth, prevDay] = date2ymd(nextDate);
      year.value = prevYear - 1;
      month.value = prevMonth;
      day.value = prevDay;

      emit('prevYear', prevYear - 1, prevMonth, prevDay);
      return emit('onYearChange', prevYear - 1, prevMonth, prevDay);
    }

    year.value = Number(year.value) - 1;
    month.value = currentMonth;

    emit('prevYear', year.value, currentMonth, day.value);
    emit('onYearChange', year.value, currentMonth, day.value);
  }

  function selectMonth(selectedYear: number, selectedMonth: number) {
    year.value = selectedYear;
    month.value = selectedMonth;
    emit('selectMonth', selectedYear, selectedMonth);
  }

  function selectYear(selectedYear: number, selectedMonth: number) {
    year.value = selectedYear;
    month.value = selectedMonth;
    emit('selectYear', selectedYear, selectedMonth);
  }

  function containerChange(element: any) {
    timetableHeight.value = element?.clientHeight;
  }

  function onSelect(param: any) {
    selectDateInner.value = param;

    emit('onSelect', param);
    delay().then(refreshRender);
  }

  function refreshRender() {
    timestamp.value = +new Date();
  }

  function onToolsMonthChange(...param: any) {
    emit('onMonthChange', ...param);
  }

  function monthChange(param: any) {
    const { prevMonthDay, nextMonthDay } = param || {};
    if (nextMonthDay) {
      nextMonthChange(year.value, month.value);
      return emit('nextMonth', year.value, month.value);
    }
    if (prevMonthDay) {
      prevMonthChange(year.value, month.value);
      emit('prevMonth', year.value, month.value);
    }
  }

  function render(renderYear: number, renderMonth: number, renderDay?: number) {
    if (renderYear && renderMonth) {
      year.value = renderYear;
      month.value = renderMonth;
    }

    if (renderDay) {
      day.value = renderDay;
    }
  }

  function setToday() {
    if (tableMode.value === 'monthRange') return;

    const [todayY, todayM, todaytD] = getToday(true) as number[];
    render(todayY, todayM, todaytD);
  }

  function setDay(year, month, day) {
    if (tableMode.value === 'monthRange') return;

    render(year, month, day);
  }

  watch([year, month, day], () => {
    timetableList.list = getTimetableList();
  });

  watch(
    () => props.selectDate,
    () => {
      selectDateInner.value = selectDate?.value;
    },
  );

  watch(tableMode, () => {
    if (tableMode.value === 'monthRange') {
      useSwipeInner.value = false;
    }
    timetableList.list = getTimetableList();
    refreshRender();
  });

  watch(
    () => [
      props.begin,
      props.end,
      props.disabled,
      props.holidays,
      remarks,
      props.remarks,
      props.customDays,
    ],
    () => {
      refreshRender();
    },
  );

  watch(tileContent, () => {
    refreshRender();
  });

  if (Object.keys(props.tileContent).length) {
    watch(props.tileContent, () => {
      refreshRender();
    });
  }

  watch([weeks, monFirst], () => {
    weeksInner.value = computedWeek();
  });

  defineExpose({ setToday, setDay });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-calendar';
  @prefix-timetable-cls: ~'@{namespace}-calendar-timetable';

  .@{prefix-cls} {
    position: relative;
    &.@{prefix-cls}-mode-week {
      .@{prefix-timetable-cls} {
        .@{prefix-timetable-cls}-wrap {
          .@{prefix-timetable-cls}-content {
            .@{prefix-timetable-cls}-background {
              font-size: 80px;
            }
          }
        }
      }
    }
  }
</style>
