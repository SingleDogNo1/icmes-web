<template>
  <BasicForm @register="registerForm" @submit="handleSearch" />

  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openModal(true, { edit: true, editType: 'create' })">
        新建
      </a-button>
    </template>

    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>

  <EditCommonMeasureModal @register="registerModal" @update="handleSearch" />
</template>

<script lang="ts">
  export default {
    name: 'CommonTab',
  };
</script>

<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import EditCommonMeasureModal from './EditCommonMeasureModal.vue';
  import { error } from '/@/utils/log';
  import {
    getMaintenanceOrderCommonMeasureListApi,
    deleteMaintenanceOrderCommonMeasureApi,
  } from '/@/api/maintenance/maintenanceOrder';
  import {
    MaintenanceCommonMeasureModel,
    GetMaintenanceCommonMeasureParams,
  } from '/@/api/maintenance/model/maintenanceOrderModel';

  const { createMessage } = useMessage();

  const loading = ref(false);
  const [registerForm, { getFieldsValue }] = useForm({
    schemas: [
      {
        field: 'globalName',
        label: '',
        component: 'Input',
        defaultValue: '',
        componentProps: {
          placeholder: '请输入通用措施标题',
        },
      },
      // ------------------------ hidden fields ------------------------
      {
        field: 'pageNo',
        label: '页数',
        component: 'Input',
        defaultValue: 1,
        show: false,
      },
      {
        field: 'pageSize',
        label: '每页几条',
        component: 'Input',
        defaultValue: 10,
        show: false,
      },
    ],
    autoSubmitOnEnter: true,
    layout: 'inline',
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: [
      {
        title: '通用措施标题',
        dataIndex: 'title',
      },
    ],
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      setPagination({
        current: page.current,
        pageSize: page.pageSize,
      });

      const value = getFieldsValue() as GetMaintenanceCommonMeasureParams;
      const form = {
        ...value,
        ...{ pageNo: page.current!, pageSize: page.pageSize! },
      };

      getMaintenanceOrderCommonMeasureList(form);
    },
  });

  const [registerModal, { openModal }] = useModal();

  function createActions(record: MaintenanceCommonMeasureModel): ActionItem[] {
    if (record.used) {
      return [
        {
          label: '查看',
          onClick: async () => {
            openModal(true, { ...record, ...{ edit: false, editType: 'view' } });
          },
        },
      ];
    } else {
      return [
        {
          label: '编辑',
          onClick: async () => {
            openModal(true, { ...record, ...{ edit: true, editType: 'edit' } });
          },
        },
        {
          label: '删除',
          color: 'error',
          popConfirm: {
            title: '数据删除后将无法恢复，确认删除数据？',
            confirm: async () => {
              loading.value = true;
              try {
                await deleteMaintenanceOrderCommonMeasureApi(record.id);
                createMessage.success('删除成功');
                await handleSearch();
              } catch (err: any) {
                error(err);
              } finally {
                loading.value = false;
              }
            },
          },
        },
      ];
    }
  }

  onMounted(() => {
    handleSearch();
  });

  async function getMaintenanceOrderCommonMeasureList(form: GetMaintenanceCommonMeasureParams) {
    loading.value = true;
    try {
      const { items, totalCount } = await getMaintenanceOrderCommonMeasureListApi(form);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  async function handleSearch() {
    await nextTick();
    const data = getFieldsValue() as GetMaintenanceCommonMeasureParams;
    await getMaintenanceOrderCommonMeasureList(data);
  }
</script>
