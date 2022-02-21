<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <Row :gutter="16" class="h-full pt-4">
      <Col :span="12">
        <OverviewTable :date="date" @init-table="getTableData" @select-row="handleSelectRow" />
      </Col>
      <Col :span="12" class="pr-4">
        <Calendar :tableData="tableData" :date="date" @calendar-change="handleChangeCalendar" />
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
  import dayjs from 'dayjs';

  const tableData = ref();
  const date = ref({
    year: dayjs().year(),
    month: dayjs().month() + 1,
    day: dayjs().date(),
  });

  function getTableData(data, y) {
    tableData.value = data;
    date.value = { ...date.value, ...{ year: y } };
  }

  function handleChangeCalendar(year, month, day) {
    date.value = { year, month, day };
  }

  function handleSelectRow(row) {
    date.value = { ...date.value, ...{ month: row + 1 } };
  }
</script>
