import { reactive, createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { errorColor } from '/@/settings/designSetting';
import { warn } from '/@/utils/log';

/** 当 modal | drawer嵌套表单时，关闭前校验表单是否发生过变化，如果有变化则弹出提示 */
export function useFormInPopup() {
  let oriFormData = reactive({});

  /** 当 modal | drawer 打开时，备份初始的表单值 */
  function saveInitData(data) {
    console.log('data :>> ', data);
    oriFormData = data;
  }

  /**
   * 对比关闭时的表单值与初始的表单值是否一至，如果不一至，则弹出提示
   * @param title {string} 打开页的标题
   * @param data {object} 关闭前的表单数据
   * @param closeModal {function} 关闭modal | drawer 的方法
   * @returns () => Promise<boolean> | undefined
   */
  function validCloseable(title: string, data: Record<string, any>, close: Function) {
    // 比较 oriFormData 和 data 是否相等
    let flag = true;

    // 在少部分业务逻辑中，修改后的字段不完全等于初始字段，因此比较时只需要比较修改后的字段在初始数据中的值是否发生了改变
    // 如果发生了改变，则弹出提示
    for (const key in data) {
      if (oriFormData[key] !== data[key]) {
        warn(
          `发生变化的 key :>> ${key}, 原本的值 :>> ${oriFormData[key]}, 改变后的值 :>> ${data[key]}`,
        );
      }
      flag = flag && oriFormData[key] === data[key];
    }

    if (flag) {
      return Promise.resolve(true);
    } else {
      Modal.confirm({
        title: title + '未完成，是否退出?',
        icon: createVNode(Icon, { icon: 'carbon:warning', color: errorColor, size: '20' }),
        onOk() {
          close();
          return Promise.resolve(true);
        },
        onCancel() {
          return Promise.resolve(true);
        },
      });
    }
  }

  return {
    saveInitData,
    validCloseable,
  };
}
