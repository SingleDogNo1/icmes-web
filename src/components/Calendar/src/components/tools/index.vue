<template>
  <div :class="prefixCls" ref="toolsRef" v-if="tableMode !== 'monthRange'">
    <div :class="`${prefixCls}-container`">
      <div :class="`${prefixCls}-prev`">
        <FastBackwardOutlined class="mr-2" @click="prevYear" />
        <StepBackwardOutlined @click="prevMonth" />
      </div>

      <div :class="`${prefixCls}-info`">
        <div class="cursor-pointer" @click.stop="switchDate">
          <span>{{ formatText[0] }}</span>
          <span>{{ formatText[1] }}</span>
        </div>
      </div>

      <div :class="`${prefixCls}-next`">
        <StepForwardOutlined class="mr-2" @click="nextMonth" />
        <FastForwardOutlined @click="nextYear" />
      </div>
    </div>

    <div
      :class="[`${prefixCls}-picker`, { show: pickerVisible }]"
      :style="{
        height:
          toolsStyle.timetableHeight + toolsStyle.weekHeadHeight + toolsStyle.toolsHeight + 'px',
        paddingTop: toolsStyle.toolsHeight + 'px',
      }"
    >
      <div :class="['months', { 'week-switch-months': weekSwitch }]">
        <span
          v-for="(m, i) in months"
          :key="i"
          @click.stop="selectMonth(i + 1)"
          :class="{ active: i + 1 === month }"
        >
          <i>{{ m }}</i>
        </span>
      </div>
      <div class="years">
        <span
          v-for="y in years"
          :key="y"
          @click.stop="selectYearHandle(y)"
          :class="{ active: y === year }"
        >
          <i>{{ y }}</i>
        </span>
      </div>
    </div>
    <div :class="`${prefixCls}-week-container`">
      <div v-for="(weekItem, index) in weeks" :key="index" :class="`${prefixCls}-week-item`">{{
        weekItem
      }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'CalendarTools',
  };
</script>

<script lang="ts" setup>
  import { ref, reactive, watch, toRefs } from 'vue';
  import {
    StepBackwardOutlined,
    StepForwardOutlined,
    FastBackwardOutlined,
    FastForwardOutlined,
  } from '@ant-design/icons-vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = defineProps({
    months: {
      type: Array,
    },
    weeks: {
      type: Array,
    },
    weekSwitch: {
      type: Boolean,
      default: false,
    },
    monFirst: {
      type: Boolean,
      default: false,
    },
    format: {
      type: Function,
    },
    tableMode: {
      type: String,
      default: 'month',
    },
    year: {
      type: Number,
    },
    month: {
      type: Number,
    },
    timetableHeight: {
      type: Number,
    },
  });

  const emit = defineEmits([
    'nextMonth',
    'nextYear',
    'prevMonth',
    'prevYear',
    'selectMonth',
    'selectYear',
    'onMonthChange',
  ]);
  const { prefixCls } = useDesign('calendar-tools');
  const { prefixCls: timetableCls } = useDesign('calendar-timetable');

  const { year, month, tableMode } = toRefs(props);
  const pickerVisible = ref(false);
  const toolsStyle = reactive({
    toolsContainerHeight: 0,
    toolsHeight: 0,
    timetableHeight: 0,
    weekHeadHeight: 0,
  });
  const toolsRef = ref();
  const formatText = ref([] as string[]);
  const years = ref(createYears(year?.value as number));

  function selectMonth(selectedMonth: number) {
    pickerVisible.value = false;
    emit('selectMonth', year?.value, selectedMonth);
    emit('onMonthChange', year?.value, selectedMonth);
  }

  function selectYearHandle(selectedYear: number) {
    pickerVisible.value = false;
    years.value = createYears(selectedYear);
    emit('selectYear', selectedYear, month?.value);
    emit('onMonthChange', selectedYear, month?.value);
  }

  function nextMonth() {
    emit('nextMonth', year?.value, month?.value);
  }

  function nextYear() {
    emit('nextYear', year?.value, month?.value);
  }

  function prevMonth() {
    emit('prevMonth', year?.value, month?.value);
  }

  function prevYear() {
    emit('prevYear', year?.value, month?.value);
  }

  function switchDate() {
    if (tableMode.value === 'week') return;

    const containerCls = `${prefixCls}-container`;
    const weeksContainerCls = `${prefixCls}-week-container`;

    toolsStyle.toolsContainerHeight = toolsRef.value.clientHeight;
    toolsStyle.toolsHeight = toolsRef.value.querySelector(`.${containerCls}`).clientHeight;
    toolsStyle.weekHeadHeight = toolsRef.value.querySelector(`.${weeksContainerCls}`).clientHeight;
    toolsStyle.timetableHeight = toolsRef.value.parentNode.querySelector(
      `.${timetableCls}.current`,
    ).clientHeight;
    pickerVisible.value = !pickerVisible.value;
  }

  function formatYearAndMonth() {
    const { format } = props;
    if (format) {
      return (formatText.value = format(year?.value, month?.value));
    }
    formatText.value = [`${year?.value}-`, `${month?.value}`];
  }

  formatYearAndMonth();

  watch(year!, () => {
    formatYearAndMonth();
  });

  watch(month!, () => {
    formatYearAndMonth();
    if (pickerVisible.value) {
      setTimeout(() => {
        toolsStyle.timetableHeight = toolsRef.value.parentNode.querySelector(
          `.${timetableCls}.current`,
        ).clientHeight;
      });
    }
    if (!years.value.includes(year?.value as number)) {
      years.value = createYears(year?.value as number);
    }
  });

  function createYears(creatorYear: number) {
    const yearRange: number[] = [];
    for (let i = creatorYear - 7; i < creatorYear + 8; i++) {
      yearRange.push(i);
    }
    return yearRange;
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-calendar-tools';

  .@{prefix-cls} {
    @apply w-full select-none relative bg-white;

    .@{prefix-cls}-container {
      @apply w-full h-10 flex items-center bg-primary text-white relative px-3 z-10 text-xl leading-10 shadow-sm;

      .@{prefix-cls}-info {
        @apply text-base h-full flex-1 flex justify-center items-center;
      }

      .@{prefix-cls}-next,
      .@{prefix-cls}-prev {
        @apply h-full flex items-center;
        span {
          cursor: pointer;
        }
      }
    }

    .@{prefix-cls}-picker {
      @apply text-primary opacity-0 absolute top-0 bg-white w-full h-full hidden box-border z-4;

      &.show {
        @keyframes pickerShow {
          from {
            top: -30%;
            opacity: 0;
          }

          to {
            top: 0;
            opacity: 1;
          }
        }
        display: block;
        animation: pickerShow 0.3s cubic-bezier(0.075, 0.82, 0.165, 1) both;
      }

      > div {
        height: 50%;
      }

      .months {
        @apply flex flex-wrap relative box-border;
        padding: 10px 5px;

        .active {
          i {
            @apply bg-primary text-white rounded shadow;
          }
        }

        &:after {
          content: '';
          display: block;
          width: 94%;
          height: 1px;
          background-color: @border-color-split;
          position: absolute;
          bottom: 0;
          left: 3%;
        }

        span {
          flex-basis: 25%;
          text-align: center;
          font-size: 16px;
          position: relative;

          i {
            position: absolute;
            font-style: normal;
            text-align: center;
            word-break: keep-all;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);
            padding: 5% 22%;
            cursor: pointer;
          }
        }
      }

      .years {
        @apply flex flex-wrap  box-border;
        padding: 10px 5px;

        .active {
          i {
            @apply bg-primary text-white rounded shadow;
          }
        }

        span {
          flex-basis: 20%;
          text-align: center;
          margin-bottom: 10px;
          font-size: 16px;
          position: relative;

          i {
            position: absolute;
            font-style: normal;
            text-align: center;
            word-break: keep-all;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);
            padding: 5% 22%;
            cursor: pointer;
          }
        }
      }
    }

    .@{prefix-cls}-week-container {
      @apply w-full flex items-center;
      height: 30px;
      padding-top: 10px;
      .@{prefix-cls}-week-item {
        @apply flex-1 text-center;
      }
    }
  }
</style>
