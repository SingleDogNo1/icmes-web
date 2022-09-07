<template>
  <PageWrapper contentFullHeight dense contentBackground :class="prefixCls">
    <BasicForm class="!pt-5 !px-4" @register="registerForm" @submit="handleSearch" />

    <BasicTable @register="registerTable" :loading="loading">
      <template #toolbar>
        <a-button :disabled="!editPerm" type="primary" @click="createMaintenanceOrder">
          新建
        </a-button>
        <a-button :disabled="!editPerm" type="primary" @click="exportData"> 导出 </a-button>
        <a-button :disabled="!configPerm" @click="maintenanceOrderConfig"> 配置 </a-button>
      </template>

      <!-- 检修单编号 -->
      <template #powerCutType="{ record }">
        <div class="flex items-center justify-center">
          <span class="mr-1"> {{ record.code }} </span>
          <img v-if="record.powerCut" src="./power.png" class="h-3" alt="" />
          <img v-else src="./power-off.png" class="h-3" alt="" />
        </div>
      </template>

      <!-- 检修对象 -->
      <template #devices="{ record }">
        <span v-if="!record.devices"></span>
        <a-button v-else-if="record.devices.length === 1" type="primary" size="small">
          {{ record.devices[0] }}
        </a-button>
        <Dropdown.Button v-else type="primary" size="small">
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
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'MaintenanceOrderList',
  };
</script>

<script lang="ts" setup>
  import { nextTick, ref, onMounted } from 'vue';
  import { compact, drop } from 'lodash-es';
  import { Dropdown, Menu } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable, TableAction, PaginationProps } from '/@/components/Table';
  import { getMaintenanceOrdersApi } from '/@/api/maintenance/maintenanceOrder';
  import { GetMaintenanceOrdersParams } from '/@/api/maintenance/model/maintenanceOrderModel';
  import { schemas, columns } from './data';
  import { useMaintenanceOrder } from './hooks';

  const { prefixCls } = useDesign('maintenance-order');
  const { editPerm, configPerm, createActions, createDropDownActions } = useMaintenanceOrder();
  const loading = ref(false);
  const checkedKeys = ref<number[]>([]);

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
      selectedRowKeys: checkedKeys.value,
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

  onMounted(() => {
    handleSearch();
  });

  function createMaintenanceOrder() {
    console.log('createMaintenanceOrder :>> ');
  }

  function exportData() {
    console.log('exportData :>> ');
  }

  function maintenanceOrderConfig() {
    console.log('maintenanceOrderConfig :>> ');
  }

  function onSelectChange(selectedRowKeys: number[]) {
    console.log(selectedRowKeys);
    checkedKeys.value = selectedRowKeys;
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
    } catch (error: any) {
      throw new Error(error);
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
