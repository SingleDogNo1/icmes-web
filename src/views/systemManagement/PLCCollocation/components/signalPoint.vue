<template>
  <div class="w-full h-full bg-white px-4">
    <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
      <template #toolbar>
        <a-button type="danger" @click="batchDelete" :disabled="!selected">删除</a-button>
        <a-button type="primary" @click="go({ name: 'PLCSignalConfig' })">配置属性</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SignalPoint',
  };
</script>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { getPlcPointsListApi, deletePlcPointsApi } from '/@/api/info/plcPoints';
  import { PLCPointFullModel } from '/@/api/info/model/plcPointsModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';

  const { createMessage } = useMessage();
  const go = useGo();

  const props = defineProps({
    selectRow: {
      type: Object,
      required: true,
    },
  });

  const selectedRowIndex = ref(-1);
  const loading = ref(false);
  const selected = computed(() => getSelectRows().length !== 0);

  const [registerTable, { setTableData, getSelectRows }] = useTable({
    title: '已配信号点',
    pagination: false,
    columns: [
      { title: '编号', dataIndex: 'processNo', fixed: 'left' },
      { title: '名称', dataIndex: 'name' },
      { title: '点位编码', dataIndex: 'code' },
    ],
    rowSelection: {
      type: 'checkbox',
    },
    clickToRowSelect: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    rowClassName: (_, index) => {
      return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
    },
  });

  function createActions(record: PLCPointFullModel): ActionItem[] {
    return [
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: () => {
            deletePlcPoints([record.id]);
          },
        },
      },
    ];
  }

  watch(
    () => props.selectRow,
    (val) => {
      getPlcPointsList(val);
    },
  );

  async function getPlcPointsList(params) {
    try {
      loading.value = true;

      const { items } = await getPlcPointsListApi({
        relativeObjectId: params.id,
        relativeObjectType: params.type,
      });

      setTableData(items || []);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  async function deletePlcPoints(ids: number[]) {
    try {
      loading.value = true;

      await deletePlcPointsApi(ids);
      createMessage.success('删除成功');
      await getPlcPointsList(props.selectRow);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(_row, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }

  function batchDelete() {
    const ids = (getSelectRows() as PLCPointFullModel[]).reduce((res, pre) => {
      res.push(pre.id);
      return res;
    }, [] as number[]);

    deletePlcPoints(ids);
  }
</script>
