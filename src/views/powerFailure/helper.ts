import { DevicePowerTypesEnum } from '/@/enums/powerCutEnum';
import { getPowerCutDevicesListApi } from '/@/api/info/devices';
import { PowerCutDeviceModel } from '/@/api/info/model/devicesModel';
import { cloneDeep } from 'lodash-es';
import { lowVoltageDeviceTypes, highVoltageDeviceTypes } from '/@/utils/powerCut';

export async function getDevicesList(option) {
  let powerTypes: number[];

  switch (option.powerCutType) {
    case DevicePowerTypesEnum['HIGH_VOLTAGE']:
      powerTypes = [...highVoltageDeviceTypes, ...lowVoltageDeviceTypes];
      break;
    case DevicePowerTypesEnum['LOW_VOLTAGE']:
      powerTypes = lowVoltageDeviceTypes;
      break;
  }

  const { items } = await getPowerCutDevicesListApi({
    needTree: false,
    orderBy: 'processNo',
    pageSize: 0,
    powerTypes,
  });
  console.log('items :>> ', items);
  const options = cloneDeep(items || []) as (PowerCutDeviceModel & {
    label: string; // option 显示标题
    value: number; // select 组件绑定值
    title: string; // option 补充说明的二级标题
  })[];

  options.map((item) => {
    item.label = (item.processNo || item.code) + item.name;
    item.title = !item.isPrimary ? item.primaryName : '';
    item.value = item.id;
  });

  return options;
}
