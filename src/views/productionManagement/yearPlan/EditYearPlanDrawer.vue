<template>
  <BasicDrawer
    v-bind="$attrs"
    :title="title"
    width="80%"
    show-footer
    @register="registerDrawer"
    @close="closeDrawer"
  >
    <div class="w-750px mx-auto">
      <Steps :current="current">
        <Steps.Step title="选择产品" />
        <Steps.Step title="录入计划" />
        <Steps.Step title="确认" />
      </Steps>
    </div>

    <div class="mt-5">
      <Step1
        ref="Step1Ref"
        v-show="current === 0"
        :editId="editId"
        :monthDetailsData="monthDetailsData"
        :productionList="productionList"
      />
      <Step2
        v-show="current === 1 && state.initStep2"
        :schemas="step2Schemas"
        :monthDetailsData="monthDetailsData"
        :monthWorkDays="monthWorkDays"
      />
      <Step3 v-if="state.initStep3" v-show="current === 2" @redo="handleRedo" />
    </div>

    <template #footer>
      <a-button v-show="current !== 0" @click="handleStepPrev">上一步</a-button>
      <a-button :loading="loading" @click="handleStepNext">
        {{ current === 2 ? '确认' : '下一步' }}
      </a-button>
    </template>
  </BasicDrawer>
</template>

<script lang="ts" setup name="EditYearPlanDrawer">
  import { ref, reactive, nextTick } from 'vue';
  import { Steps } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getYearPlanMonthDetailApi } from '/@/api/production/yearPlan';
  import { getProductionListApi } from '/@/api/production/basic';
  import { ProductionBaseModel } from '/@/api/production/model/basicModel';
  import { getCalendarsStatisticsApi } from '/@/api/info/calendar';
  import { CalendarStatisticsItemModel } from '/@/api/info/model/calendarModel';
  import { dateUtil } from '/@/utils/dateUtil';
  import { MonthDetailData } from './types';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';

  const { createMessage } = useMessage();
  const loading = ref(false);
  const title = ref('');
  const editId = ref<number | undefined>(undefined);
  const monthDetailsData = ref<MonthDetailData | null>(null);
  const productionList = ref<ProductionBaseModel[]>([]);
  const monthWorkDays = ref<CalendarStatisticsItemModel[]>([]);

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (record: { id?: number }) => {
    setDrawerProps({ loading: true });
    try {
      console.log('recordId :>> ', record);
      editId.value = record.id;
      title.value = record.id ? '编辑年度计划' : '新建年度计划';
      const { items } = await getProductionListApi({ typeArr: [0, 1], ascending: true });
      productionList.value = items || [];

      if (!record.id) return;
      const { year, memo, monthProductions } = await getYearPlanMonthDetailApi(record.id);
      const month_productions = monthProductions || [];
      month_productions.forEach((v) => {
        (v as unknown as Record<string, string>).productTypeText =
          v.productType === 0 ? '原煤' : '洗选煤种';
      });

      monthDetailsData.value = {
        year: `${year}-01-01 00:00:00`,
        memo,
        monthProductions: month_productions || [],
      };
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  const Step1Ref = ref();
  const current = ref(0);
  const step2Schemas = ref(null);

  const state = reactive({
    initStep2: false,
    initStep3: false,
  });

  async function handleStep1Next() {
    loading.value = true;
    try {
      const data = await Step1Ref.value?.submit();
      if (!data) return;

      const { items } = await getCalendarsStatisticsApi({
        year: ~~dateUtil(data.year).format('YYYY'),
      });
      if (!items || !items.length) {
        createMessage.error('工作日历设置有误，请完善信息');
        return;
      }
      await nextTick();

      step2Schemas.value = data.productions;
      monthWorkDays.value = items;

      current.value++;
      state.initStep2 = true;
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }

  function handleStepPrev() {
    current.value--;
  }

  function handleStep2Next(step2Values: any) {
    current.value++;
    state.initStep3 = true;
    console.log(step2Values);
  }

  function handleRedo() {
    current.value = 0;
    state.initStep2 = false;
    state.initStep3 = false;
  }

  async function handleStepNext() {
    if (current.value === 0) {
      await handleStep1Next();
    } else if (current.value === 1) {
      handleStep2Next();
    }
  }

  function closeDrawer() {
    Step1Ref.value?.reset();
  }
</script>
