<template>
  <PageWrapper contentFullHeight dense class="bg-white">
    <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center">
      <Calendar
        class="w-2/3 -mt-10 shadow-md border"
        ref="calendarRef"
        backgroundText
        :format="format"
        :lunar="false"
        :selectDate="selectedDate"
        :customDays="customDays"
        @on-select="handleSelect"
        @on-year-change="yearChange"
        @on-month-change="monthChange"
      />

      <Radio.Group
        v-model:value="radio"
        class="ctrl-btn"
        :disabled="!edit_permission"
        @change="handleChangeStatus as any"
      >
        <Radio class="work-day" :value="0">生产日</Radio>
        <Radio class="repair-day" :value="1">检修日</Radio>
        <Radio class="rest-day" :value="2">休息日</Radio>
      </Radio.Group>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'WorkCalendar',
  };
</script>

<script lang="ts" setup>
  import { ref, PropType, watch, toRefs, unref, nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Calendar } from '/@/components/Calendar';
  import { Radio } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import type { Date } from './types';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateCalendarsStatisticsApi } from '/@/api/info/calendar';

  enum DayTypeEnum {
    /** 生产日 */
    WORK = 0,
    /** 检修日 */
    REPAIR = 1,
    /** 休息日 */
    REST = 2,
  }

  const props = defineProps({
    tableData: {
      type: Array as PropType<{ [index: string]: any }[]>,
      required: true,
    },
    date: {
      type: Object as PropType<Date>,
      required: true,
    },
  });
  const emit = defineEmits(['calendar-change', 'data-updated']);

  const { createMessage } = useMessage();
  const { date, tableData } = toRefs(props);
  const edit_permission = useUserStore().getFeature[25300]?.CALENDAR_EDIT;
  const format = (year, month) => [`${year}年`, `${month}月`];
  const radio = ref(0);
  const customDays = ref();
  const calendarRef = ref();

  // 当前选中的日期, 格式 YYYY-M-D
  const selectedDate = ref(`${date.value.year}-${date.value.month}-${date.value.day}`);

  function handleSelect(date: string) {
    selectedDate.value = date;

    // 获取当前选择的日期, 和保存的 tableData 对应月的详细数据作比对. 如果查询有类型,显示类型, 没有类型默认为生产日
    const [_year, month, day] = date.split('-');
    const daysMap = (
      tableData.value[Number(month) - 1].dayDetails as { day: number; dayType: number }[]
    ).reduce((res, pre) => {
      res[pre.day] = pre.dayType;
      return res;
    }, {} as { [index: string]: number });

    for (const key in daysMap) {
      const value = daysMap[key];

      if (key === day) {
        radio.value = value;
        return;
      } else {
        radio.value = 0;
      }
    }
  }

  function yearChange(year, month, day) {
    emit('calendar-change', year, month, day);
  }

  function monthChange(year, month, day) {
    emit('calendar-change', year, month, day);
  }

  async function handleChangeStatus(e: Event) {
    const dayType = (e.target as unknown as { [index: string]: number })?.value;
    const [year, month, day] = unref(selectedDate).split('-');

    try {
      await updateCalendarsStatisticsApi(day, {
        date: year + '_' + month,
        dayType,
        versionTag: '00000000-0000-0000-0000-000000000000',
      });

      emit('data-updated');
      createMessage.success('修改成功');
    } catch (error: any) {
      throw new Error(error);
    }
  }

  watch(
    () => props.tableData,
    (tableData) => {
      const list = tableData?.reduce(
        (res, pre, index) => {
          pre.dayDetails.map((val) => {
            if (val.dayType === DayTypeEnum.WORK) {
              res.workDay.push(`${date.value.year}-${index + 1}-${val.day}`);
            } else if (val.dayType === DayTypeEnum.REPAIR) {
              res.repairDay.push(`${date.value.year}-${index + 1}-${val.day}`);
            } else if (val.dayType === DayTypeEnum.REST) {
              res.restDay.push(`${date.value.year}-${index + 1}-${val.day}`);
            }
          });
          return res;
        },
        {
          workDay: [],
          repairDay: [],
          restDay: [],
        } as { [index: string]: string[] },
      );

      customDays.value = list;
    },
    {
      immediate: true,
    },
  );

  watch(
    () => props.date,
    (val) => {
      console.log('val :>> ', val);
      nextTick(() => {
        unref(calendarRef).setDay(val.year, val.month, val.day);
      });
    },
  );
</script>

<style lang="less" scoped>
  @import './mixins.less';

  @prefix-cls: ~'@{namespace}-calendar-timetable';
  @gray: #999;
  // @gray: @text-color-secondary;

  :deep(.@{prefix-cls}) {
    .custom-calendar-date(workDay, @gray);
    .custom-calendar-date(repairDay, @success-color);
    .custom-calendar-date(restDay, @error-color);
  }

  .ctrl-btn {
    @apply block mx-auto mt-4 text-center;

    .custom-ctrl-btn(work-day, @gray);
    .custom-ctrl-btn(repair-day, @success-color);
    .custom-ctrl-btn(rest-day, @error-color);
  }
</style>
