import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { getProcessListApi } from '/@/api/info/process';
import { getLocationListApi } from '/@/api/info/location';
import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { error } from '/@/utils/log';

const { getOrganizationTree: organizationTree } = useUserStoreWithOut();

async function getProcessTree(params) {
  try {
    const { items } = await getProcessListApi(params);
    const tree = listToTreeAsParentId(items || []);
    return new Promise((resolve) => {
      resolve(tree);
    });
  } catch (err: any) {
    error(err);
  }
}

async function getLocationTree() {
  try {
    const { items } = await getLocationListApi();
    const tree = listToTreeAsParentId(items || []);
    return new Promise((resolve) => {
      resolve(tree);
    });
  } catch (err: any) {
    error(err);
  }
}

export const schemas: FormSchema[] = [
  {
    field: 'ascending',
    label: '升序',
    component: 'Checkbox',
    required: true,
    defaultValue: true,
    show: false,
  },
  {
    field: 'orderBy',
    label: '排序字段',
    component: 'Input',
    defaultValue: '',
    show: false,
  },
  {
    field: 'pageNo',
    label: '当前页',
    component: 'InputNumber',
    defaultValue: 1,
    show: false,
  },
  {
    field: 'pageSize',
    label: '每页条数',
    component: 'InputNumber',
    defaultValue: 10,
    show: false,
  },
  {
    field: 'globalName',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      maxlength: 20,
      placeholder: '名称/设备编号/编号',
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '编号',
    dataIndex: 'code',
  },
  {
    title: '工艺系统',
    dataIndex: 'processName',
  },
  {
    title: '设备编号',
    dataIndex: 'processNo',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
];

export const detailFormSchemas: FormSchema[] = [
  {
    field: 'code',
    label: '编号',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'processNo',
    label: '设备编号',
    component: 'Input',
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'processId',
    label: '工艺系统',
    component: 'ApiTreeSelect',
    componentProps: {
      api: getProcessTree,
      showSearch: true,
      treeNodeFilterProp: 'name',
      fieldNames: {
        label: 'name',
        value: 'id',
      },
      params: {
        forTree: true,
        orderBy: 'Code',
        ascending: true,
      },
    },
  },
  {
    field: 'organizationFullName',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      showSearch: true,
      treeNodeFilterProp: 'name',
      maxlength: 15,
      placeholder: '请输入',
      treeData: organizationTree,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
    },
  },
  {
    field: 'locationId',
    label: '位置',
    component: 'ApiTreeSelect',
    componentProps: {
      api: getLocationTree,
      showSearch: true,
      treeNodeFilterProp: 'name',
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
  },
  {
    field: 'model',
    label: '型号',
    component: 'Input',
    componentProps: {
      maxlength: 20,
    },
  },
  {
    field: 'memo',
    label: '备注信息',
    component: 'InputTextArea',
    componentProps: {
      showCount: true,
      maxlength: 250,
      autoSize: {
        minRows: 3,
      },
    },
  },
  // ------------------ hidden fields ------------------
  {
    field: 'createTime',
    label: '创建时间',
    component: 'Input',
    show: false,
  },
  {
    field: 'createUserId',
    label: '创建用户ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'updateTime',
    label: '最后修改时间',
    component: 'Input',
    show: false,
  },
  {
    field: 'updateUserId',
    label: '最后修改用户',
    component: 'Input',
    show: false,
  },
  {
    field: 'versionTag',
    label: '用于高并发的数据版本控制',
    component: 'Checkbox',
    show: false,
  },
];
