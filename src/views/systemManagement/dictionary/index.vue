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
        <DictType
          :search-data="searchData"
          @select-row="handleSelectRow"
          @change-page="handleChangeDictTypePage"
        />
      </Col>
      <Col :span="12" class="pr-4">
        <DictData :select-row="selectedRow" />
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, Ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemas } from './data';
  import { Row, Col } from 'ant-design-vue';
  import DictType from './components/dictType.vue';
  import DictData from './components/dictData.vue';
  import { GetDictTypesParam, GetDictDataParam } from '/@/api/info/model/dictModel';

  const { prefixCls } = useDesign('dict');

  let searchData = ref({}) as Ref<GetDictTypesParam>;
  const selectedRow = ref({}) as Ref<GetDictDataParam>; // 点击选中行的数据

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  function handleSubmit() {
    nextTick(() => {
      const value = getFieldsValue() as GetDictTypesParam;
      searchData.value = value;
    });
  }

  function handleSelectRow(row) {
    selectedRow.value = {
      ascending: true,
      orderBy: 'order',
      pageNo: 1,
      pageSize: 10,
      typeCode: row.code,
    };
  }

  function handleChangeDictTypePage(page) {
    const value = getFieldsValue() as GetDictTypesParam;

    const form = Object.assign(value, page);
    console.log('searchData :>> ', form);
    searchData.value = form;
  }

  handleSubmit();
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-dict';
  @form-prefix-cls: ~'@{namespace}-dict-form';
  @content-prefix-cls: ~'@{namespace}-dict-content-wrapper';

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
