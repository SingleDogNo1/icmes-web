<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <Row :gutter="16" class="h-full pt-4">
      <Col :span="12">
        <OverviewTable @init-table="getTableData" />
      </Col>
      <Col :span="12" class="pr-4">
        <Calendar :tableData="tableData" :year="year" @calendar-change="handleChangeCalendar" />
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
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Row, Col } from 'ant-design-vue';
  import OverviewTable from './components/overview.vue';
  import Calendar from './components/calendar.vue';

  const tableData = ref();
  const year = ref();

  function getTableData(data, y) {
    tableData.value = data;
    year.value = y;
  }

  function handleChangeCalendar(year, month, day) {
    console.log('year, month, day :>> ', year, month, day);
  }
</script>
