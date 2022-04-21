<template>
  <PageWrapper contentFullHeight contentBackground>
    <BasicForm @register="register" @submit="handleSubmit" />

    <BasicTable @register="registerTable" :loading="loading">
      <template #toolbar>
        <a-button type="primary" @click="toConfigDetailPage('create')">新建</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'ConfigurableObjects',
  };
</script>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    PaginationProps,
    TableAction,
    ActionItem,
  } from '/@/components/Table';
  import { schemas, columns } from './data';
  import {
    getConfigurableObjectsListApi,
    deleteConfigurableObjectApi,
  } from '/@/api/info/configurableObject';
  import {
    GetConfigurableObjectsListParam,
    ConfigurableObjectFullModel,
  } from '/@/api/info/model/configurableObjectModel';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';

  const go = useGo();
  const { createMessage } = useMessage();

  const loading = ref(false);

  const [register, { getFieldsValue, setFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      setFieldsValue({
        pageNo: page.current,
        pageSize: page.pageSize,
      });
      nextTick(() => {
        getTableData();
      });
    },
  });

  function createActions(record: ConfigurableObjectFullModel): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => {
          toConfigDetailPage('view', record.id);
        },
      },
      {
        label: '编辑',
        onClick: () => {
          toConfigDetailPage('edit', record.id);
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            loading.value = false;
            try {
              console.log('record :>> ', record);
              await deleteConfigurableObjectApi(record.id!);
              createMessage.success('删除成功');
              await getTableData();
            } catch (error: any) {
              throw new Error(error);
            } finally {
              loading.value = false;
            }
          },
        },
      },
    ];
  }

  function handleSubmit() {
    nextTick(() => {
      const value = getFieldsValue() as GetConfigurableObjectsListParam;

      console.log('value :>> ', value);
    });
  }

  async function getTableData() {
    loading.value = true;
    await nextTick();
    const values = getFieldsValue() as GetConfigurableObjectsListParam;
    try {
      const { items, totalCount } = await getConfigurableObjectsListApi(values);
      setTableData(items || []);
      setPagination({
        total: totalCount,
      });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function toConfigDetailPage(
    type: 'create' | 'view' | 'edit',
    id?: ConfigurableObjectFullModel['id'],
  ) {
    go({
      name: 'systemManagementConfigurableObjectsDetail',
      query: {
        type,
        id,
      },
    });
  }

  getTableData();
</script>
