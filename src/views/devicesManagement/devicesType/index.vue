<template>
  <PageWrapper contentFullHeight contentBackground>
    <BasicForm @register="registerForm" @submit="search" />
    <BasicTable @register="registerTable" :loading="tableLoading">
      <template #tableTitle>
        <a-button
          :disabled="!hasEditPermission"
          type="primary"
          @click="openEditDeviceTypeDrawer(true, { method: 'create', data: null })"
        >
          新建
        </a-button>
      </template>

      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>

    <EditDeviceTypeDrawer @register="registerEditDeviceDrawer" @success="search" />
  </PageWrapper>
</template>

<script lang="ts" setup name="DeviceType">
  // !组件名不能只有一个单词构成，并且遵循首字母大写的驼峰命名
  import { ref, nextTick, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    PaginationProps,
    TableAction,
    ActionItem,
  } from '/@/components/Table';
  import EditDeviceTypeDrawer from './editDeviceTypeDrawer.vue';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { getDeviceCategoryListApi, delDevicesCategoryApi } from '/@/api/info/devicesCategory';
  import {
    GetDevicesCategoryListParam,
    DeviceCategoryModel,
  } from '/@/api/info/model/devicesCategoryModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { schemas, columns } from './data';

  const { createMessage } = useMessage();

  const {
    meta: { code },
  } = useRoute();
  const { getFeature } = useUserStore();
  const hasEditPermission = getFeature[code!].DEVICE_TYPE_EDIT;

  const tableLoading = ref(false);

  const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({ schemas, layout: 'inline' });

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
        search();
      });
    },
  });

  const [registerEditDeviceDrawer, { openDrawer: openEditDeviceTypeDrawer }] = useDrawer();

  onMounted(() => {
    search();
  });

  async function search() {
    tableLoading.value = true;
    await nextTick();
    const formData = getFieldsValue();

    try {
      const { items, totalCount } = await getDeviceCategoryListApi(
        formData as GetDevicesCategoryListParam,
      );
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      tableLoading.value = false;
    }
  }

  function createActions(record: DeviceCategoryModel): ActionItem[] {
    return [
      {
        label: '编辑',
        disabled: !hasEditPermission,
        onClick: () => {
          openEditDeviceTypeDrawer(true, {
            method: 'edit',
            data: record,
          });
        },
      },
      {
        label: '查看',
        onClick: () => {
          openEditDeviceTypeDrawer(true, {
            method: 'view',
            data: record,
          });
        },
      },
      {
        label: '删除',
        disabled: !hasEditPermission,
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            try {
              await delDevicesCategoryApi(record.id);
              createMessage.success('删除成功');
              await search();
            } catch (error: any) {
              throw new Error(error);
            }
          },
        },
      },
    ];
  }
</script>
