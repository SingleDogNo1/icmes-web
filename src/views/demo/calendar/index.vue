<template>
  <Row :gutter="16">
    <Col :span="6">
      <Calendar
        ref="CalendarRef"
        backgroundText
        :lunar="false"
        :completion="completion"
        :disabled="disabled"
        :format="formatOfSelecteMode"
        :holidays="holidays"
        :select-date="selectModeDate"
        @select-year="selectYear"
        @select-month="selectMonth"
        @next="next"
        @prev="prev"
        @on-month-change="onMonthChange"
        @on-select="onSelect"
      />
    </Col>
    <Col :span="6">
      <Calendar
        selectMode="multi"
        :tile-content="multiTileContent"
        :select-date="multiModeDate"
        :begin="begin"
        :end="end"
        @on-select="onSelect"
      />
    </Col>
    <Col :span="6">
      <Calendar
        selectMode="multi"
        :tile-content="multiTileContent"
        :select-date="multiModeDate"
        :begin="begin"
        :end="end"
        @on-select="onSelect"
      />
    </Col>
    <Col :span="6">
      <Calendar
        monFirst
        backgroundText
        selectMode="range"
        :lunar="true"
        :format="formatOfRangeMode"
        :select-date="rangeModeDate"
        @on-select="onSelect"
      />
    </Col>
    <Col :span="6">
      <Calendar
        monFirst
        :completion="completion"
        backgroundText
        selectMode="multiRange"
        :select-date="multiRangeModeDate"
        :format="formatOfmultiMode"
        :weeks="weeks"
        @on-select="onSelect"
      />
    </Col>
    <Col :span="6">
      <Calendar backgroundText :lunar="true" selectMode="range" mode="week" />
    </Col>
    <Col :span="6">
      <!-- <Calendar backgroundText selectMode="range" mode="monthRange" :monthRange="monthRange" /> -->
    </Col>
  </Row>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { Calendar } from '/@/components/Business';

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const holidays = ref({
    '1-1': 'New Year',
    '2-2': 'Wetlands',
    '2-14': 'Valentine',
    '3-8': 'Women',
    '4-1': 'April Fools',
    '4-22': 'World Earth',
    '5-1': 'Labour',
    '6-1': 'Children',
    '8-1': 'Youth',
    '10-5': 'World Teachers',
    '10-31': 'Halloween',
    '12-25': 'Christmas',
  });

  const completion = ref(false);
  const getRandom = () => Math.floor(Math.random() * (28 - 1 + 1)) + 1;
  const selectModeDate = ref(`${currentYear}-${currentMonth}-${getRandom()}`);
  const multiModeDate = ref([
    `${currentYear}-${currentMonth}-${getRandom()}`,
    `${currentYear}-${currentMonth}-${getRandom()}`,
    `${currentYear}-${currentMonth}-${getRandom()}`,
  ]);
  const rangeModeDate = ref({
    start: `${currentYear}-${currentMonth}-10`,
    end: `${currentYear}-${currentMonth}-14`,
  });
  const multiRangeModeDate = ref([
    { start: `${currentYear}-${currentMonth}-8`, end: `${currentYear}-${currentMonth}-12` },
    { start: `${currentYear}-${currentMonth}-20`, end: `${currentYear}-${currentMonth}-23` },
  ]);
  const weeks = ['一', '二', '三', '四', '五', '六', '日'];
  const CalendarRef = ref(null);
  const begin = ref('2021-1-13');
  const end = ref('2025-2-13');
  // const monthRange = ref(['2021-1', '2021-6', '2021-12']);
  const disabled = ref(['2022-2-2', '2022-2-4', '2022-2-23']);
  const multiTileContent = ref({
    [`${currentYear}-${currentMonth}-${currentDay}`]: {
      className: 'content-item-classname',
      content: 'some things',
    },
  });

  function onSelect(selectDate) {
    console.log(selectDate, 'selectDate');
  }

  // function backToToday() {
  //   nextTick(() => {
  //     console.log('weekModeRef :>> ', CalendarRef.value);
  //   });
  //   // weekModeRef.value.setToday();
  // }

  function formatOfSelecteMode(year, month) {
    const transform = {
      1: 'Jan',
      2: 'Feb',
      3: 'Mar',
      4: 'Apr',
      5: 'May',
      6: 'Jun',
      7: 'Jul',
      8: 'Aug',
      9: 'Sept',
      10: 'Oct',
      11: 'Nov',
      12: 'Dec',
    };
    return [`${year}`, `${transform[month]}`];
  }
  function formatOfRangeMode(year, month) {
    const transform = {
      1: '一',
      2: '二',
      3: '三',
      4: '四',
      5: '五',
      6: '六',
      7: '七',
      8: '八',
      9: '九',
      10: '十',
      11: '十一',
      12: '十二',
    };
    return [`${year}年`, `${transform[month]}月`];
  }
  function formatOfmultiMode(year, month) {
    return [`${year}年`, `${month}月`];
  }
  function selectYear(y, m) {
    console.log(y, m, 'selectYear');
  }
  function onMonthChange(y, m) {
    console.log(y, m, 'onMonthChange');
  }
  function selectMonth(y, m) {
    console.log(y, m, 'selectMonth');
  }
  function next(y, m, d) {
    console.log(y, m, d, 'nextnext');
  }
  function prev(y, m, d) {
    console.log(y, m, d, 'prevprev');
  }
</script>
