import { useUserStoreWithOut } from '/@/store/modules/user';
import { isNil } from 'lodash-es';
import { Dict } from '/@/api/info/model/configModel';

interface DictOptions {
  label: string;
  value: string;
}

/** 二次处理 userStore 保存的状态值(数据字典等) */
export function useUserState() {
  const userStore = useUserStoreWithOut();
  const dicts = userStore.getDicts;

  /**
   * 查找数据字典中相应的数据
   * @param code 数据字典中要查询的 code
   * @param key 数据字典中每条 code 下想要查询的 key
   * @returns 数据字典具体 code 下对应 key 的 name
   */
  function getDictName(code: string, key: string): string {
    if (isNil(dicts[code])) return key;
    const options = dicts[code].options;
    if (isNil(options) || isNil(options[key])) return key;
    return options[key].name;
  }

  /**
   * 选中数据字典中对应 code的数据，并过滤禁用选项
   * @param code 数据字典中要查询的 code
   * @returns 过滤禁用选项后的字典数据
   */
  function getDictByType(code: string): Dict {
    if (isNil(dicts[code])) return { options: {} };
    const options = dicts[code].options;
    const dictOptions = {};
    if (isNil(options)) {
      return { options: {} };
    } else {
      for (const p in options) {
        if (!options[p].disabled) {
          dictOptions[p] = options[p];
        }
      }
    }
    dicts[code].options = dictOptions;
    return dicts[code];
  }

  /**
   * 选中数据字典中对应 code 的数据，转化为可遍历的下拉框选项
   * @param code 数据字典中要查询的 code
   * @returns 字典数据转化为的可用于vue 循环的数组
   * @example getDictOptions('ALGORITHM') => [{value: 'ADD', label: '+'}, {value: 'SUBTRACT', label: '-'}]
   */
  function getDictOptions(code): DictOptions[] {
    const TYPE = getDictByType(code).options;
    const options: DictOptions[] | [] = [];

    for (const key in TYPE) {
      const value = TYPE[key];
      const obj = { value: key, label: value.name };
      (options as DictOptions[]).push(obj);
    }
    return options;
  }

  /**
   * 选中数据字典中对应 code 的数据，转化为 {key:name} 的映射关系
   * @param code 数据字典中要查询的 code
   * @returns 相应字典数据转化出的映射关系
   * @example getDictMap('ALGORITHM') => {ADD: '+', SUBTRACT: '-'}
   */
  function getDictMap(code) {
    const TYPE = getDictByType(code).options;
    const map = {};

    for (const key in TYPE) {
      const value = TYPE[key];
      map[key] = value.name;
    }
    return map;
  }

  return {
    getDictName,
    getDictByType,
    getDictOptions,
    getDictMap,
  };
}
