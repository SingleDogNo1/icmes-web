<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <BasicTable @register="registerTable" :loading="loading">
        <template #toolbar>
          <a-button type="primary" @click="openModal(true, {})">新建</a-button>
        </template>
        <template #type="{ record }">
          {{ powerCutTypeMap[record.powerCutType] }}
        </template>
        <template #useful="{ record }">
          <Switch v-model:checked="record.useful" @change="changePowerCutConfig(record)" />
        </template>
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>

      <EditModal @register="registerModal" @done="getPowerCutConfigList(getPowerCutConfigParams)" />
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'PowerCutType',
  };
</script>

<script lang="ts" setup>
  import { ref, readonly } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { powerCutTypeColumns as columns } from '../data';
  import {
    getPowerCutConfigListApi,
    changePowerCutConfigUsefulApi,
    deletePowerCutConfigApi,
  } from '/@/api/info/powerCutConfig';
  import {
    GetPowerCutConfigParams,
    PowerCutConfigModel,
  } from '/@/api/info/model/powerCutConfigModel';
  import { Switch } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import EditModal from './editModal.vue';
  import { useModal } from '/@/components/Modal';

  const { createMessage } = useMessage();
  const loading = ref(false);
  const powerCutTypeMap = {
    1: '高压停送电',
    2: '低压停送电',
    3: '特殊停送电',
  };
  const getPowerCutConfigParams = readonly({
    ascending: false,
    onlyNeedUse: false,
    orderBy: '',
    pageNo: 1,
    pageSize: 10,
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
    },
  });

  function createActions(record: PowerCutConfigModel): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: () => {
          openModal(true, { configId: record.configId });
        },
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            console.log('record :>> ', record);
            loading.value = true;
            try {
              await deletePowerCutConfigApi(record.configId);
              createMessage.success('删除成功');
              await getPowerCutConfigList(getPowerCutConfigParams);
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

  async function getPowerCutConfigList(params: GetPowerCutConfigParams) {
    loading.value = true;
    try {
      const { items, totalCount } = await getPowerCutConfigListApi(params);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }

  async function changePowerCutConfig(record: PowerCutConfigModel) {
    loading.value = true;
    try {
      await changePowerCutConfigUsefulApi(record.configId);
      createMessage.success(record.useful ? '启用成功' : '禁用成功');
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }

  getPowerCutConfigList(getPowerCutConfigParams);
</script>

<style lang="less" scoped>
  .power-cut-type {
    color: red;
  }
</style>
