<template>
  <PageWrapper content-background content-full-height :class="prefixCls">
    <BasicForm :class="`${prefixCls}-form`" @register="registerForm" @submit="getTableData" />

    <BasicTable :loading="loading" @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" :disabled="!editPermission">新建</a-button>
      </template>

      <template #toolbar>
        <a-button :disabled="!setPermission">影响原因分组管理</a-button>
        <a-button :disabled="!setPermission">基础配置</a-button>
      </template>

      <!-- 操作 -->
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'ProdManageDispatch',
  };
</script>

<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form';
  import { dateUtil } from '/@/utils/dateUtil';
  import {
    BasicTable,
    useTable,
    PaginationProps,
    TableAction,
    ActionItem,
  } from '/@/components/Table';
  import { getDispatchListApi, delDispatchLogApi } from '/@/api/dispatch/log';
  import {
    GetDispatchListParams,
    EmployeeBaseModel,
    DispatchLogModel,
  } from '/@/api/dispatch/model/logModel';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { formatToDate } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';

  const { prefixCls } = useDesign('prod-manage-dispatch');
  const { createMessage } = useMessage();
  const { getPermissionList } = usePermission();
  const go = useGo();

  const loading = ref(false);
  const editPermission = !!getPermissionList()?.DISPATCH_LOG_EDIT;
  const setPermission = !!getPermissionList()?.DISPATCH_LOG_SET;

  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas: [
      {
        field: 'timeRange',
        component: 'RangePicker',
        label: '生产日期',
        componentProps: {
          format: 'YYYY-MM-DD',
          showTime: {
            defaultValue: [dateUtil().startOf('day'), dateUtil().endOf('day')],
          },
        },
      },
      // -------------- hidden fields --------------
      {
        field: 'ascending',
        label: '正序倒序',
        component: 'Checkbox',
        show: false,
        defaultValue: false,
      },
      {
        field: 'orderBy',
        label: '排序字段',
        component: 'Input',
        show: false,
        defaultValue: '',
      },
      {
        field: 'pageNo',
        label: '当前页',
        component: 'InputNumber',
        show: false,
        defaultValue: 1,
      },
      {
        field: 'pageSize',
        label: '每页条数',
        component: 'InputNumber',
        show: false,
        defaultValue: 10,
      },
    ],
    labelWidth: 60,
    autoSubmitOnEnter: true,
    fieldMapToTime: [['timeRange', ['startDate', 'endDate'], 'x']],
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns: [
      {
        title: '生产日期',
        dataIndex: 'productionDate',
        format: (time: number) => {
          return formatToDate(time);
        },
      },
      {
        title: '班次',
        dataIndex: 'workingShiftDetailName',
      },
      {
        title: '调度员',
        dataIndex: 'employeeItems',
        format: (employees: EmployeeBaseModel[]) => {
          return employees.reduce((res, pre, index) => {
            if (index === employees.length - 1) {
              res += pre.name;
            } else {
              res += pre.name + '，';
            }
            return res;
          }, '');
        },
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
      nextTick(() => {
        const fieldVal = getFieldsValue();
        const form = { ...fieldVal, ...{ pageNo: page.current!, pageSize: page.pageSize! } };
        getTableData(form);
      });
    },
  });

  function createActions(record: DispatchLogModel): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => {
          console.log('查看操作 :>> ', record);
          go({
            name: 'ProdManageDispatchDetail',
            params: {
              id: record.id,
            },
          });
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            try {
              loading.value = true;
              await delDispatchLogApi(record.id);
              createMessage.success('删除成功');
              await nextTick();
              const data = getFieldsValue() as GetDispatchListParams;
              getTableData(data);
            } catch (error) {
              throw new Error(JSON.stringify(error));
            } finally {
              loading.value = false;
            }
          },
        },
      },
    ];
  }

  onMounted(() => {
    nextTick(() => {
      const data = getFieldsValue() as GetDispatchListParams;
      getTableData(data);
    });
  });

  async function getTableData(data: GetDispatchListParams) {
    try {
      loading.value = true;
      const { items, totalCount } = await getDispatchListApi(data);

      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }
</script>
