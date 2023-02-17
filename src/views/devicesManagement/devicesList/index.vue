<template>
  <PageWrapper contentFullHeight contentBackground>
    <BasicForm @register="registerForm" @submit="search">
      <template #advanceBefore>
        <a-button @click="toAdvanceSearch">更多查询</a-button>
      </template>
    </BasicForm>
    <BasicTable @register="registerTable" :loading="deviceTableLoading">
      <template #tableTitle>
        <a-button :disabled="!hasEditPermission" type="primary" class="mr-2" @click="addDevice">
          新建设备台账
        </a-button>
        <a-button :disabled="!hasEditPermission" @click="addAttachDevice">新建附属设备</a-button>
      </template>
      <template #toolbar>
        <a-button type="primary" :disabled="!hasQRCodePermission" @click="exportQRCode">
          导出二维码
        </a-button>
      </template>

      <template #deviceName="{ record }">
        <span class="text-primary" @click="showDeviceDetail(record)"> {{ record.name }} </span>
      </template>

      <template #location="{ record }">
        <Popover>
          <template #content>
            <p>{{ record.locationFullName }}</p>
          </template>
          <a-button type="link">{{ record.locationParentName || record.locationName }}</a-button>
        </Popover>
      </template>

      <template #status="{ record }">
        <div class="w-full h-full flex items-center justify-center">
          <span class="w-3 h-3 rounded-full mr-1.5" :class="setStatusBgColor(record.status)"></span>
          <span>{{ getDictName('DEVICE_STATUS', record.status) }}</span>
        </div>
      </template>

      <template #deviceType="{ record }">
        {{ getDictName('DEVICE_TYPE', record.deviceType) }}
      </template>

      <template #specDataFullName="{ record }">
        {{ getDictName('DEVICE_TYPE', record.specDataFullName) }}
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="createActions(record)"
          :dropDownActions="createDropDownActions(record)"
        />
      </template>
    </BasicTable>

    <EditDeviceDrawer @register="registerEditDeviceDrawer" />

    <ExportQRCodeDrawer @register="registerExportQRCodeDrawer" />
  </PageWrapper>
</template>

<script lang="ts" setup name="DeviceList">
  // !组件名不能只有一个单词构成，并且遵循首字母大写的驼峰命名
  import { ref, nextTick, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    BasicTable,
    useTable,
    PaginationProps,
    TableAction,
    ActionItem,
  } from '/@/components/Table';
  import EditDeviceDrawer from './components/EditDeviceDrawer.vue';
  import ExportQRCodeDrawer from './components/ExportQRCode.vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { getDevicesListApi, delDeviceApi, exportDeviceQRCodeApi } from '/@/api/info/devices';
  import { DeviceModel, GetDevicesListParam } from '/@/api/info/model/devicesModel';
  import { Popover } from 'ant-design-vue';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByData } from '/@/utils/file/download';
  import { useDrawer } from '/@/components/Drawer';
  import { schemas, columns } from './data';
  import { deviceListToTree } from './utils';

  const router = useRouter();
  const { getDictName } = useUserState();
  const { createMessage } = useMessage();

  const {
    meta: { code },
  } = useRoute();
  const { getFeature } = useUserStore();
  const hasEditPermission = getFeature[code!].DEVICE_EDIT;
  const hasQRCodePermission = getFeature[code!].DEVICE_QRCODE;

  const deviceTableLoading = ref(false);

  const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({ schemas });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    isTreeTable: true,
    rowKey: 'id',
    columns,
    actionColumn: {
      width: 120,
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
        search();
      });
    },
  });

  const [registerEditDeviceDrawer, { openDrawer: openEditDeviceDrawer }] = useDrawer();
  const [registerExportQRCodeDrawer, { openDrawer: openExportQRCodeDrawer }] = useDrawer();

  onMounted(() => {
    search();
  });

  async function search() {
    deviceTableLoading.value = true;
    await nextTick();
    const fields = getFieldsValue();
    // 不知道为什么，后台定义接口必须要求是数组格式
    const formData = {
      ...fields,
      ...{
        deviceTypeList: fields.deviceTypeList ? [fields.deviceTypeList] : [],
        category: fields.category ? [fields.category] : [],
        location: fields.location ? [fields.location] : [],
        status: fields.status ? [fields.status] : [],
      },
    };

    try {
      const { items, totalCount } = await getDevicesListApi(formData as GetDevicesListParam);
      setTableData(deviceListToTree(items || []));
      setPagination({ total: totalCount });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      deviceTableLoading.value = false;
    }
  }

  function toAdvanceSearch() {
    router.push({ name: 'devicesManagementAdvanceList' });
  }

  function addDevice() {
    openEditDeviceDrawer(true, { method: 'create', type: 'primary', data: null });
  }

  function addAttachDevice() {
    openEditDeviceDrawer(true, { method: 'create', type: 'attach', data: null });
  }

  function exportQRCode() {
    openExportQRCodeDrawer(true, {});
  }

  function showDeviceDetail(record: DeviceModel) {
    openEditDeviceDrawer(true, {
      method: 'view',
      type: record.isPrimary ? 'primary' : 'attach',
      data: record,
    });
  }

  function setStatusBgColor(status: DeviceModel['status']) {
    switch (status) {
      case 'DEVICE_INUSE': // 在用设备
        return 'bg-success';
        break;
      case 'DEVICE_TOREPAIR': // 待修设备
        return 'bg-warning';
        break;
      case 'DEVICE_SPARE': // 备用设备
        return 'bg-primary';
        break;
      case 'DEVICE_TOSCRAPE': // 待报废
        return 'bg-error';
        break;
      case 'DEVICE_SCRAPE': // 已报废
        return 'bg-black';
        break;
      default:
        return 'bg-disabled';
    }
  }

  function createActions(record: DeviceModel): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: () => {
          showDeviceDetail(record);
        },
      },
    ];
  }

  function createDropDownActions(record: DeviceModel): ActionItem[] {
    return [
      {
        label: '编辑',
        disabled: !hasEditPermission,
        onClick: () => {
          openEditDeviceDrawer(true, {
            method: 'edit',
            type: record.isPrimary ? 'primary' : 'attach',
            data: record,
          });
        },
      },
      {
        label: '新增附属',
        disabled: !hasEditPermission,
        onClick: () => {
          openEditDeviceDrawer(true, {
            method: 'edit',
            type: record.isPrimary ? 'primary' : 'attach',
            data: record,
          });
        },
      },
      {
        label: '下载二维码',
        ifShow: record.isPrimary,
        disabled: !hasQRCodePermission,
        onClick: async () => {
          try {
            const data = await exportDeviceQRCodeApi({ deviceIds: [record.id] });
            downloadByData(data, record.name + '.zip');
          } catch (error: any) {
            throw new Error(error);
          }
        },
      },
      {
        label: '删除',
        disabled: !hasEditPermission,
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            try {
              await delDeviceApi(record.id);
              createMessage.success('删除成功');
              await search();
            } catch (error: any) {
              throw new Error(error);
            }
          },
        },
      },
    ];
  }
</script>
