<template>
  <pageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <BasicForm class="bg-white" @register="registerForm" @submit="handleSubmit" />
      <BasicTable @register="registerTable">
        <template #toolbar>
          <a-button type="primary" @click="openModal(true, {})">新建</a-button>
        </template>
        <template #powerBusinessNode="{ record }">
          {{ powerBusinessNodeMap[record.powerBusinessNode] }}
        </template>
        <template #plcDetectType="{ record }">
          {{ devicePLCDetectTypeMap[record.plcDetectType + ''] }}
        </template>
        <template #explain="{ record }">
          {{ explainMap[record.explain] }}
        </template>
        <template #isTips="{ record }">
          <Switch v-model:checked="record.isTips" @change="handleIsTipsChange(record, 0)" />
        </template>
        <template #inuse="{ record }">
          <Switch v-model:checked="record.inuse" @change="handleInUseChange(record, 0)" />
        </template>
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
      <editJudgmentModal @register="registerModal" />
    </div>
  </pageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'PlcJudgmentRule',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref, Ref, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas } from './data';
  import { GetPowerJudgmentParams, PlcJudgmentRuleModel } from '/@/api/info/model/plcJudgmentModel';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page/index';
  import { useModal } from '/@/components/Modal';
  import { ActionItem, TableAction, BasicTable, useTable } from '/@/components/Table';
  import editJudgmentModal from './components/editJudgmentModal.vue';
  import { getPLCJudgmentListApi, toggleInUseApi, toggleIsTipsApi } from '/@/api/info/plcJudgment';
  import { PageHeaderProps, Switch } from 'ant-design-vue';

  const { getDictMap } = useUserState();

  const loading = ref(false);
  const selectedRowIndex = ref<number>(-1);
  const searchData = ref({}) as Ref<GetPowerJudgmentParams>;
  const powerBusinessNodeMap = getDictMap('POWER_BUSINESS_NODE');
  const devicePLCDetectTypeMap = {
    '0': '不检测状态信号',
    '1': '只监测运行状态',
    '2': '只监测带电状态',
    '3': '监测运行状态+带电状态',
    '4': '只监测就地状态',
    '5': '参与停送电流程，无电工配电操作',
    '6': '不参与停送电流程',
    '7': '监测运行状态+带电状态+就地状态',
    '8': '监测就地状态+运行状态',
    '9': '监测就地状态+带电状态',
    '-1': '未知',
  };
  const explainMap = getDictMap('BT_POWER_CUT_FAILTIP');

  const { createMessage } = useMessage();

  const [registerModal, { openModal }] = useModal();

  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    autoSubmitOnEnter: true,
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination, getDataSource }] =
    useTable({
      columns: [
        {
          title: '业务节点',
          dataIndex: 'powerBusinessNode',
          slots: { customRender: 'powerBusinessNode' },
        },
        {
          title: 'PLC监测类型',
          dataIndex: 'plcDetectType',
          slots: { customRender: 'plcDetectType' },
        },
        {
          title: '策略规则',
          dataIndex: 'strategyRule',
          customRender: ({ record }: { record: any }) => {
            return `${record.strategyNumber} ${record.strategyName}`;
          },
        },
        {
          title: '描述',
          dataIndex: 'description',
        },
        {
          title: '校验未通过说明',
          dataIndex: 'explain',
          slots: { customRender: 'explain' },
        },
        {
          title: '不监测PLC提示',
          dataIndex: 'isTips',
          slots: { customRender: 'isTips' },
        },
        {
          title: '启用/停用',
          dataIndex: 'inuse',
          slots: { customRender: 'inuse' },
        },
      ],
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
      },
      striped: false,
      ellipsis: false,
      rowClassName: (_, index) => {
        return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
      },
      onChange: () => {
        const page = getPaginationRef() as PageHeaderProps;
        setPagination({
          current: page.current,
          pageSize: page.pageSize,
        });

        Object.assign(searchData.value, {
          pageNo: page.current,
          pageSize: page.pageSize,
        });
      },
    });

  function createActions(record: PlcJudgmentRuleModel): ActionItem[] {
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
            loading.value = true;
            try {
              await deleteDictDataApi(record.typeCode, record.code);
              createMessage.success('删除成功');
              await getDictTypesList(props.selectRow);
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

  onMounted(async () => {
    await nextTick();
    searchData.value = getFieldsValue() as GetPowerJudgmentParams;
    getPLCJudgmentList(searchData.value);
  });
  async function getPLCJudgmentList(value) {
    loading.value = true;
    try {
      const { items, totalCount, totalPages } = await getPLCJudgmentListApi(value);
      setTableData(items || []);
      setPagination({ total: totalCount });
      if (items) {
        selectedRowIndex.value = -1;
        const tableData = getDataSource();
        handleClickRow(tableData[0], 0);
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleClickRow(row, index?) {
    if (selectedRowIndex.value === index) return;
    selectedRowIndex.value = index;
  }
  function handleSubmit(value) {
    getPLCJudgmentList(value);
  }

  async function handleIsTips(record) {
    loading.value = true;
    try {
      await toggleIsTipsApi(record.id);
      await createMessage.success('不监测PLC提示成功');
      await getPLCJudgmentList(searchData.value);
    } catch (error) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
  async function handleInUse(record) {
    loading.value = true;
    try {
      await toggleInUseApi(record.id);
      await createMessage.success('启用/停用成功');
      await getPLCJudgmentList(searchData.value);
    } catch (error) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleIsTipsChange(record, index) {
    handleIsTips(record);
  }
  function handleInUseChange(record, index) {
    handleInUse(record);
  }
</script>

<style lang="less" scoped>
  .plc-judgment-rule {
    color: red;
  }
</style>
