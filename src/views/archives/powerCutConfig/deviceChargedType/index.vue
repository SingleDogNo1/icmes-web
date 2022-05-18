<template>
  <Row class="content" :gutter="16">
    <Col :span="8">
      <DeviceTree @select="handleSelect" :table-data-loaded="loaded" />
    </Col>
    <Col :span="16">
      <SettingTable
        :id="(id as number)"
        :parent-id="(parentId as number)"
        :category="category"
        @fetch-end="fetchTableDataEnd"
      />
    </Col>
  </Row>
</template>

<script lang="ts">
  export default {
    name: 'DeviceChargedType',
  };
</script>

<script lang="ts" setup>
  import { Row, Col } from 'ant-design-vue';
  import DeviceTree from './devicePowerTree.vue';
  import SettingTable from './settingTable.vue';
  import { ref } from 'vue';

  const searchData = ref({});
  const parentId = ref<Nullable<number>>(null);
  const id = ref<Nullable<number>>(null);
  const category = ref<string[]>([]);
  console.log(searchData.value);
  const loaded = ref(false);

  function handleSelect(node) {
    id.value = node.id;
    parentId.value = node.parentId;
    category.value = node.category as string[];
  }

  function fetchTableDataEnd() {
    loaded.value = true;
  }
</script>
