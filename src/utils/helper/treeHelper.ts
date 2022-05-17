import { DeviceModel } from '/@/api/info/model/devicesModel';
interface TreeHelperConfig {
  id: string;
  children: string;
  parentId: string;
  name?: string;
}
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  parentId: 'parentId',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

// 根据父子id关系将列表组织为树结构
export function listToTreeAsParentId<T = any>(
  list: any[],
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, children, parentId } = conf;

  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[parentId]);
    (parent ? parent[children] : result).push(node);
  }
  return result;
}

/**
 * @description 根据分类关系将列表组织为树结构
 * @param list
 * @param config
 * @returns
 * @example
    const list = [
      { id: 3339, parentPathName: '103斗式提升机', name: '斗式提升机', categoryId: 88, categoryName: '斗式提升机' },
      { id: 3694, parentPathName: '377斗式提升机', name: '斗式提升机', categoryId: 88, categoryName: '斗式提升机' },
      { id: 4028, parentPathName: '设备NSF001', name: '设备NSF001', categoryId: 0, categoryName: null },
      { id: 4037, parentPathName: '设备NSF003', name: '设备NSF003', categoryId: 0, categoryName: null },
      { id: 3619, parentPathName: '315离心机', name: '离心机', categoryId: 22, categoryName: '卧式振动离心机' },
    ]
    ========>
    [
      {
        name: '全部',
        id: -1,
        children: [
          {
            name: '斗式提升机',
            id: 88,
            children: [
              { id: 3339, parentPathName: '103斗式提升机', name: '斗式提升机', categoryId: 88, categoryName: '斗式提升机' },
              { id: 3694, parentPathName: '377斗式提升机', name: '斗式提升机', categoryId: 88, categoryName: '斗式提升机' }
            ]
          },
          {
            name: '未知',
            id: 0,
            children: [
              { id: 4028, parentPathName: '设备NSF001', name: '设备NSF001', categoryId: 0, categoryName: null },
              { id: 4037, parentPathName: '设备NSF003', name: '设备NSF003', categoryId: 0, categoryName: null }
            ]
          },
          {
            name: '卧式振动离心机',
            id: 22,
            children: [
              { id: 3619, parentPathName: '315离心机', name: '离心机', categoryId: 22, categoryName: '卧式振动离心机' }
            ]
          }
        ]
      }
    ]
 */
export function listToTreeAsGroup(
  list: any[],
  config: Partial<TreeHelperConfig> = { parentId: 'categoryId', id: 'id', name: 'categoryName' },
) {
  const conf = getConfig(config) as TreeHelperConfig;
  console.log('conf', conf);

  const menus = list.reduce((res, pre) => {
    const keys = res.reduce((res1, pre1) => {
      res1.push(pre1[conf.id]);
      return res1;
    }, []);
    if (!keys.includes(pre[conf.parentId])) {
      res.push({
        name: pre[conf.name!] || '未知',
        id: pre[conf.parentId],
        children: [],
      });
    }
    return res;
  }, []);

  console.log(list, menus);

  list.map((item) => {
    menus.map((menu) => {
      if (item[conf.parentId] === menu.id) {
        menu.children.push(item);
      }
    });
  });

  return [
    {
      name: '全部',
      id: -1,
      children: menus,
    },
  ];
}

export function treeToList<T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T {
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

export function findNode<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | null {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  for (const node of list) {
    if (func(node)) return node;
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

export function findNodeAll<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  const result: T[] = [];
  for (const node of list) {
    func(node) && result.push(node);
    node[children!] && list.push(...node[children!]);
  }
  return result;
}

export function findPath<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | T[] | null {
  config = getConfig(config);
  const path: T[] = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

export function findPathAll(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) {
  config = getConfig(config);
  const path: any[] = [];
  const list = [...tree];
  const result: any[] = [];
  const visitedSet = new Set(),
    { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
}

export function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  config = getConfig(config);
  const children = config.children as string;
  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
}

export function forEach<T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {},
): void {
  config = getConfig(config);
  const list: any[] = [...tree];
  const { children } = config;
  for (let i = 0; i < list.length; i++) {
    //func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (func(list[i])) {
      return;
    }
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children]);
  }
}

/**
 * @description: Extract tree specified structure
 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * @description: Extract tree specified structure
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn },
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion,
        }),
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}

/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
export function eachTree(treeDatas: any[], callBack: Fn, parentNode = {}) {
  treeDatas.forEach((element) => {
    const newNode = callBack(element, parentNode) || element;
    if (element.children) {
      eachTree(element.children, callBack, newNode);
    }
  });
}

/**
 * 为树结构数据每一层添加当前层数信息
 * @param array 需要添加层级的树
 * @param levelName 添加标识层级的键值
 * @param childrenName 树结构的子集标识
 */
export function addTreeLevel(array, levelName = 'folderLevel', childrenName = 'children') {
  if (!Array.isArray(array)) return [];
  const recursive = (array, level = 0) => {
    level++;
    return array.map((v) => {
      v[levelName] = level;
      const child = v[childrenName];
      if (child && child.length) recursive(child, level);
      return v;
    });
  };
  return recursive(array);
}

/**
 * 业务函数: 根据附属设备数量构建的设备类型树
 * @param items 设备树列表
 * @param id 根节点 ID
 * @returns 按设备本体+设备类型构造的设备树
 */
export function formatDeviceTypeTree(items: DeviceModel[], id = '-1') {
  const tree: any[] = [];
  items.forEach((item) => {
    const obj: DeviceModel & {
      /** 当前层级是否为目录 */
      isFolder?: boolean;
      /** tree 组件显示的 title */
      titleText?: string;
      children?: any[];
    } = { ...item };
    if (item.categoryTreeParentId === id) {
      obj.name = item.name || '未分配设备类型';
      obj.categoryName = item.categoryName || '未分配设备类型';
      obj.isFolder = item.appurtenanceCount > 0;
      obj.titleText =
        obj.code && obj.categoryTreeParentId === '-1'
          ? obj.name
          : obj.processNo && obj.code && !['-1', 'A'].includes(obj.categoryTreeParentId)
          ? `${obj.processNo} ${obj.name} ${obj.code}`
          : !obj.processNo && obj.code && !['-1', 'A'].includes(obj.categoryTreeParentId)
          ? `${obj.name} ${obj.code}`
          : obj.name;

      if (item.appurtenanceCount > 0) {
        obj.children = formatDeviceTypeTree(items, obj.categoryTreeId);
      }
      tree.push(obj);
    }
  });

  addTreeLevel(tree);
  return tree;
}
