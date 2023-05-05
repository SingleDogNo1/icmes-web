<template>
  <PageWrapper contentBackground contentFullHeight title="PLC信号属性配置">
    <BasicForm class="bg-white" @register="register" @submit="handleSubmit" />

    <BasicTable @register="registerTable" :loading="loading">
      <template #toolbar>
        <a-button type="primary" :disabled="!selected" @click="configSignalAttr">配置属性</a-button>
      </template>
      <template #name="{ record }"> {{ genName(record) }} </template>
      <template #pointType="{ record }"> {{ pointTypeMap[record.pointType] }} </template>
      <template #businessType="{ record }"> {{ businessTypeMap[record.businessType] }} </template>
      <template #unit="{ record }"> {{ unitMap[record.unit] }} </template>
    </BasicTable>

    <UpdateSignalAttrModal @register="registerModal" @done="configSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'SignalConfig',
  };
</script>

<script lang="ts" setup>
  import { ref, nextTick, onMounted, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, PaginationProps } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import UpdateSignalAttrModal from './components/updateSignalAttrModal.vue';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { schemas, columns } from './data';
  import { getPlcPointsListApi } from '/@/api/info/plcPoints';
  import { GetPlcPointsListParams, PLCPointFullModel } from '/@/api/info/model/plcPointsModel';
  import { error } from '/@/utils/log';

  const { getDictMap } = useUserState();

  const selected = computed(() => getSelectRows().length !== 0);
  const loading = ref(false);
  // TODO 是否考虑加入到数据字典中？
  const pointTypeMap = { 0: '数字量', 1: '模拟量', 2: '控制量' };
  const businessTypeMap = getDictMap('DT_PLC_BUSINESS_TYPE');
  const unitMap = getDictMap('DT_UM');

  const [register, { getFieldsValue }] = useForm({
    layout: 'inline',
    labelWidth: '5em',
    schemas,
    autoSubmitOnEnter: true,
  });

  const [
    registerTable,
    { setTableData, getPaginationRef, setPagination, getSelectRows, clearSelectedRowKeys },
  ] = useTable({
    columns,
    striped: false,
    ellipsis: false,
    rowSelection: {
      type: 'checkbox',
    },
    onChange: () => {
      const page = getPaginationRef() as PaginationProps;
      setPagination({
        current: page.current,
        pageSize: page.pageSize,
      });
      const value = getFieldsValue() as GetPlcPointsListParams;
      const params = { ...value, ...{ pageNo: page.current, pageSize: page.pageSize } };
      getPlcPointsList(params);
    },
  });

  const [registerModal, { openModal }] = useModal();

  onMounted(() => {
    handleSubmit();
  });

  function genName(row: PLCPointFullModel) {
    const name = row.ancientName
      ? `${row.ancientCode} ${row.ancientName}-${row.name}`
      : `${row.ancientCode} ${row.name}`;

    const fullName = `${row.processNo} ${name.trim()}`;
    return fullName;
  }

  async function handleSubmit() {
    await nextTick();
    const value = getFieldsValue() as GetPlcPointsListParams;
    await getPlcPointsList(value);
  }

  async function getPlcPointsList(params: GetPlcPointsListParams) {
    loading.value = true;
    try {
      const { items, totalCount } = await getPlcPointsListApi(params);
      setTableData(items || []);
      setPagination({
        total: totalCount,
      });
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  function configSignalAttr() {
    const selectRows = getSelectRows();
    openModal(true, selectRows);
  }

  function configSuccess() {
    // 配置完成，清除选中行
    clearSelectedRowKeys();
  }
</script>
