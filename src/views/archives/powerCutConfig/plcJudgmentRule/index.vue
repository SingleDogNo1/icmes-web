<template>
  <BasicForm :class="`${prefixCls}-form`" @register="registerForm" @submit="searchTableData" />

  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openModal(true, {})">新建</a-button>
    </template>

    <template #unSupervisePlcTip="{ record }">
      <Switch v-model:checked="record.isTips" @change="toggleSupervisePLCTip(record)" />
    </template>

    <template #inuse="{ record }">
      <Switch v-model:checked="record.inuse" @change="toggleUse(record)" />
    </template>

    <template #action="{ record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>

  <EditModal @register="registerModal" @done="searchTableData" />
</template>

<script lang="ts">
  export default {
    name: 'PLCJudgmentRule',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue';
  import { Switch } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { schemas, columns } from './data';
  import {
    getPLCJudgmentListApi,
    togglePLCJudgmentTipsApi,
    togglePLCJudgmentUseApi,
  } from '/@/api/power/PLCJudgmentRule';
  import {
    GetPLCJudgmentRuleListParams,
    PlcJudgmentRuleModel,
  } from '/@/api/power/model/PLCJudgmentRuleModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import EditModal from './editModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useDesign } from '/@/hooks/web/useDesign';

  const { createMessage } = useMessage();
  const { prefixCls } = useDesign('plc-judgment-rule');

  const loading = ref(false);
  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
    labelWidth: 60,
  });
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    ellipsis: false,
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
      const values = getFieldsValue() as GetPLCJudgmentRuleListParams;

      const params = { ...values, ...{ pageNo: page.current, pageSize: page.pageSize } };
      getPLCJudgmentList(params);
    },
  });

  function createActions(record): ActionItem[] {
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

  onMounted(() => {
    searchTableData();
  });

  async function getPLCJudgmentList(params: GetPLCJudgmentRuleListParams) {
    loading.value = true;
    try {
      const { items, totalCount } = await getPLCJudgmentListApi(params);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  async function searchTableData() {
    await nextTick();
    const params = getFieldsValue() as GetPLCJudgmentRuleListParams;
    getPLCJudgmentList(params);
  }

  async function toggleSupervisePLCTip(record: PlcJudgmentRuleModel) {
    loading.value = true;
    try {
      await togglePLCJudgmentTipsApi(record.id);
      createMessage.success(`${record.isTips ? '' : '取消'}监测 PLC 提示成功`);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  async function toggleUse(record: PlcJudgmentRuleModel) {
    loading.value = true;
    try {
      await togglePLCJudgmentUseApi(record.id);
      createMessage.success(`${record.inuse ? '启' : '停'}用成功`);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-plc-judgment-rule';
  @form-prefix-cls: ~'@{prefix-cls}-form';

  .@{form-prefix-cls} {
    @apply pt-4;
  }
</style>
