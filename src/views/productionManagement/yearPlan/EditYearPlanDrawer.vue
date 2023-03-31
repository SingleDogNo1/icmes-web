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
        :monthDetailsData="monthDetailsData"
        :productionList="productionList"
        @next="handleStep1Next"
        v-show="current === 0"
      />
      <Step2
        @prev="handleStepPrev"
        @next="handleStep2Next"
        v-show="current === 1"
        v-if="state.initStep2"
      />
      <Step3 v-show="current === 2" @redo="handleRedo" v-if="state.initStep3" />
    </div>

    <template #footer>
      <a-button>上一步</a-button>
      <a-button @click="handleStepNext">下一步</a-button>
      <a-button>确认</a-button>
    </template>
  </BasicDrawer>
</template>

<script lang="ts" setup name="EditYearPlanDrawer">
  import { ref, reactive } from 'vue';
  import { Steps } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import { getYearPlanMonthDetailApi } from '/@/api/production/yearPlan';
  import { ProductionYearPlanMonthFullModel } from '/@/api/production/model/yearPlanModel';
  import { getProductionListApi } from '/@/api/production/basic';
  import { ProductionBaseModel } from '/@/api/production/model/basicModel';

  interface MonthDetailData {
    year: string; // 接口返回当前年份的数字(2023)，需要转换成 YYYY-MM-DD HH:mm:ss 以供 antd 正常解析
    memo: ProductionYearPlanMonthFullModel['memo'];
    monthProductions: ProductionYearPlanMonthFullModel['monthProductions'];
  }

  const title = ref('');
  const monthDetailsData = ref<MonthDetailData | null>(null);
  const productionList = ref<ProductionBaseModel[]>([]);

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (record: { id?: number }) => {
    setDrawerProps({ loading: true });
    try {
      console.log('recordId :>> ', record);
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
        monthProductions: monthProductions || [],
      };
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  const Step1Ref = ref();
  const current = ref(0);

  const state = reactive({
    initStep2: false,
    initStep3: false,
  });

  function handleStep1Next(step1Values: any) {
    console.log('step1Values: >>', step1Values);
    current.value++;
    state.initStep2 = true;
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
    const data = await Step1Ref.value?.submit();
    if (!data) return;
    console.log('data :>> ', data);
  }

  function closeDrawer() {
    Step1Ref.value?.reset();
  }
</script>
