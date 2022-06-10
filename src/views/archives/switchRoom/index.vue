<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <Row :gutter="16">
      <Col :span="12" class="pr-4">
        <DistributionRoom @selected-row="handleSelectedRow" />
      </Col>
      <Col :span="12" class="pr-4">
        <DistributionCabinet :selected-row-id="selectedRowId" />
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'SwitchRoom',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page/index';
  import DistributionRoom from './components/distributionRoom.vue';
  import DistributionCabinet from './components/distributionCabinet.vue';
  import { Row, Col } from 'ant-design-vue';

  const selectedRowId = ref<number>();

  function handleSelectedRow(row) {
    selectedRowId.value = row.id;
  }
</script>
