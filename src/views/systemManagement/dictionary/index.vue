<template>
  <PageWrapper contentFullHeight :contentBackground="true">
    <BasicForm @register="register" @submit="submit" />
    <!-- <BasicTable @register="registerTable" :loading="loading">
      <template #module="{ record }"> {{ moduleMap[record.module] }} </template>
      <template #operate="{ record }"> {{ operateMap[record.operate] }} </template>
      <template #content="{ record }"> {{ genLogContentText(record.content) }} </template>
      <template #time="{ record }"> {{ formatDate(record.time, 'YYYY-MM-DD HH:mm') }} </template>
      <template #terminalType="{ record }"> {{ terminalTypeMap[record.terminalType] }} </template>
    </BasicTable> -->
    <!-- <PageWrapper contentFullHeight> 123 </PageWrapper> -->
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemas } from './data';

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
  });
  function submit() {
    const values = getFieldsValue();
    console.log('object :>> ', values);
  }
</script>

<style scoped>
  .dictionary {
    color: red;
  }
</style>
