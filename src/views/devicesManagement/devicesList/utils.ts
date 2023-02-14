import { DeviceModel as DeviceBaseModel } from '/@/api/info/model/devicesModel';

type DeviceModel = DeviceBaseModel & {
  label?: string;
  children?: DeviceModel[];
};

export function deviceListToTree(items: DeviceModel[], id = -1): DeviceModel[] {
  const tree: DeviceModel[] = [];
  items.map((item) => {
    const obj = { ...item };
    if (item.parentId === id) {
      obj.label = item.name;

      if (item.appurtenanceCount > 0) {
        obj.children = deviceListToTree(items, obj.id);
      }
      tree.push(obj);
    }
  });
  return tree;
}
