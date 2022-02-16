<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="wrap">
      <Row class="content" :gutter="16">
        <Col :span="8">
          <DeviceTree @select="handleSelect" />
        </Col>
        <Col :span="16" class="bg-white">
          <SettingTable :parent-id="parentId" />
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
  const parentId = ref(0);
  console.log(searchData.value);

  function handleSelect(nodeId) {
    console.log(nodeId);

    parentId.value = nodeId;
  }
</script>
