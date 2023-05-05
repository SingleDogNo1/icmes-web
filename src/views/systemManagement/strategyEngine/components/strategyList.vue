<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <BasicTable @register="registerTable" :loading="loading" @row-click="handleClickRow">
        <template #toolbar>
          <a-button type="primary" @click="openModal(true, {})">新建</a-button>
        </template>

        <template #businessType="{ record }">
          <span>{{ businessTypeMap[record.businessType] }}</span>
        </template>

        <template #isUse="{ record }">
          <Switch v-model:checked="record.isUse" @change="toggleUse(record, $event)" />
        </template>

        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
    </div>
    <EditStrategyModal @register="registerModal" @done="getStrategyList(searchData)" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, PropType, watch, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { Switch } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { getStrategyListApi, updateStrategyRuleUseableApi } from '/@/api/info/strategy';
  import { GetStrategyListParams, StrategyModel } from '/@/api/info/model/strategyModel';
  import { strategyEngineListTableColumns } from '../data';
  import { useUserState } from '/@/hooks/web/useUserState';
  import EditStrategyModal from './editStrategyModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();
  const { getDictMap } = useUserState();

  const props = defineProps({
    searchData: {
      type: Object as PropType<GetStrategyListParams>,
      required: true,
    },
  });

  const emit = defineEmits(['selectRow', 'changePage']);
  const selectedRowIndex = ref<number>(-1);
  const loading = ref(false);
  const { searchData } = toRefs(props);

  // 业务类型
  const businessTypeMap = getDictMap('STRATEGY_TYPE');

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: strategyEngineListTableColumns,
      striped: false,
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
      },
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
        emit('changePage', { pageNo: page.current, pageSize: page.pageSize });
      },
    });
  const [registerModal, { openModal }] = useModal();

  function createActions(record: StrategyModel): ActionItem[] {
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
          confirm: () => {
            console.log('record :>> ', record);
          },
        },
      },
    ];
  }

  async function getStrategyList(form) {
    loading.value = true;
    try {
      const { items, totalCount } = await getStrategyListApi(form);
      setTableData(items || []);
      setPagination({ total: totalCount });
      if (items) {
        // 有数据，默认选中第一条，查询详情
        selectedRowIndex.value = -1;
        const tableData = getDataSource();
        handleClickRow(tableData[0], 0);
      }
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(row, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
    emit('selectRow', row);
  }

  async function toggleUse(row: StrategyModel, checked: boolean) {
    console.log('row :>> ', row, checked);
    try {
      loading.value = true;
      await updateStrategyRuleUseableApi(row.id);
      checked ? createMessage.success('启用成功') : createMessage.success('停用成功');
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => props.searchData,
    (value) => {
      getStrategyList(value);
      setPagination({
        current: value.pageNo,
      });
    },
    {
      deep: true,
    },
  );
</script>
