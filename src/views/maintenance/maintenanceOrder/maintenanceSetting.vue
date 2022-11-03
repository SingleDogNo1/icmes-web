<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="title"
    width="70%"
    :close-func="handleClose"
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
  import SettingTable from './maintenanceSettingTable.vue';
  import CommonTab from './CommonTab.vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import {
    getMaintenanceOrdersConfigApi,
    setMaintenanceOrdersConfigApi,
  } from '/@/api/maintenance/maintenanceOrder';
  import { getPowerCutConfigListApi } from '/@/api/info/powerCutConfig';
  import { MaintenanceOrderConfigurationModel } from '/@/api/maintenance/model/maintenanceOrderModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useFormInPopup } from '/@/hooks/component/useFormInPopup';
  import { maintenanceSettingSchemas as schemas } from './data';

  const { createMessage } = useMessage();
  const { saveInitData, validCloseable } = useFormInPopup();

  const title = '检修单配置';
  const activeKey = ref<'basic' | 'common'>('basic');
  const SettingTableRef = ref();
  const [registerForm, { getFieldsValue, setFieldsValue, validate, resetFields }] = useForm({
    schemas,
    labelWidth: 220,
    autoSubmitOnEnter: true,
    showActionButtonGroup: false,
  });

  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner();

  async function toggleVisible(visible: boolean) {
    if (visible) {
      getMaintenanceOrdersConfig();
    } else {
      resetFields();
    }
  }

  async function getMaintenanceOrdersConfig() {
    setDrawerProps({ loading: true });
    try {
      const { items: powerCutConfigList } = await getPowerCutConfigListApi({
        ascending: false,
        onlyNeedUse: false,
        orderBy: '',
        pageNo: 1,
        pageSize: 0,
      });
      // 生成停送电类型下拉列表
      const powerTypeOptions =
        powerCutConfigList?.map((item) => {
          return {
            label: item.name,
            value: item.workFlowCode,
            disabled: false,
          };
        }) || [];
      SettingTableRef.value.setPowerTypeOptions(powerTypeOptions);

      const maintenanceOrdersConfig = await getMaintenanceOrdersConfigApi();
      // 获取检修单配置，备份获取的数据
      saveInitData(maintenanceOrdersConfig);
      // 重新组织数据，修改关闭时间 & 推送时间 为 当天 0 点 + 经过的时间，供时间控件正常显示
      setFieldsValue({
        ...maintenanceOrdersConfig,
        ...{
          closeUnFinishedTaskTime: parseTime(maintenanceOrdersConfig.closeUnFinishedTaskTime),
          taskPushTime: parseTime(maintenanceOrdersConfig.taskPushTime),
        },
      });
      SettingTableRef.value.genMaintenanceOptions(maintenanceOrdersConfig.items);
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
    // 保存时，重新组织数据，修改关闭时间 & 推送时间 为时间控件显示的时间 - 当天 0 点的时间
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

  function handleClose() {
    const data = getFieldsValue() as MaintenanceOrderConfigurationModel;
    data.closeUnFinishedTaskTime =
      data.closeUnFinishedTaskTime - dateUtil().startOf('day').valueOf();
    data.taskPushTime = data.taskPushTime - dateUtil().startOf('day').valueOf();
    return validCloseable(title, data, closeDrawer);
  }
</script>
