<template>
  <PageWrapper content-full-height dense fixed-height>
    <BasicForm
      class="bg-white"
      :class="`${prefixCls}-form`"
      @register="register"
      @submit="handleSubmit"
    >
      <!-- 业务类型 -->
      <template #businessType="{ model, field }: any">
        <Select
          v-model:value="model[field]"
          :options="strategyTypeOptions"
          placeholder="请选择业务类型"
          allowClear
          style="width: 150px"
        />
      </template>
    </BasicForm>

    <Row :class="`${prefixCls}-content-wrapper`" :gutter="16">
      <Col :span="16">
        <StrategyList
          :search-data="searchData"
          @select-row="handleSelectRow"
          @change-page="handleChangeListTablePage"
        />
      </Col>
      <Col :span="8" class="pr-4">
        <ItemRulesTable :selected-row="selectedRow" />
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'SystemManagementStrategyEngine',
  };
</script>

<script lang="ts" setup>
  import { ref, Ref, nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getStrategyEngineListSchemas } from './data';
  import { GetStrategyListParams, StrategyModel } from '/@/api/info/model/strategyModel';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { Select, Row, Col } from 'ant-design-vue';
  import StrategyList from './components/strategyList.vue';
  import ItemRulesTable from './components/itemRules.vue';

  const { getDictOptions } = useUserState();

  // 业务类型
  const strategyTypeOptions = getDictOptions('STRATEGY_TYPE');

  const { prefixCls } = useDesign('strategy-engine');
  const searchData = ref({}) as Ref<GetStrategyListParams>;
  const selectedRow = ref({}) as Ref<StrategyModel>; // 点击选中行的数据

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas: getStrategyEngineListSchemas,
    autoSubmitOnEnter: true,
  });

  async function handleSubmit() {
    const value = getFieldsValue() as GetStrategyListParams;

    searchData.value = value;
  }

  nextTick(() => {
    handleSubmit();
  });

  function handleSelectRow(row) {
    selectedRow.value = row;
  }

  function handleChangeListTablePage(page) {
    const value = getFieldsValue() as GetStrategyListParams;
    const form = { ...value, ...page };
    searchData.value = form;
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-strategy-engine';
  @form-prefix-cls: ~'@{prefix-cls}-form';
  @content-prefix-cls: ~'@{prefix-cls}-content-wrapper';

  .@{form-prefix-cls} {
    padding: 20px 16px 0 !important;
  }

  .@{content-prefix-cls} {
    @apply flex-1;
  }
</style>
