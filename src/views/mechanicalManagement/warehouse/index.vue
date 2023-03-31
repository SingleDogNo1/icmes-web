<template>
  <PageWrapper contentFullHeight contentBackground>
    <BasicForm @register="register" @submit="getSparePartStocksList" />
    <BasicTable @register="registerTable" :loading="loading">
      <template #tableTitle>
        <a-space>
          <a-button
            type="primary"
            :disabled="!hasEditPermission"
            @click="
              openEditStockModal(true, { occurrenceType: OccurrenceTypeEnum['IN'], data: null })
            "
          >
            入库
          </a-button>
          <a-button
            :disabled="!hasEditPermission"
            @click="
              openEditStockModal(true, { occurrenceType: OccurrenceTypeEnum['OUT'], data: null })
            "
          >
            出库
          </a-button>
        </a-space>
      </template>

      <template #toolbar>
        <a-button :disabled="!hasLockPermission" @click="openLockConfigModal(true, {})">
          锁定配置
        </a-button>
      </template>

      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
  </PageWrapper>

  <EditStockModal @register="registerEditStockModal" @success="getSparePartStocksList()" />
  <LockConfigModal @register="registerLockConfigModal" />
</template>

<script lang="ts" setup name="WarehousePage">
  import { nextTick, ref } from 'vue';
  import { Space as ASpace } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { getSparePartStocksListApi } from '/@/api/info/sparePartStocks';
  import {
    GetStockHistoryParams,
    SparePartStockHistoryFullModel,
    LockFlagEnum,
    OccurrenceTypeEnum,
  } from '/@/api/info/model/sparePartStocksModel';
  import { schemas, columns } from './data';
  import { useModal } from '/@/components/Modal';
  import EditStockModal from './EditStockModal.vue';
  import LockConfigModal from './LockConfigModal.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { getPermissionList } = usePermission();

  const hasEditPermission = !!getPermissionList()?.REPLACE_MOVE_EDIT;
  const hasLockPermission = !!getPermissionList()?.REPLACE_LOCK_CONFI;

  const loading = ref(false);

  const [register, { getFieldsValue, setFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    fieldMapToTime: [['timeRange', ['startDate', 'endDate'], 'x']],
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
        getSparePartStocksList();
      });
    },
  });

  const [registerEditStockModal, { openModal: openEditStockModal }] = useModal();
  const [registerLockConfigModal, { openModal: openLockConfigModal }] = useModal();

  function createActions(record: SparePartStockHistoryFullModel): ActionItem[] {
    if (record.lockFlag === LockFlagEnum['UNLOCK']) {
      return [
        {
          label: '编辑',
          onClick: () => {
            openEditStockModal(true, { occurrenceType: record.type, data: record });
          },
        },
        {
          label: '删除',
          color: 'error',
          popConfirm: {
            title: '数据删除后将无法恢复，确认删除数据？',
            confirm: async () => {
              loading.value = true;
              console.log('record :>> ', record);
              // try {
              //   await deleteRoleApi(record.id);
              //   createMessage.success('删除成功');
              //   await getRolesList(props.searchData);
              // } catch (error: any) {
              //   throw new Error(error);
              // } finally {
              //   loading.value = false;
              // }
            },
          },
        },
      ];
    } else if (record.lockFlag === LockFlagEnum['LOCK']) {
      return [
        {
          label: '已锁定',
          disabled: true,
        },
      ];
    } else {
      return [];
    }
  }

  async function getSparePartStocksList() {
    loading.value = true;
    await nextTick();

    // leadOutEmployeeIds 在表单中表现为单选，不知道为什么接口要求必须是数组格式
    const values = getFieldsValue() as Omit<GetStockHistoryParams, 'leadOutEmployeeIds'> & {
      leadOutEmployeeIds: number;
    };

    const form = {
      ...values,
      ...{ leadOutEmployeeIds: values?.leadOutEmployeeIds ? [values.leadOutEmployeeIds] : [] },
    };
    try {
      const { items, totalCount } = await getSparePartStocksListApi(form);
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

  getSparePartStocksList();
</script>
