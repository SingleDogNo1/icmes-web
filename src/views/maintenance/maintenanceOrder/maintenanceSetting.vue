<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="检修单配置"
    width="70%"
    @visible-change="toggleVisible"
  >
    <Tabs v-model:activeKey="activeKey" animated>
      <Tabs.TabPane key="basic" tab="基本" forceRender>
        <BasicForm @register="registerForm">
          <template #items="{ model, field }: any">
            <SettingTable ref="SettingTableRef" :data="model[field]" />
            <a-button
              block
              type="primary"
              preIcon="ant-design:plus-outlined"
              @click="add(model[field])"
            >
              添加
            </a-button>
          </template>
        </BasicForm>
        <a-button @click="save"> 保存 </a-button>
      </Tabs.TabPane>
      <Tabs.TabPane key="common" tab="通用措施" forceRender>
        <CommonTab />
      </Tabs.TabPane>
    </Tabs>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';
  import SettingTable from './mainrenanceSettingTable.vue';
  import CommonTab from './CommonTab.vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import {
    getMaintenanceOrdersConfigApi,
    setMaintenanceOrdersConfigApi,
  } from '/@/api/maintenance/maintenanceOrder';
  import { getPowerCutConfigListApi } from '/@/api/info/powerCutConfig';
  import { MaintenanceOrderConfigurationModel } from '/@/api/maintenance/model/maintenanceOrderModel';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const activeKey = ref<'basic' | 'common'>('basic');
  const SettingTableRef = ref();
  const [registerForm, { getFieldsValue, setFieldsValue, validate }] = useForm({
    schemas: [
      {
        field: 'taskPushTime',
        label: '检修任务每日推送时间',
        component: 'TimePicker',
        required: true,
        componentProps: {
          valueFormat: 'x',
        },
      },
      {
        field: 'autoCloseUnFinishedTask',
        label: '当日检修任务未执行是否自动作废',
        component: 'Switch',
        defaultValue: false,
      },
      {
        field: 'closeUnFinishedTaskTime',
        label: '作废时间为次日',
        component: 'TimePicker',
        componentProps: {
          valueFormat: 'x',
        },
        show: ({ values }) => {
          return !!values.autoCloseUnFinishedTask;
        },
      },
      {
        field: 'onlyApplyMaintenance',
        label: '检修单与停电单关联时的审批配置',
        component: 'RadioGroup',
        defaultValue: true,
        componentProps: {
          options: [
            {
              label: '只审批检修单',
              value: true,
            },
            {
              label: '检修单和停电单各自审批',
              value: false,
            },
          ],
        },
      },
      {
        field: 'items',
        label: '检修单与停电单类型的匹配',
        component: 'Divider',
        labelWidth: '100px',
      },
      {
        field: 'items',
        label: '',
        component: 'Input',
        slot: 'items',
      },
      // ------------------------ hidden fields ------------------------
      {
        field: 'exportName',
        label: '导出检修计划的命名',
        component: 'Input',
        show: false,
      },
      {
        field: 'generalMeasures',
        label: '通用措施',
        component: 'Input',
        show: false,
      },
      {
        field: 'id',
        label: 'ID',
        component: 'InputNumber',
        show: false,
      },
    ],
    labelWidth: 220,
    autoSubmitOnEnter: true,
    showActionButtonGroup: false,
  });

  const [register, { setDrawerProps }] = useDrawerInner();

  async function toggleVisible(visible: boolean) {
    if (visible) {
      getMaintenanceOrdersConfig();
    } else {
      setFieldsValue({});
    }
  }

  async function getMaintenanceOrdersConfig() {
    setDrawerProps({ loading: true });
    try {
      const maintenanceOrdersConfig = await getMaintenanceOrdersConfigApi();
      parseTime(maintenanceOrdersConfig.closeUnFinishedTaskTime);
      setFieldsValue({
        ...maintenanceOrdersConfig,
        ...{
          closeUnFinishedTaskTime: parseTime(maintenanceOrdersConfig.closeUnFinishedTaskTime),
          taskPushTime: parseTime(maintenanceOrdersConfig.taskPushTime),
        },
      });
      SettingTableRef.value.genMaintenanceOptions(maintenanceOrdersConfig.items);

      const { items: powerCutConfigList } = await getPowerCutConfigListApi({
        ascending: false,
        onlyNeedUse: false,
        orderBy: '',
        pageNo: 1,
        pageSize: 0,
      });

      const powerTypeOptions =
        powerCutConfigList?.map((item) => {
          return {
            label: item.name,
            value: item.workFlowCode,
            disabled: false,
          };
        }) || [];

      SettingTableRef.value.setPowerTypeOptions(powerTypeOptions);
      SettingTableRef.value.genPowerTypeOptions(maintenanceOrdersConfig.items);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  }

  function parseTime(stamp: number | string) {
    // dayjs().format('x')格式为字符串格式的数字
    return dateUtil().startOf('day').valueOf() + parseInt(stamp) + '';
  }

  function add(arr) {
    arr.push({
      maintenanceType: [],
      powerType: '',
    });
  }

  async function save() {
    await validate();
    setDrawerProps({ loading: true });
    const data = getFieldsValue() as MaintenanceOrderConfigurationModel;
    data.closeUnFinishedTaskTime =
      data.closeUnFinishedTaskTime - dateUtil().startOf('day').valueOf();
    data.taskPushTime = data.taskPushTime - dateUtil().startOf('day').valueOf();

    try {
      await setMaintenanceOrdersConfigApi(data);
      createMessage.success('保存成功');
      await getMaintenanceOrdersConfig();
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setDrawerProps({ loading: false });
    }
  }
</script>
