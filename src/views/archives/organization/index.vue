<template>
  <div :class="prefixCls">
    <BasicForm
      class="bg-white"
      :class="`${prefixCls}-form`"
      @register="register"
      @submit="handleSubmit"
    />

    <Row :class="`${prefixCls}-content-wrapper`" :gutter="16">
      <Col :span="8">
        <OrganizationTree @select="handleSelect" />
      </Col>
      <Col :span="16" class="pr-4">
        <OrganizationTable
          :data="tableData.list"
          :total-pages="tableData.totalPages"
          :total-count="tableData.totalCount"
          :loading="loading"
          @change-page="handleChangePage"
          @del-row="handleDelOrg"
        />
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ArchivesOrganization',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref, unref, nextTick, reactive } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas } from './data';
  import OrganizationTree from './components/organizationTree.vue';
  import OrganizationTable from './components/organizationTable.vue';
  import { getOrganizationsListApi } from '/@/api/info/organizations';

  const { prefixCls } = useDesign('organization');
  const loading = ref(false);
  const searchForm = ref({});
  let tableData = reactive<{ list: any[]; totalPages: number; totalCount: number }>({
    list: [],
    totalPages: 0,
    totalCount: 0,
  });

  const [register, { getFieldsValue, setFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  onMounted(async () => {
    await nextTick();
    searchForm.value = getFieldsValue();

    getOrganizationsList(unref(searchForm));
  });

  async function getOrganizationsList(params) {
    loading.value = true;

    try {
      const { items, totalCount, totalPages } = await getOrganizationsListApi(params);

      tableData.list = items || [];
      tableData.totalPages = totalPages;
      tableData.totalCount = totalCount;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleChangePage({ pageNo, pageSize }) {
    const form = { ...searchForm.value, ...{ pageNo, pageSize } };
    setFieldsValue(form);
    getOrganizationsList(form);
  }

  async function handleSelect(nodeId) {
    const form = { ...searchForm.value, ...{ parentId: nodeId } };
    setFieldsValue(form);
    getOrganizationsList(form);
  }

  async function handleDelOrg(row) {
    // 删除组织机构的回调
    console.log('del success :>> ', row);
  }

  function handleSubmit(value) {
    console.log('value :>> ', value);
    getOrganizationsList(value);
  }
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-organization';
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
