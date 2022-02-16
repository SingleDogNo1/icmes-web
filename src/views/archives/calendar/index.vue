<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <Row :gutter="16" class="h-full pt-4">
      <Col :span="12">
        <OverviewTable />
      </Col>
      <Col :span="12" class="pr-4">
        <Spin :spinning="false">
          <Calendar />
        </Spin>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'ArchivesCalendar',
  };
</script>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { Row, Col, Spin } from 'ant-design-vue';
  import OverviewTable from './components/overview.vue';
  import Calendar from './components/calendar.vue';
</script>
