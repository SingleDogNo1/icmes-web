import type { BasicColumn } from '/@/components/Table';
import type { FormSchema } from '/@/components/Form';
import { ConfigNoticeObjTypeEnum } from '/@/enums/powerCutEnum';
import { hasIn, map, join } from 'lodash-es';
import { getRolesListApi } from '/@/api/account/roles';
import { getAllAccountTreeApi } from '/@/api/info/organizations';

export const columns: BasicColumn[] = [
  {
    title: '通知类型',
    dataIndex: 'noticeObjectType',
    fixed: 'left',
    customRender: ({ record }) => {
      let text = '';

      switch (record.noticeObjectType) {
        case ConfigNoticeObjTypeEnum['USER']:
          text = '用户';
          break;
        case ConfigNoticeObjTypeEnum['ROLE']:
          text = '角色';
          break;
        case ConfigNoticeObjTypeEnum['CONTAINER']:
          text = '停送电联系人';
          break;
        case ConfigNoticeObjTypeEnum['ORGANIZATION']:
          text = '组织结构';
          break;
        case ConfigNoticeObjTypeEnum['ORGANIZATION_AND_ROLE']:
          text = '组织结构 + 角色';
          break;
        default:
          text = '';
      }

      return text;
    },
  },
  {
    title: '通知对象',
    dataIndex: 'powerCutType',
    customRender: ({ record }) => {
      const noticeObject = JSON.parse(record.noticeObject);
      let name: string[] = [];
      if (hasIn(noticeObject, 'employees')) {
        name = map(noticeObject.employees, 'employeeName');
      } else if (hasIn(noticeObject, 'roles')) {
        name = map(noticeObject.roles, 'roleName');
      }
      return join(name, '，');
    },
  },
  { title: '按班次通知', dataIndex: 'workingShift', slots: { customRender: 'workingShift' } },
];

export const schemas: FormSchema[] = [
  {
    field: 'noticeObjectType',
    label: '通知对象类型',
    component: 'Select',
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: '用户',
            value: ConfigNoticeObjTypeEnum.USER,
          },
          {
            label: '角色',
            value: ConfigNoticeObjTypeEnum.ROLE,
          },
          {
            label: '停送电联系人',
            value: ConfigNoticeObjTypeEnum.CONTAINER,
          },
        ],
        onChange: () => {
          formModel.noticeObject = [];
        },
      };
    },
  },
  {
    field: 'noticeObject',
    label: '通知对象',
    component: 'ApiTreeSelect',
    show: ({ values }) => {
      return !!(values.noticeObjectType === ConfigNoticeObjTypeEnum.USER);
    },
    required: ({ values }) => {
      return !!(values.noticeObjectType === ConfigNoticeObjTypeEnum.USER);
    },
    componentProps: {
      mode: 'multiple',
      treeNodeFilterProp: 'name',
      treeCheckable: true,
      api: getAllAccountTreeApi,
      params: { name: '' },
      resultField: 'items',
      labelField: 'name',
      valueField: 'realId',
      fieldNames: {
        label: 'name',
        value: 'realId',
      },
      immediate: true,
      onOptionsReady: (options) => {
        /**
         * 递归的处理选项列表使父级节点不可选
         * @param list {Record<string, any}[] 需要处理的集合
         */
        function addDisabled(list) {
          list.map((v) => {
            v.name = v.code + ' ' + v.name; // 重组 name 字段，用于显示
            // 插入新字段，用做生成选中的 Id(如果是组织使用组织Id,该字段不会选中父节点所以无所谓父节点 id 的具体值，只需要保证其唯一性)
            v.realId = v.realEmployeeId || 'org_' + v.realOrgId;
            v.disabled = !!v.children?.length;
            v.children?.length && addDisabled(v.children);
          });
        }
        addDisabled(options);
        return options;
      },
    },
  },
  {
    field: 'noticeObject',
    label: '通知对象',
    component: 'ApiSelect',
    show: ({ values }) => {
      return !!(values.noticeObjectType === ConfigNoticeObjTypeEnum.ROLE);
    },
    required: ({ values }) => {
      return !!(values.noticeObjectType === ConfigNoticeObjTypeEnum.ROLE);
    },
    componentProps: {
      mode: 'multiple',
      optionFilterProp: 'name',
      showSearch: true,
      api: getRolesListApi,
      params: {
        organizationIds: [],
        pageSize: 0,
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
      immediate: true,
      onOptionsReady: (options) => {
        options.forEach((v) => {
          v.name = v.code + v.name;
        });
      },
    },
  },
  {
    field: 'workingShift',
    label: '按班次通知',
    component: 'Checkbox',
  },
];
