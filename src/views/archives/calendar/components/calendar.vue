<template>
  <PageWrapper contentFullHeight dense class="bg-white">
    <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center">
      <Calendar
        class="w-2/3 -mt-10 shadow-md border"
        backgroundText
        :format="format"
        :lunar="false"
        :customDays="customDays"
        @on-select="onSelect"
        @on-year-change="yearChange"
        @on-month-change="monthChange"
      />

      <Radio.Group v-model:value="radio" class="ctrl-btn" :disabled="!edit_permission">
        <Radio class="work-day" :value="0">生产日</Radio>
        <Radio class="repair-day" :value="1">检修日</Radio>
        <Radio class="rest-day" :value="2">休息日</Radio>
      </Radio.Group>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, PropType, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Calendar } from '/@/components/Business';
  import { Radio } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import mitt from '/@/utils/mitt';

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
    year: {
      type: Number,
      required: true,
    },
  });
  // const emit = defineEmits(['calendar-change']);

  const emitter = mitt();
  const edit_permission = useUserStore().getFeature[25300]?.CALENDAR_EDIT;
  const format = (year, month) => [`${year}年`, `${month}月`];
  const radio = ref(0);
  const customDays = ref();

  watch(
    () => props.tableData,
    (tableData) => {
      const list = tableData?.reduce(
        (res, pre, index) => {
          pre.dayDetails.map((val) => {
            if (val.dayType === DayTypeEnum.WORK) {
              res.workDay.push(`${props.year}-${index + 1}-${val.day}`);
            } else if (val.dayType === DayTypeEnum.REPAIR) {
              res.repairDay.push(`${props.year}-${index + 1}-${val.day}`);
            } else if (val.dayType === DayTypeEnum.REST) {
              res.restDay.push(`${props.year}-${index + 1}-${val.day}`);
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

  function onSelect(selectDate) {
    console.log(selectDate, 'selectDate');
  }

  function yearChange(year, month, day) {
    // emit('calendar-change', year, month, day);
    emitter.emit('calendar-change', { year, month, day });
  }

  function monthChange(year, month, day) {
    emitter.emit('calendar-change', { year, month, day });
    // emit('calendar-change', year, month, day);
  }
</script>

<style lang="less" scoped>
  @import '../../../../../node_modules/ant-design-vue/lib/style/color/colorPalette.less';
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
