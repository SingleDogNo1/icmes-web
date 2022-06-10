<template>
  <div :class="prefixCls">
    <Row :class="`${prefixCls}-content-wrapper`" :gutter="16">
      <Col :span="8"> <LocationTree ref="locationTreeRef" @select="handleSelect" /> </Col
      ><Col :span="16">
        <LocationTable
          :data="tableData.items"
          :total-pages="tableData.totalPages"
          :total-count="tableData.totalCount"
          :loading="loading"
          @change-page="handleChangePage"
          @del-row="handleDelOrg"
        /> </Col
    ></Row>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'LocationInfo',
  };
</script>

<script lang="ts" setup>
  import { Row, Col } from 'ant-design-vue';
  import { nextTick, reactive, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import LocationTree from './components/locationTree.vue';
  import LocationTable from './components/locationTable.vue';
  import { getLocationTableApi } from '/@/api/info/location';

  const { prefixCls } = useDesign('location');

  const loading = ref(false);
  const locationTreeRef = ref();
  const tableData = reactive<{ items: any[]; totalPages: number; totalCount: number }>({
    items: [],
    totalPages: 0,
    totalCount: 0,
  });
  const getLocationTableParams = reactive({
    parentId: 0,
    hierarchy: 1,
    orderBy: 'Code',
    ascending: true,
    pageSize: 10,
    pageNo: 1,
  });

  async function getLocationTable(params) {
    loading.value = true;
    try {
      const { items, totalCount, totalPages } = await getLocationTableApi(params);
      tableData.items = items || [];
      tableData.totalCount = totalCount;
      tableData.totalPages = totalPages;
      loading.value = false;
    } catch (error: any) {
      loading.value = false;
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleChangePage({ pageNo, pageSize }) {
    getLocationTable({ ...getLocationTableParams, ...{ pageNo, pageSize } });
  }

  function handleSelect(node) {
    if (node.parentId === -1) {
      getLocationTable({ ...getLocationTableParams, ...{ hierarchy: 0, parentId: node.parentId } });
    } else {
      getLocationTable({ ...getLocationTableParams, ...{ hierarchy: 1, parentId: node.id } });
    }
  }

  async function handleDelOrg() {
    await nextTick();
    // 更新左侧位置树
    locationTreeRef.value.getLocationTree({
      parentId: 0,
      orderBy: 'Code',
      ascending: true,
    });

    // 更新右侧table
    await getLocationTable(getLocationTableParams);
  }

  getLocationTable(getLocationTableParams);
</script>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-location';
  @content-prefix-cls: ~'@{prefix-cls}-content-wrapper';

  .@{prefix-cls} {
    @apply h-full flex flex-col overflow-hidden;
  }

  .@{content-prefix-cls} {
    @apply flex-1;
  }
</style>
