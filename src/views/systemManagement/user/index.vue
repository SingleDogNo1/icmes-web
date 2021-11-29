<template>
  <div :class="prefixCls">
    <BasicForm
      class="bg-white"
      :class="`${prefixCls}-form`"
      @register="register"
      @submit="handleSubmit"
    />

    <Row :class="`${prefixCls}-content-wrapper`" :gutter="16">
      <Col :span="12">
        <UserTable
          :search-data="searchData"
          @change-page="handleChangeUserTablePage"
          @select-row="handleSelectRow"
        />
      </Col>
      <Col :span="12" class="pr-4">
        <UserDetail :selected-row="selectedRow" />
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, Ref, nextTick } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemas } from './data';
  import { Row, Col } from 'ant-design-vue';
  import UserTable from './components/userTable.vue';
  import UserDetail from './components/userDetail.vue';
  import { GetAccountListParams, AccountModel } from '/@/api/account/model/basicModel';

  const { prefixCls } = useDesign('user');
  const searchData = ref({}) as Ref<GetAccountListParams>;
  const selectedRow = ref({}) as Ref<AccountModel>; // 点击选中行的数据

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  function handleSubmit() {
    nextTick(() => {
      const value = getFieldsValue() as GetAccountListParams;
      searchData.value = value;
    });
  }

  function handleChangeUserTablePage(page) {
    const value = getFieldsValue() as GetAccountListParams;
    const form = { ...value, ...page };
    searchData.value = form;
  }

  function handleSelectRow(row: AccountModel) {
    selectedRow.value = row;
  }

  nextTick(() => {
    handleSubmit();
  });
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-user';
  @form-prefix-cls: ~'@{prefix-cls}-form';
  @content-prefix-cls: ~'@{prefix-cls}-content-wrapper';

  .@{prefix-cls} {
    @apply h-full flex flex-col overflow-hidden;
  }

  .@{form-prefix-cls} {
    padding: 20px 16px 0 !important;
  }

  .@{content-prefix-cls} {
    @apply flex-1;
  }
</style>
