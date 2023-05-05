<template>
  <PageWrapper contentFullHeight dense contentBackground :class="prefixCls">
    <BasicForm class="!pt-5 !px-4" @register="registerForm" @submit="handleSearch" />

    <BasicTable @register="registerTable" :loading="loading">
      <template #toolbar>
        <a-button :disabled="!editPerm" type="primary" @click="createMaintenanceOrder">
          新建
        </a-button>

        <Tooltip
          :title="!checkedKeys.length || !editPerm ? '确保有导出权限并至少勾选一条检修单' : null"
          placement="bottom"
        >
          <!-- disable 状态的 button 不能作为子元素出现(https://www.antdv.com/components/tooltip-cn#注意) -->
          <div>
            <!-- 选中多个,可选择导出格式 -->
            <Popover v-if="checkedKeys.length > 1" title="请选择导出格式" placement="bottomRight">
              <template #content>
                <a-button block type="primary" @click="exportData('pdf')">
                  导出为 PDF 文件(方便打印)
                </a-button>
                <Divider />
                <a-button block type="primary" @click="exportData('zip')">
                  导出为压缩包(方便存储)
                </a-button>
              </template>
              <a-button type="primary" :iconSize="16" :disabled="!checkedKeys.length || !editPerm">
                导出
              </a-button>
            </Popover>
            <!-- 仅选中一行, 只能导出 pdf -->
            <a-button
              v-else
              type="primary"
              :iconSize="16"
              :disabled="!checkedKeys.length || !editPerm"
              @click="exportData('pdf')"
            >
              导出
            </a-button>
          </div>
        </Tooltip>

        <a-button :disabled="!configPerm" @click="maintenanceOrderConfig"> 配置 </a-button>
      </template>

      <!-- 检修单编号 -->
      <template #powerCutType="{ record }">
        <div class="flex items-center justify-center">
          <span class="mr-1"> {{ record.code }} </span>
          <Icon
            :color="record.powerCut ? successColor : disabledColor"
            icon="ph:lightning-slash-fill"
          />
        </div>
      </template>

      <!-- 检修对象 -->
      <template #devices="{ record }">
        <span v-if="!record.devices"></span>
        <a-button
          v-else-if="record.devices.length === 1"
          type="primary"
          size="small"
          class="!whitespace-normal !h-auto"
        >
          {{ record.devices[0] }}
        </a-button>
        <Dropdown.Button v-else type="primary" size="small" class="devices-dropdown">
          {{ record.devices[0] }}
          <template #overlay>
            <Menu>
              <Menu.Item v-for="item in drop(record.devices)" :key="(item as string)">
                {{ item }}
              </Menu.Item>
            </Menu>
          </template>
          <template #icon> ... </template>
        </Dropdown.Button>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="createActions(record)"
          :dropDownActions="createDropDownActions(record)"
        />
      </template>
    </BasicTable>

    <SettingDrawer @register="registerDrawer" />
  </PageWrapper>
</template>

<script lang="ts" setup name="MaintenanceOrderList">
  import { nextTick, ref, unref, onMounted } from 'vue';
  import { compact, drop } from 'lodash-es';
  import { Tooltip, Dropdown, Menu, Popover, Divider } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Icon } from '/@/components/Icon';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, TableAction, PaginationProps } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { successColor, disabledColor } from '/@/settings/designSetting';
  import SettingDrawer from './maintenanceSetting.vue';
  import {
    getMaintenanceOrdersApi,
    exportMaintenanceOrdersApi,
  } from '/@/api/maintenance/maintenanceOrder';
  import { GetMaintenanceOrdersParams } from '/@/api/maintenance/model/maintenanceOrderModel';
  import { schemas, columns } from './data';
  import { useMaintenanceOrder } from './hooks';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByData } from '/@/utils/file/download';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();
  const { prefixCls } = useDesign('maintenance-order');
  const { editPerm, configPerm, createActions, createDropDownActions } = useMaintenanceOrder();
  const loading = ref(false);
  const checkedKeys = ref<number[]>([]);
  const checkedRows = ref<Record<string, string>[]>([]);

  const [registerForm, { getFieldsValue }] = useForm({
    schemas,
    labelWidth: 80,
    autoSubmitOnEnter: true,
    fieldMapToTime: [['timeRange', ['planStartTime', 'planStartEndTime'], 'x']],
  });

  const [registerTable, { setTableData, getPaginationRef, setPagination }] = useTable({
    columns,
    ellipsis: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
      onChange: onSelectChange,
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

      const value = getFieldsValue() as GetMaintenanceOrdersParams;
      const form = {
        ...value,
        ...{ pageNo: page.current!, pageSize: page.pageSize! },
      };

      getMaintenanceOrderList(form);
    },
  });
  const [registerDrawer, { openDrawer }] = useDrawer();

  onMounted(() => {
    handleSearch();
  });

  function createMaintenanceOrder() {
    console.log('createMaintenanceOrder :>> ');
  }

  async function exportData(type: 'zip' | 'pdf') {
    const exportTypeMap = new Map<'pdf' | 'zip', 1 | 2>([
      ['pdf', 1],
      ['zip', 2],
    ]);
    const export_codes = unref(checkedKeys);
    const ids = export_codes.join(',');
    loading.value = true;

    try {
      const { data } = await exportMaintenanceOrdersApi(exportTypeMap.get(type)!, ids);

      console.log('data :>> ', data);
      createMessage.success('导出成功, 详见浏览器下载附件');
      const downloadType =
        type === 'pdf' ? 'application/pdf;charset=utf-8' : 'application/zip;charset=utf-8';
      const filename =
        type === 'pdf'
          ? export_codes.length === 1
            ? '检修单' + unref(checkedRows)[0].code + '.pdf'
            : '检修单' + unref(checkedRows)[0].code + '等.pdf'
          : '检修单.zip';
      downloadByData(data, filename, downloadType);
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  function maintenanceOrderConfig() {
    openDrawer(true);
  }

  function onSelectChange(selectedRowKeys: number[], selectedRows: Record<string, string>[]) {
    console.log(selectedRowKeys);
    checkedKeys.value = selectedRowKeys;
    checkedRows.value = selectedRows;
  }

  async function getMaintenanceOrderList(data: GetMaintenanceOrdersParams) {
    // TODO 责任班组和状态都是单选，但是接口要求参数格式为数组，why？另: 如果参数为空，需传入空数组
    data.orgIdList = compact([data.orgIdList as unknown as number]);
    data.status = compact([data.status as unknown as string]);
    loading.value = true;
    try {
      const { items, totalCount } = await getMaintenanceOrdersApi(data);
      setTableData(items || []);
      setPagination({ total: totalCount });
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }

  async function handleSearch() {
    await nextTick();
    const data = getFieldsValue() as GetMaintenanceOrdersParams;
    await getMaintenanceOrderList(data);
  }
</script>

<style lang="less" scoped>
  .devices-dropdown {
    width: 100%;
    white-space: normal;
    ::v-deep(button) {
      white-space: normal;
      height: auto;
    }

    ::v-deep(.ant-dropdown-trigger) {
      height: auto;
    }
  }
</style>
