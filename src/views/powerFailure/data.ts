import { ref } from 'vue';
import { dateUtil } from '/@/utils/dateUtil';
import type { FormSchema } from '/@/components/Form/index';
import type { BasicColumn } from '/@/components/Table';
import { getPowerCutConfigListApi } from '/@/api/info/powerCutConfig';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';
import { useUserState } from '/@/hooks/web/useUserState';

const { getOrganizationsList } = useUserStoreWithOut();
const orgList = cloneDeep(getOrganizationsList);
const org_tree = listToTreeAsParentId(orgList!);

const { getDictOptions } = useUserState();
const powerCutStatusOptions = getDictOptions('BT_POWER_CUT_STATUS');

const powerCutTypeMap = ref(); // 保存 { 停送电类型: 停送电名称 } 映射关系

export const schemas: FormSchema[] = [
  {
    field: 'timeRange',
    component: 'RangePicker',
    label: '日期',
    colProps: {
      span: 6,
    },
    componentProps: {
      format: 'YYYY-MM-DD',
      showTime: {
        defaultValue: [dateUtil().startOf('day'), dateUtil().endOf('day')],
      },
    },
  },
  {
    field: 'type',
    component: 'ApiSelect',
    label: '停电类型',
    colProps: {
      span: 6,
    },
    componentProps: {
      api: getPowerCutConfigListApi,
      params: {
        ascending: false,
        onlyNeedUse: false,
        orderBy: '',
        pageSize: 0,
        pageNo: 1,
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'workFlowCode',
      immediate: true,
      onOptionsChange: (list) => {
        // 将停送电类型处理成 map 保存下来, 因为表格显示类型需要映射
        powerCutTypeMap.value = list.reduce((res, pre) => {
          res[pre.value] = pre.label;
          return res;
        }, {});
      },
    },
  },
  {
    field: 'organizationIds',
    component: 'TreeSelect',
    label: '部门',
    colProps: {
      span: 6,
    },
    componentProps: {
      showSearch: true,
      maxlength: 15,
      treeData: org_tree,
      dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
    },
  },
  {
    field: 'status',
    component: 'Select',
    label: '状态',
    colProps: {
      span: 6,
    },
    componentProps: {
      options: powerCutStatusOptions,
    },
  },
  {
    field: 'globalName',
    component: 'Input',
    label: '',
    colProps: {
      span: 6,
    },
    componentProps: {
      placeholder: '单号/设备/内容/联系人',
    },
  },
  {
    field: 'containsHvDevice',
    component: 'Checkbox',
    label: ' ',
    defaultValue: false,
    labelWidth: 20,
    colProps: {
      span: 6,
    },
    renderComponentContent: '高压设备',
  },
  // -------------- hidden fields --------------
  {
    field: 'ascending',
    component: 'Checkbox',
    label: '是否正序',
    defaultValue: false,
    show: false,
  },
  {
    field: 'orderBy',
    component: 'Input',
    label: '排序字段',
    defaultValue: 'ScheduledCutOffTime',
    show: false,
  },
  {
    field: 'pageNo',
    component: 'InputNumber',
    label: '当前页',
    defaultValue: 1,
    show: false,
  },
  {
    field: 'pageSize',
    component: 'InputNumber',
    label: '每页条数',
    defaultValue: 10,
    show: false,
  },
  {
    field: 'todayStatus',
    component: 'Input',
    label: '查询当日停电申请单使用情况',
    show: false,
  },
];

export const columns: BasicColumn[] = [
  {
    title: '单号',
    dataIndex: 'code',
    fixed: 'left',
    width: 140,
  },
  {
    title: '计划停电时间',
    dataIndex: 'scheduledCutOffTime',
    sorter: true,
    slots: { customRender: 'scheduledCutOffTime' },
    width: 200,
  },
  {
    title: '停送电类型',
    dataIndex: 'type',
    width: 160,
    format: (text) => {
      return powerCutTypeMap.value[text];
    },
  },
  {
    title: '停送电设备',
    dataIndex: 'mainDevices',
    slots: { customRender: 'mainDevices' },
  },
  {
    title: '关联设备等',
    dataIndex: 'otherDevices',
    slots: { customRender: 'otherDevices' },
  },
  {
    title: '关联检修单',
    dataIndex: 'outerAssModel',
    slots: { customRender: 'outerAssModel' },
  },
  {
    title: '联系人',
    dataIndex: 'contactName',
  },
  {
    title: '部门',
    dataIndex: 'department',
    slots: { customRender: 'department' },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 160,
    slots: { customRender: 'status' },
  },
];
