<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 bg-white">
      <a-button
        class="mb-2.5"
        type="primary"
        @click="
          activeIndex === '0'
            ? openCabinetModal(true, { roomId: props.selectedRowId })
            : openEntranceGuardsModal(true, { roomId: props.selectedRowId })
        "
      >
        新增{{ activeIndex === '0' ? '配电柜' : '门禁' }}</a-button
      >
      <Radio.Group class="float-right" v-model:value="activeIndex" @change="tabChange">
        <Radio.Button :value="'0'">配电柜</Radio.Button>
        <Radio.Button :value="'1'">门禁</Radio.Button>
      </Radio.Group>
      <BasicTable :loading="loading" @register="registerTable">
        <template #devices="{ record }">
          <span v-for="(item, key) in record.devices" :key="key">
            {{ item.processNo || item.deviceCode }}
            {{ key === record.devices.length - 1 ? '' : '/' }}
          </span>
        </template>
        <template #action="{ record }">
          <TableAction :actions="createActions(record)" />
        </template>
      </BasicTable>
      <EditDistributionCabinetModal
        @register="registerCabinetModal"
        @done="getList(props.selectedRowId, searchData)"
      />
      <EditDistributionEntranceGuardsModal
        @register="registerEntranceGuardsModal"
        @done="getList(props.selectedRowId, searchData)"
      />
      <SettingDeviceModal
        @register="registerSettingModal"
        @done="getList(props.selectedRowId, searchData)"
      />
    </div> </PageWrapper
></template>

<script lang="ts">
  export default {
    name: 'DistributionCabinet',
  };
</script>

<script lang="ts" setup>
  import { nextTick, Ref, ref, watch } from 'vue';
  import { Radio } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page/index';
  import {
    ActionItem,
    BasicTable,
    useTable,
    TableAction,
    PaginationProps,
  } from '/@/components/Table';
  import { distributionCabinetColumns, accessControlColumns } from '../data';
  import EditDistributionCabinetModal from './editDistributionCabinetModal.vue';
  import SettingDeviceModal from './settingDeviceModal.vue';
  import EditDistributionEntranceGuardsModal from './editDistributionEntranceGuardsModal.vue';
  import { useModal } from '/@/components/Modal';
  import {
    delDistributionCabinetsApi,
    delDistributionEntranceGuardsApi,
    getDistributionCabinetsListApi,
    getDistributionEntranceGuardsListApi,
  } from '/@/api/info/distributionroom';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { GetDistributionRoomListParam } from '/@/api/info/model/distributionroomModel';
  import { map } from 'lodash-es';
  import { error } from '/@/utils/log';

  const loading = ref(false);
  const activeIndex = ref<string>('0');
  const selectedRowIndex = ref<number>(-1);
  const searchData = ref({}) as Ref<GetDistributionRoomListParam>;

  const props = defineProps({
    selectedRowId: {
      type: Number,
    },
  });

  const { createMessage } = useMessage();

  const [registerTable, { setTableData, getPaginationRef, setPagination, setColumns }] = useTable({
    columns: distributionCabinetColumns,
    striped: false,
    ellipsis: false,
    rowClassName: (_, index) => {
      return selectedRowIndex.value === index ? 'ant-table-row-hover' : '';
    },
    actionColumn: {
      width: 180,
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
      getList(props.selectedRowId, {
        ...searchData,
        ...{ pageNo: page.current, pageSize: page.pageSize },
      });
    },
  });

  const [registerCabinetModal, { openModal: openCabinetModal }] = useModal();
  const [registerEntranceGuardsModal, { openModal: openEntranceGuardsModal }] = useModal();
  const [registerSettingModal, { openModal: openSettingModal }] = useModal();

  watch(
    () => props.selectedRowId,
    (value) => {
      searchData.value = { ascending: true, orderBy: 'code', pageNo: 1, pageSize: 10 };
      nextTick(() => {
        getList(value, searchData.value);
      });
    },
  );

  function tabChange(e: ChangeEvent) {
    const value = e.target.value;
    // 0 - 配电柜，1 - 门禁
    if (value === '0') {
      // 设置配电柜table列
      setColumns(distributionCabinetColumns);
      searchData.value.orderBy = 'code';
      delete searchData.value.roomId;
    } else {
      // 设置门禁table列
      setColumns(accessControlColumns);
      searchData.value.orderBy = 'entranceGardSystemId';
      searchData.value.roomId = props.selectedRowId;
    }
    // 获取配电柜、门禁列表
    getList(props.selectedRowId, searchData.value);
  }

  function createActions(record): ActionItem[] {
    if (activeIndex.value === '0') {
      return [
        {
          label: '编辑',
          onClick: () => {
            record.roomId = props.selectedRowId;
            openCabinetModal(true, {
              ...record,
              ...{ type: 'edit' },
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
                await delDistributionCabinetsApi(record.id);
                createMessage.success('删除成功');
                getList(props.selectedRowId, searchData.value);
              } catch (err: any) {
                error(err);
              }
            },
          },
        },
        {
          label: '配置设备',
          onClick: () => {
            record.deviceIds = map(record.devices, 'deviceId');
            openSettingModal(true, { ...record, ...{ deviceCode: record.code } });
          },
        },
      ];
    } else {
      return [
        {
          label: '编辑',
          onClick: () => {
            record.roomId = record.distributionRoomId;
            openEntranceGuardsModal(true, { ...record, ...{ type: 'edit' } });
          },
        },
        {
          label: '删除',
          color: 'error',
          popConfirm: {
            title: '数据删除后将无法恢复，确认删除数据？',
            confirm: async () => {
              try {
                await delDistributionEntranceGuardsApi(record.distributionRoomId, record.id);
                createMessage.success('删除成功');
                getList(props.selectedRowId, searchData.value);
              } catch (err: any) {
                error(err);
              }
            },
          },
        },
      ];
    }
  }

  // 获取配电柜、门禁列表
  async function getList(roomId, searchData) {
    try {
      loading.value = true;
      if (activeIndex.value === '0') {
        const { items, totalCount } = await getDistributionCabinetsListApi(roomId, searchData);
        setTableData(items || []);
        setPagination({
          total: totalCount,
        });
      } else {
        const { items, totalCount } = await getDistributionEntranceGuardsListApi(
          roomId,
          searchData,
        );
        setTableData(items || []);
        setPagination({
          total: totalCount,
        });
      }
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
