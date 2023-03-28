<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="查看年度计划"
    width="80%"
    show-footer
  >
    <div class="w-750px mx-auto">
      <Steps :current="current">
        <Steps.Step title="选择产品" />
        <Steps.Step title="录入计划" />
        <Steps.Step title="确认" />
      </Steps>
    </div>

    <div class="mt-5">
      <Step1 ref="Step1Ref" @next="handleStep1Next" v-show="current === 0" />
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

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (record) => {
    setDrawerProps({ loading: true });
    try {
      console.log('record :>> ', record);
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
</script>
