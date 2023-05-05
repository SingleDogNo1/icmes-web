<template>
  <BasicTable :title="title" @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openModal(true, {})">新建</a-button>
    </template>

    <template #workingShift="{ record }">
      <Switch
        v-model:checked="record.useful"
        @change="toggleNoticeWorkingShift(record, $event as boolean)"
      />
    </template>

    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>

  <EditModal @register="registerModal" @done="getData" />
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { Switch } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { columns } from './data';
  import {
    getPowerCutConfigReminderApi,
    deletePowerCutReminderConfigApi,
    updatePowerCutReminderConfigApi,
  } from '/@/api/power/config';
  import { ConfigReminderModel } from '/@/api/power/model/configModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import EditModal from './editPowerCutModal.vue';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();
  const title = '停电中的设备，突然带电的异常提醒';
  const loading = ref(false);
  const [registerTable, { setTableData }] = useTable({
    columns,
    ellipsis: false,
    pagination: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const [registerModal, { openModal }] = useModal();

  function createActions(record: ConfigReminderModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openModal(true, record);
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            try {
              await deletePowerCutReminderConfigApi(record.id);
              createMessage.success('删除成功');
              await getData();
            } catch (err: any) {
              error(err);
            }
          },
        },
      },
    ];
  }

  onMounted(() => {
    getData();
  });

  async function getData() {
    try {
      loading.value = true;
      const data = await getPowerCutConfigReminderApi();
      setTableData(data || []);
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  async function toggleNoticeWorkingShift(record: ConfigReminderModel, checked: boolean) {
    try {
      loading.value = true;
      await updatePowerCutReminderConfigApi(record.id, {
        noticeObjectType: record.noticeObjectType,
        noticeObject: record.noticeObject,
        workingShift: checked,
      });
      createMessage.success('按班次修改成功');
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
