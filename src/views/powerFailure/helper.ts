import { DevicePowerTypesEnum, DevicePowerTypeCodesEnum } from '/@/enums/powerCutEnum';
import { getPowerCutDevicesListApi } from '/@/api/info/devices';
import { PowerCutDeviceModel } from '/@/api/info/model/devicesModel';
import { cloneDeep } from 'lodash-es';

export async function getDevicesList(option) {
  let powerTypes;

  switch (option.powerCutType) {
    case DevicePowerTypesEnum['HIGH_VOLTAGE']:
      powerTypes = [
        DevicePowerTypeCodesEnum['HIGH_VOLTAGE'],
        DevicePowerTypeCodesEnum['LOW_VOLTAGE'],
        DevicePowerTypeCodesEnum['REMOTE_HIGH_VOLTAGE'],
        DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE'],
      ];
      break;
    case DevicePowerTypesEnum['LOW_VOLTAGE']:
      powerTypes = [
        DevicePowerTypeCodesEnum['LOW_VOLTAGE'],
        DevicePowerTypeCodesEnum['REMOTE_LOW_VOLTAGE'],
      ];
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
