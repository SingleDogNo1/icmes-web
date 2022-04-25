<template>
  <PageWrapper contentFullHeight fixedHeight>
    <Row :gutter="16" class="h-full overflow-hidden">
      <Col :span="9" class="h-full">
        <CollocationObj @select="handleSelect" />
      </Col>
      <Col span="6">
        <CollocationTree />
      </Col>
      <Col :span="9">
        <SignalPoint />
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'PLCCollocation',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Row, Col } from 'ant-design-vue';
  import CollocationObj from './components/collocationObj.vue';
  import CollocationTree from './components/collocationTree.vue';
  import SignalPoint from './components/signalPoint.vue';

  const selectedRow = ref<Nullable<Record<string, any>>>(null);
  function handleSelect(row) {
    console.log('row :>> ', row);
    selectedRow.value = row;
  }
</script>
