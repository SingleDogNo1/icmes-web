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
          :options="businessTypeOptions"
          allowClear
          style="width: 130px"
        />
      </template>
    </BasicForm>

    <Row :class="`${prefixCls}-content-wrapper`" :gutter="16">
      <Col :span="12">
        <WorkflowTable
          :search-data="searchData"
          @select-row="handleSelectRow"
          @change-page="handleChangeListTablePage"
        />
      </Col>
      <Col :span="12" class="pr-4">
        <WorkflowNode :selected-row="selectedRow" />
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'WorkflowIndex',
  };
</script>

<script lang="ts" setup>
  import { ref, Ref, nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getWorkflowsListSchemas } from './data';
  import { GetWorkflowsListParam, WorkFlowModel } from '/@/api/flow/model/workflowModel';
  import { Select, Row, Col } from 'ant-design-vue';
  import WorkflowTable from './components/table.vue';
  import WorkflowNode from './components/node.vue';
  import { useUserState } from '/@/hooks/web/useUserState';

  const { getDictOptions } = useUserState();

  // 业务类型
  const businessTypeOptions = getDictOptions('DT_BUSINESS_TYPE');
  businessTypeOptions.unshift({ label: '全部', value: '' });

  const { prefixCls } = useDesign('workflow');
  const searchData = ref({}) as Ref<GetWorkflowsListParam>;
  const selectedRow = ref({}) as Ref<WorkFlowModel>; // 点击选中行的数据

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    labelWidth: 100,
    schemas: getWorkflowsListSchemas,
    autoSubmitOnEnter: true,
  });

  async function handleSubmit() {
    const value = getFieldsValue() as GetWorkflowsListParam;
    searchData.value = value;
  }

  function handleChangeListTablePage(page) {
    const value = getFieldsValue() as GetWorkflowsListParam;
    const form = { ...value, ...page };
    searchData.value = form;
  }

  function handleSelectRow(row) {
    selectedRow.value = row;
  }

  nextTick(() => {
    handleSubmit();
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-workflow';
  @form-prefix-cls: ~'@{prefix-cls}-form';
  @content-prefix-cls: ~'@{prefix-cls}-content-wrapper';

  .@{form-prefix-cls} {
    padding: 20px 16px 0 !important;
  }

  .@{content-prefix-cls} {
    @apply flex-1;
  }
</style>
