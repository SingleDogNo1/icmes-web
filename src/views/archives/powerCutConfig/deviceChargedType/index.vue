<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="wrap">
      <Row class="content" :gutter="16">
        <Col :span="8">
          <DeviceTree @select="handleSelect" />
        </Col>
        <Col :span="16">
          <SettingTable :id="id" :parent-id="parentId" :category="category" />
        </Col>
      </Row>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'DeviceChargedType',
  };
</script>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { Row, Col } from 'ant-design-vue';
  import DeviceTree from './devicePowerTree.vue';
  import SettingTable from './settingTable.vue';
  import { ref } from 'vue';

  const searchData = ref({});
  const parentId = ref(null);
  const id = ref(null);
  const category = ref([]);
  console.log(searchData.value);

  function handleSelect(node) {
    console.log(node);

    id.value = node.id;
    parentId.value = node.parentId;
    category.value = node.category;
  }
</script>

<style lang="less" scoped>
  .wrap {
    background: #f0f2f5;
  }
</style>
