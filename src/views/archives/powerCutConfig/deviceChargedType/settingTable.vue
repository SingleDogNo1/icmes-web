<template>
  <PageWrapper contentFullHeight dense>
    <div class="h-full p-4 overflow-auto bg-white">
      <BasicForm :labelWidth="100" @register="registerForm" @submit="handleSubmit" />

      <BasicTable @register="registerTable" @selection-change="handleSelectionChange">
        <template #toolbar>
          <a-button type="primary" :disabled="form.deviceIds.length === 0" @click="batchSetting">
            批量配置
          </a-button>
        </template>
      </BasicTable>
    </div>
    <batchSettingModal @register="registerModal" @update:config="getDevicesPowerList(searchData)" />
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
  import { onMounted, ref, Ref, nextTick, watch, PropType } from 'vue';
  import { GetDevicesPowerListParam } from '/@/api/info/model/devicesModel';
  import { useModal } from '/@/components/Modal';
  import batchSettingModal from './batchSettingModal.vue';
  import { map } from 'lodash-es';

  const searchData = ref({}) as Ref<GetDevicesPowerListParam>;

  const props = defineProps({
    id: {
      type: Number,
      require: true,
    },
    parentId: {
      type: Number,
      require: true,
    },
    category: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });

  const form: Ref<{
    deviceIds: (string | number)[];
    powerType: string | null;
    plcDetectType: string | null;
  }> = ref({
    deviceIds: [],
    powerType: null,
    plcDetectType: null,
  });

  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  const [registerTable, { setTableData }] = useTable({
    columns,
    ellipsis: false,
    rowSelection: {
      type: 'checkbox',
    },
    rowKey: 'id',
  });

  const [registerModal, { openModal }] = useModal();

  onMounted(async () => {
    await nextTick();
    searchData.value = getFieldsValue();
    getDevicesPowerList(searchData.value);
    console.log(searchData.value);
  });

  watch(
    () => props.id,
    (value) => {
      console.log(searchData.value, value);

      searchData.value.parentId = props.parentId;
      searchData.value.category = props.category;
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

  function handleSelectionChange({ rows }) {
    console.log(rows);
    if (rows.length > 0) {
      form.value.deviceIds = map(rows, 'id');
      if (rows.length == 1) {
        form.value.powerType = rows[0].powerType;
        form.value.plcDetectType = rows[0].plcDetectType;
      } else {
        form.value.powerType = form.value.plcDetectType = null;
      }
    } else {
      form.value.deviceIds = [];
    }
  }
  function handleSubmit() {}

  function batchSetting() {
    openModal(true, form);
  }
</script>
