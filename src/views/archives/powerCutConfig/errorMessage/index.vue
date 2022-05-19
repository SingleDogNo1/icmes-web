<template>
  <Row :gutter="12" class="h-full overflow-hidden">
    <Col :span="12" class="right-col">
      <RemotePowerTable />
    </Col>
    <Col :span="12" class="left-col">
      <PowerCutTable />
    </Col>
  </Row>
</template>

<script lang="ts">
  export default {
    name: 'ErrorMessage',
  };
</script>

<script lang="ts" setup>
  import { Row, Col } from 'ant-design-vue';
  import PowerCutTable from './powerCut.vue';
  import RemotePowerTable from './remotePower.vue';
</script>

<style lang="less" scoped>
  .left-col {
    padding-right: 0 !important;
    border-right: 6px @layout-body-background solid;
  }

  .right-col {
    padding-left: 0 !important;
    border-left: 6px @layout-body-background solid;
  }
</style>
