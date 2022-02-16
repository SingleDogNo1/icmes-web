<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 overflow-auto bg-white">
      <BasicForm :labelWidth="100" @register="register" @submit="handleSubmit" />
      <a-button type="primary" class="mb-2 mr-2"> 批量配置</a-button>
      <BasicTable @register="registerTable" />
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'SettingTable',
  };
</script>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas, columns } from './data';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getDevicesPowerListApi } from '/@/api/info/devices';
  import { onMounted, ref, Ref, nextTick, watch } from 'vue';
  import { getDevicesPowerListParam } from '/@/api/info/model/devicesModel';

  const searchData = ref({}) as Ref<getDevicesPowerListParam>;
  console.log(searchData.value);

  const props = defineProps({
    parentId: {
      type: Number,
      require: true,
    },
  });

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  const [registerTable, { setTableData }] = useTable({
    columns,
    ellipsis: false,
  });

  onMounted(async () => {
    await nextTick();
    searchData.value = getFieldsValue();
  });

  watch(
    () => props.parentId,
    (value) => {
      console.log(searchData.value, value);

      searchData.value.parentId = value;
      getDevicesPowerList(searchData.value);
    },
    {
      deep: true,
    },
  );

  async function getDevicesPowerList(params) {
    try {
      const { items } = await getDevicesPowerListApi(params);
      console.log(items);
      setTableData(items || []);
    } catch (error) {}
  }

  function handleSubmit() {}
</script>
