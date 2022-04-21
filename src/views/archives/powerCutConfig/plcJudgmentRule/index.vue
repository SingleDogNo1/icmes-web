<template>
  <div class="plc-judgment-rule">
    <BasicForm class="bg-white" @register="register" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'PlcJudgmentRule',
  };
</script>

<script lang="ts" setup>
  import { ref, Ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas } from './data';
  import { GetPowerJudgmentParams } from '/@/api/info/model/plcJudgmentModel';

  const searchData = ref({}) as Ref<GetPowerJudgmentParams>;

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  function handleSubmit() {
    const value = getFieldsValue() as GetPowerJudgmentParams;
    searchData.value = value;
  }
</script>

<style lang="less" scoped>
  .plc-judgment-rule {
    color: red;
  }
</style>
