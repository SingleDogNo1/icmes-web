<template>
  <BasicForm :class="`${prefixCls}-form`" @register="registerForm" @submit="searchTableData" />

  <BasicTable @register="registerTable" :loading="loading">
    <template #toolbar>
      <a-button type="primary" @click="openEditTicketModal(true, {})">新建</a-button>
    </template>

    <template #range="{ record }">
      <Tag v-for="item in record.devices" :key="item.deviceId" :color="primaryColor">
        {{ (item.processNo || item.deviceCode) + item.deviceName }}
      </Tag>
    </template>

    <template #flag="{ record }">
      <Switch v-model:checked="record.flag" @change="toggleUse(record)" />
    </template>

    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            label: '查看',
            onClick: handleView.bind(null, record),
          },
        ]"
        :dropDownActions="createDropDownActions(record)"
      />
    </template>
  </BasicTable>

  <EditTicketModal @register="registerTicketModal" @done="searchTableData" />
  <EditRangeModal @register="registerRangeModal" @done="searchTableData" />
  <TicketInfoDrawer @register="registerDrawer" />
</template>

<script lang="ts">
  export default {
    name: 'OperationTicket',
  };
</script>

<script lang="ts" setup>
  import { ref, onMounted, nextTick, createVNode } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Tag, Switch } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
    ActionItem,
  } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { schemas, columns } from './data';
  import { useDesign } from '/@/hooks/web/useDesign';
  import {
    getHvOperationTicketConfigListApi,
    toggleHvOperationTicketTemplateApi,
    deleteHvOperationApi,
  } from '/@/api/power/hvOperation';
  import {
    GetHvOperationParams,
    HvOperateTemplateAdvanceModel,
  } from '/@/api/power/model/hvOperationModel';
  import { primaryColor } from '/@/settings/designSetting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { useRoute } from 'vue-router';
  import EditTicketModal from './components/editTicketModal.vue';
  import EditRangeModal from './components/editRangeModal.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useDrawer } from '/@/components/Drawer';
  import TicketInfoDrawer from './components/ticketInfoDrawer.vue';

  const { prefixCls } = useDesign('operation-ticket');
  const { createMessage, createConfirm } = useMessage();
  const {
    meta: { code },
  } = useRoute();
  const { getFeature } = useUserStore();
  const go = useGo();

  const hasEditPermission = getFeature[code!].POWER_CUT_CONFIG;
  const loading = ref(false);
  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'inline',
    schemas,
  });
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
      const values = getFieldsValue() as GetHvOperationParams;

      const params = { ...values, ...{ pageNo: page.current, pageSize: page.pageSize } };
      GetHvOperationTicketConfigList(params);
    },
  });
  const [registerTicketModal, { openModal: openEditTicketModal }] = useModal();
  const [registerRangeModal, { openModal: openEditRangeModal }] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();

  function createDropDownActions(record: HvOperateTemplateAdvanceModel): ActionItem[] {
    if (!hasEditPermission) {
      return [];
    } else {
      return [
        {
          label: '编辑',
          onClick: () => {
            openEditTicketModal(true, record);
          },
        },
        {
          label: '设置范围',
          onClick: () => {
            openEditRangeModal(true, record);
          },
        },
        {
          label: '配置步骤',
          onClick: () => {
            go({
              name: 'ArchivesPowerCutConfigTicketConfig',
              query: { id: record.id },
            });
          },
        },
        {
          label: '删除',
          color: 'error',
          onClick: () => {
            createConfirm({
              title: '警告',
              iconType: 'error',
              icon: createVNode(ExclamationCircleOutlined),
              content: createVNode('div', {}, '数据删除后将无法恢复，请问确认删除数据？'),
              onOk() {
                deleteHvOperationApi(record.id).then(() => {
                  createMessage.success('删除成功');
                  searchTableData();
                });
              },
              onCancel() {},
            });
          },
        },
      ];
    }
  }

  onMounted(() => {
    searchTableData();
  });

  async function GetHvOperationTicketConfigList(params: GetHvOperationParams) {
    try {
      loading.value = true;
      const { items, totalCount } = await getHvOperationTicketConfigListApi(params);
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
    const values = getFieldsValue() as GetHvOperationParams;
    GetHvOperationTicketConfigList(values);
  }

  function toggleUse(row: HvOperateTemplateAdvanceModel) {
    toggleHvOperationTicketTemplateApi({ flag: row.flag, id: row.id })
      .then(() => {
        createMessage.success(`${row.flag ? '启' : '禁'}用成功`);
      })
      .catch((error) => {
        row.flag = !row.flag;
        throw new Error(error);
      });
  }

  function handleView(record) {
    openDrawer(true, record);
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-operation-ticket';
  @form-prefix-cls: ~'@{prefix-cls}-form';

  .@{form-prefix-cls} {
    @apply pt-4;
  }
</style>
