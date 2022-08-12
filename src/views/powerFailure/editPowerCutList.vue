<template>
  <PageWrapper dense contentFullHeight contentBackground title="新建停送电单">
    <BasicForm @register="register">
      <!-- 停送电类型 -->
      <template #type="{ model, field }">
        <ASelect v-model:value="model[field]" allowClear @change="handleChangePowerCutType">
          <ASelect.Option
            v-for="item in powerCutTypeOptions"
            :key="item.workFlowCode"
            :value="item.workFlowCode"
            :powerCutType="item.powerCutType"
          >
            <span> {{ item.name }} </span>
          </ASelect.Option>
          <template #suffixIcon v-if="loadingPowerCutType">
            <LoadingOutlined spin />
          </template>
          <template #notFoundContent v-if="loadingPowerCutType">
            <span>
              <LoadingOutlined spin class="mr-1" />
              {{ t('component.form.apiSelectNotFound') }}
            </span>
          </template>
        </ASelect>
      </template>

      <!-- 停送电联系人 -->
      <template #contactUser="{ model, field }">
        <ASelect v-model:value="model[field]" allowClear show-search optionFilterProp="title">
          <ASelect.Option
            v-for="item in contactUserOptions"
            :key="item.userId"
            :value="item.userId"
            :title="item.name"
          >
            <span> {{ item.name }} </span>
            <span class="text-disabled ml-4"> {{ item.fullOrgName }} </span>
          </ASelect.Option>
          <template #suffixIcon v-if="loadingContactUser">
            <LoadingOutlined spin />
          </template>
          <template #notFoundContent v-if="loadingContactUser">
            <span>
              <LoadingOutlined spin class="mr-1" />
              {{ t('component.form.apiSelectNotFound') }}
            </span>
          </template>
        </ASelect>
      </template>

      <!-- 停送电设备 -->
      <template #mainDeviceIds="{ model, field }">
        <Tooltip placement="right" :visible="showHVTooltip">
          <template #title>{{ HVTooltip }}</template>

          <DeviceList
            :value="model[field]"
            :options="mainDevicesOptions"
            :loading="loadingMainDevices"
            @change="handleChangeMainDevice"
          />
        </Tooltip>
      </template>

      <!-- 停送电关联设备 -->
      <template #assDeviceIds="{ model, field }">
        <!-- 关联设备与主设备共用同一接口数据，因此与主设备共用 loading 状态 -->
        <DeviceList
          :value="model[field]"
          :options="assDevicesOptions"
          :loading="loadingMainDevices"
          @change="handleChangeAssDevice"
        />
      </template>

      <!-- 非常规设备 -->
      <template #irrDeviceIds="{ model, field }">
        <DeviceList
          :value="model[field]"
          :options="irrDevicesOptions"
          :loading="loadingIrrDevices"
          @change="handleChangeIrrDevice"
        />
      </template>
    </BasicForm>

    <template #rightFooter>
      <a-button type="primary" @click="handleSubmit" :loading="loading">提交审批</a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import DeviceList from './components/deviceList.vue';
  import { Select as ASelect, Tooltip } from 'ant-design-vue'; // select 是 html 标签的关键字，最好不要直接使用
  import { useMessage } from '/@/hooks/web/useMessage';
  import { editPowerCutSchemas as schemas } from './editPowerCutData';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getAllAccountTreeApi } from '/@/api/info/organizations';
  import { sortBy } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { getPowerCutConfigListApi } from '/@/api/info/powerCutConfig';
  import { PowerCutConfigExtendEntity } from '/@/api/info/model/powerCutConfigModel';
  import { getPowerCutDevicesListApi } from '/@/api/info/devices';
  import { PowerCutDeviceModel } from '/@/api/info/model/devicesModel';
  import { DevicePowerTypesEnum, DevicePowerTypeCodesEnum } from '/@/enums/powerCutEnum';
  import {
    lowVoltageDeviceTypes,
    highVoltageDeviceTypes,
    specialDeviceTypes,
    remoteDeviceTypes,
  } from '/@/utils/powerCut';

  type DeviceModel = PowerCutDeviceModel & { powerTypeText?: string; label?: string };

  const { projectName } = useGlobSetting();
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const showHVTooltip = ref(false);
  const HVTooltip = ref('');
  const loading = ref(false);

  const powerCutTypeOptions = ref<PowerCutConfigExtendEntity[]>([]);
  const loadingPowerCutType = ref(false);
  // 数组, 至多包含两个值分别为当前选中和上一次选中的 option(类似 watch 方法的 oldVal && newVal, 用于比较类型切换时的状态)
  const typeWatcher = ref<Recordable[]>([]);

  const contactUserOptions = ref<Record<string, any>[]>([]);
  const loadingContactUser = ref(false);

  const mainDevicesOptions = ref<DeviceModel[]>([]);
  const loadingMainDevices = ref(false);
  const checkedMainDevices = ref<DeviceModel['id'][]>([]); // 已选中的主设备(用于与其他设备互斥)
  const checked_hv_main_devices = ref<DeviceModel[]>([]); // 已选中的主设备中的高压设备(用于切换停送电类型时判断)

  const assDevicesOptions = ref<DeviceModel[]>([]);
  const checkedAssDevices = ref<DeviceModel['id'][]>([]); // 已选中的关联设备(用于与其他设备互斥)

  const irrDevicesOptions = ref<DeviceModel[]>([]);
  const loadingIrrDevices = ref(false);
  const checkedIrrDevices = ref<DeviceModel['id'][]>([]); // 已选中的非常规设备(用于与其他设备互斥)

  const [register, { validate, getFieldsValue, setFieldsValue }] = useForm({
    labelCol: { span: 7 },
    wrapperCol: { span: 10 },
    schemas,
    showActionButtonGroup: false,
    fieldMapToTime: [['scheduledTimeRange', ['scheduledCutOffTime', 'scheduledSupplyTime'], 'x']],
  });

  onMounted(() => {
    getPowerCutConfigList();
    getAllAccountTree();
    getMainDevices();
    getIrrDevices();
  });

  async function getPowerCutConfigList() {
    loadingPowerCutType.value = true;
    try {
      const { items } = await getPowerCutConfigListApi({
        ascending: false,
        onlyNeedUse: false,
        orderBy: '',
        pageSize: 0,
        pageNo: 1,
      });

      const options = items || [];

      powerCutTypeOptions.value = options;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loadingPowerCutType.value = false;
    }
  }

  async function getAllAccountTree() {
    loadingContactUser.value = true;
    try {
      const { items } = await getAllAccountTreeApi({});
      const accountList = sortBy(items, 'code').filter((v) => v.fullOrgName !== null);
      const contact_user_options = accountList.reduce((res, pre) => {
        res.push({
          userId: pre.userId,
          name: pre.name,
          fullOrgName:
            pre.fullOrgName === projectName
              ? pre.fullOrgName
              : pre.fullOrgName?.replace(`${projectName}/`, ''),
        });
        return res;
      }, [] as { userId: number; name: string; fullOrgName: string }[]);
      contactUserOptions.value = contact_user_options;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loadingContactUser.value = false;
    }
  }

  async function getMainDevices() {
    loadingMainDevices.value = true;
    try {
      const { items } = await getPowerCutDevicesListApi({
        needTree: false,
        orderBy: 'processNo',
        pageSize: 0,
        powerTypes: [...highVoltageDeviceTypes, ...lowVoltageDeviceTypes],
      });

      const devices: DeviceModel[] = items || [];
      devices.map((item) => {
        let text = '';
        switch (item.powerType) {
          case DevicePowerTypeCodesEnum.HIGH_VOLTAGE:
            text = '高压';
            break;

          case DevicePowerTypeCodesEnum.REMOTE_HIGH_VOLTAGE:
            text = '高压,远程';
            break;

          case DevicePowerTypeCodesEnum.REMOTE_LOW_VOLTAGE:
          case DevicePowerTypeCodesEnum.REMOTE_UNCONVENTIONAL_DEVICE:
            text = '远程';
            break;
        }
        item.powerTypeText = text; // 停送电类型转换为汉字显示
        item.label = `${item.processNo || item.code} ${item.name}`;
      });
      console.log('devices :>> ', devices);
      mainDevicesOptions.value = devices;
      assDevicesOptions.value = devices;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loadingMainDevices.value = false;
    }
  }

  async function getIrrDevices() {
    loadingIrrDevices.value = true;
    try {
      const { items } = await getPowerCutDevicesListApi({
        needTree: false,
        orderBy: 'processNo',
        pageSize: 0,
        powerTypes: specialDeviceTypes,
      });

      const devices: DeviceModel[] = items || [];
      devices.map((item) => {
        item.label = `${item.processNo || item.code} ${item.name}`;
        const text = remoteDeviceTypes.includes(item.powerType) ? '远程' : '';
        item.powerTypeText = text; // 停送电类型转换为汉字显示
      });

      console.log('devices :>> ', devices);
      irrDevicesOptions.value = devices;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loadingIrrDevices.value = false;
    }
  }

  function visibleHVDeviceTooltip(options: DeviceModel[]) {
    const value = getFieldsValue();
    console.log('value :>> ', value);

    const hvDevices = options.filter((option) => highVoltageDeviceTypes.includes(option.powerType));
    checked_hv_main_devices.value = hvDevices;
    showHVTooltip.value = hvDevices.length > 0;
    if (hvDevices.length > 0) {
      const codes = hvDevices.reduce((res, pre) => {
        res.push(pre.processNo || pre.code);
        return res;
      }, [] as string[]);
      HVTooltip.value = `${codes.join('、')}为高压设备`;
    }
  }

  function handleChangePowerCutType(data: string, option: PowerCutConfigExtendEntity) {
    if (data.includes('ELEC_SP')) {
      showHVTooltip.value = false;
    }

    const formModel = getFieldsValue();

    // 记录类型切换的数据监听
    typeWatcher.value.push(option);
    if (typeWatcher.value.length > 2) {
      typeWatcher.value.shift();
    }

    console.log('data :>> ', data, typeWatcher.value, option, checked_hv_main_devices.value);

    /*
            option.powerCutType === 2  当前选中低压
            typeWatcher.value.length === 1  表示第一次切换停送电类型
            typeWatcher.value.length === 2 至少切换过两次停送电类型, 数组第一位为前一次选中类型的 option
            ==>
            已存在选择的高压设备时, 未选中状态变低压, 或者高压变低压, 警告
          */
    if (
      checked_hv_main_devices.value.length &&
      ((option.powerCutType === DevicePowerTypesEnum['LOW_VOLTAGE'] &&
        typeWatcher.value.length === 1) ||
        (option.powerCutType === DevicePowerTypesEnum['LOW_VOLTAGE'] &&
          typeWatcher.value.length === 2 &&
          typeWatcher.value[0].powerCutType === DevicePowerTypesEnum['HIGH_VOLTAGE']))
    ) {
      createConfirm({
        title: '当前所选设备中含有高压设备，选择低压停电类型时会删除高压设备，确认是否更改？',
        iconType: 'warning',
        onOk() {
          // 重新获取主设备
          getMainDevices();
        },
        onCancel() {
          setFieldsValue({
            type: typeWatcher.value.length > 1 ? typeWatcher.value[0].value : null,
          });
        },
      });
    }

    /*
      data.startsWith('ELEC_SP')  类型为特殊停送电类型
      option.powerCutType === 3  当前选中特殊停送电
      typeWatcher.value.length === 2 至少切换过两次停送电类型, 数组第一位为前一次选中类型的 option
      ==>
      已选中设备的条件下, 高压或低压变为特殊停送电; 或者特殊停送电变为高压或低压, 警告
    */
    const selectedDevices = [
      ...(formModel.mainDeviceIds ?? []),
      ...(formModel.assDeviceIds ?? []),
      ...(formModel.irregularDeviceIds ?? []),
    ];

    if (
      (selectedDevices?.length &&
        data.startsWith('ELEC_SP') &&
        option.powerCutType === 3 &&
        typeWatcher.value.length === 2 &&
        [1, 2].includes(typeWatcher.value[0].powerCutType)) ||
      (formModel.content &&
        !data.startsWith('ELEC_SP') &&
        [1, 2].includes(option.powerCutType) &&
        typeWatcher.value.length === 2 &&
        typeWatcher.value[0].powerCutType === 3)
    ) {
      createConfirm({
        title: '更换停电类型, 所选设备或输入内容会丢失,是否确认更换?',
        iconType: 'warning',
        onOk() {
          console.log('ok :>> ');
        },
        onCancel() {
          setFieldsValue({
            type: typeWatcher.value[0].value,
          });
        },
      });
    }

    if ([1, 2].includes(option.powerCutType)) {
      getMainDevices();
    }
  }

  function handleChangeMainDevice(value: DeviceModel['id'][], options: DeviceModel[]) {
    setFieldsValue({ mainDeviceIds: value });
    visibleHVDeviceTooltip(options);
    checkedMainDevices.value = value;
  }

  function handleChangeAssDevice(value: DeviceModel['id'][], options: DeviceModel[]) {
    console.log('options :>> ', value, options);
    setFieldsValue({ assDeviceIds: value });
    checkedAssDevices.value = value;
  }

  function handleChangeIrrDevice(value: DeviceModel['id'][], options: DeviceModel[]) {
    console.log('value, options :>> ', value, options);
    setFieldsValue({ irregularDeviceIds: value });
    checkedIrrDevices.value = value;
  }

  async function handleSubmit() {
    try {
      await validate();
      loading.value = true;
      setTimeout(() => {
        createMessage.success('提交成功！');
        const value = getFieldsValue();
        console.log('value :>> ', value);
      }, 2000);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
