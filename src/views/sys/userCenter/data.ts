import { FormSchema } from '/@/components/Form';
import { useUserState } from '/@/hooks/web/useUserState';
import { isIDCardNumber, isMobilePhone, isEmail } from '/@/utils/is';
import { dateUtil } from '/@/utils/dateUtil';
import type { BasicColumn } from '/@/components/Table';
import { validPassword } from '/@/utils/validPassword';

const { getDictOptions } = useUserState();

const genderOptions = getDictOptions('DT_GENDER'); // 性别
const workTypeOptions = getDictOptions('DT_WORK_TYPE'); // 工作类型
const certificateOptions = getDictOptions('DT_CERTIFICATE'); // 资格证书
const educationOptions = getDictOptions('DT_EDUCATION'); // 最高学历
const degreeOptions = getDictOptions('DT_DEGREE'); // 最高学位

export interface ListItem {
  key: string;
  title: string;
  description: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

export const settingList = [
  {
    key: '1',
    name: '个人资料',
    component: 'BaseSetting',
  },
  {
    key: '2',
    name: '修改密码',
    component: 'ChangePassword',
  },
  {
    key: '3',
    name: '用户角色',
    component: 'Role',
  },
  {
    key: '4',
    name: '指派代理',
    component: 'AssignAgent',
  },
  {
    key: '5',
    name: '接手代理',
    component: 'TakeAgent',
  },
];

export const baseSetSchemas: FormSchema[] = [
  {
    field: 'divider-api-select',
    component: 'Divider',
    label: '职位信息',
  },
  {
    field: 'code',
    component: 'Input',
    label: '工号',
    colProps: { span: 18 },
    componentProps: {
      disabled: true,
      placeholder: '请输入工号',
    },
  },
  {
    field: 'specialDevice',
    component: 'Input',
    label: '专网手机号',
    colProps: { span: 18 },
    componentProps: {
      disabled: true,
      placeholder: '请输入专网手机号',
    },
  },
  {
    field: 'fullName',
    component: 'Input',
    label: '组织机构',
    colProps: { span: 18 },
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'officePhoneField',
    component: 'InputGroup',
    label: '办公电话',
    slot: 'officePhoneField',
    colProps: { span: 18 },
  },
  {
    field: 'officePhoneArea',
    component: 'Input',
    label: '办公区域',
    show: false,
  },
  {
    field: 'officePhone',
    component: 'Input',
    label: '办公电话',
    show: false,
  },
  {
    field: 'officePhoneExt',
    component: 'Input',
    label: '分机号',
    show: false,
  },
  {
    field: 'joinDate',
    component: 'DatePicker',
    label: '入职日期',
    colProps: { span: 18 },
    componentProps: {
      valueFormat: 'x',
      disabledDate: (current) => {
        return current && current > dateUtil().endOf('day');
      },
    },
  },
  {
    field: 'category',
    component: 'Input',
    label: '员工类型',
    colProps: { span: 18 },
    slot: 'category',
  },
  {
    field: 'workType',
    component: 'Select',
    label: '工种',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请选择',
      options: workTypeOptions,
    },
  },
  {
    field: 'divider-api-select',
    component: 'Divider',
    label: '个人信息',
  },
  {
    field: 'name',
    component: 'Input',
    label: '员工姓名',
    colProps: { span: 18 },
    componentProps: {
      disabled: true,
      placeholder: '请输入员工姓名',
    },
  },
  {
    field: 'mobilePhone',
    component: 'Input',
    label: '手机号码',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入手机号码',
    },
    rules: [
      {
        validator: async (_, value) => {
          if (!value) {
            return Promise.resolve();
          } else if (value) {
            if (isMobilePhone(value)) {
              return Promise.resolve();
            } else {
              return Promise.reject('请输入正确的手机号码');
            }
          }
        },
      },
    ],
  },
  {
    field: 'gender',
    component: 'RadioGroup',
    label: '性别',
    colProps: { span: 18 },
    componentProps: {
      options: genderOptions,
    },
  },
  {
    field: 'email',
    component: 'Input',
    label: '邮箱',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入邮箱',
    },
    rules: [
      {
        validator: async (_, value) => {
          if (!value) {
            return Promise.resolve();
          } else if (value) {
            if (isEmail(value)) {
              return Promise.resolve();
            } else {
              return Promise.reject('请输入正确的邮箱');
            }
          }
        },
      },
    ],
  },
  {
    field: 'birthDate',
    component: 'DatePicker',
    label: '出生日期',
    colProps: { span: 18 },
    componentProps: {
      valueFormat: 'x',
      disabledDate: (current) => {
        return current && current > dateUtil().endOf('day');
      },
    },
  },
  {
    field: 'identityCard',
    component: 'Input',
    label: '身份证号',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入身份证号',
    },
    rules: [
      {
        validator: async (_, value) => {
          if (!value) {
            return Promise.resolve();
          } else if (value) {
            if (isIDCardNumber(value)) {
              return Promise.resolve();
            } else {
              return Promise.reject('请输入正确的身份证号');
            }
          }
        },
      },
    ],
  },
  {
    field: 'divider-api-select',
    component: 'Divider',
    label: '毕业信息',
  },
  {
    field: 'graduateSchool',
    component: 'Input',
    label: '毕业学校',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入毕业学校',
    },
  },
  {
    field: 'specialty',
    component: 'Input',
    label: '专业',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入所学专业',
    },
  },
  {
    field: 'qualification',
    component: 'Select',
    label: '职业资格',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请选择职业资格',
      options: certificateOptions,
    },
  },
  {
    field: 'graduationDate',
    component: 'DatePicker',
    label: '毕业时间',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请选择毕业时间',
      valueFormat: 'x',
      disabledDate: (current) => {
        return current && current > dateUtil().endOf('day');
      },
    },
  },
  {
    field: 'highEducation',
    component: 'Select',
    label: '最高学历',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请选择最高学历',
      options: educationOptions,
    },
  },
  {
    field: 'highDegree',
    component: 'Select',
    label: '最高学位',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请选择最高学位',
      options: degreeOptions,
    },
  },
  {
    field: 'versionTag',
    component: 'Input',
    label: '用于高并发的数据版本控制',
    defaultValue: '',
    show: false,
  },
];

export const changePWDSchemas: FormSchema[] = [
  {
    field: 'oldPassword',
    label: '当前密码',
    component: 'InputPassword',
    required: true,
    rules: [
      {
        required: true,
        validator: async (_, value) => {
          if (!value) {
            return Promise.reject('请输入原密码');
          } else {
            await validPassword(value);
          }
        },
      },
    ],
  },
  {
    field: 'newPassword',
    label: '新密码',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '新密码',
    },
    rules: [
      {
        required: true,
        validator: async (_, value) => {
          if (!value) {
            return Promise.reject('请输入新密码');
          } else {
            await validPassword(value);
          }
        },
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请确认密码');
            }
            if (value !== values.newPassword) {
              return Promise.reject('两次密码输入不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];

export const RoleSearchSchemas: FormSchema[] = [
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
    defaultValue: 10,
    label: '每页条数',
    show: false,
  },
];

export const RoleTableColumns: BasicColumn[] = [
  {
    title: '组织机构',
    dataIndex: 'fullOrgName',
  },
  {
    title: '角色',
    dataIndex: 'roleName',
  },
];

export const agentTableColumns: BasicColumn[] = [
  { title: '组织机构', dataIndex: 'fullOrgName', fixed: 'left' },
  { title: '角色', dataIndex: 'roleName', fixed: 'left' },
  { title: '接手人', dataIndex: 'assignProxyName', fixed: 'left' },
  { title: '开始时间', dataIndex: 'proxyStartDate', slots: { customRender: 'startDate' } },
  { title: '结束时间', dataIndex: 'proxyEndDate', slots: { customRender: 'endDate' } },
  { title: '代理类型', dataIndex: 'proxyType', slots: { customRender: 'proxyType' } },
  { title: '周期', dataIndex: 'proxyCycle', slots: { customRender: 'proxyCycle' } },
];
