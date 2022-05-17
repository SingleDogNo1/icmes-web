import type { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { getOrganizationsListApi } from '/@/api/info/organizations';
import { useUserState } from '/@/hooks/web/useUserState';
import { formatToDate, dateUtil } from '/@/utils/dateUtil';
import { isIDCardNumber, isMobilePhone, isEmail } from '/@/utils/is';

const { getDictOptions, getDictMap } = useUserState();

const categoryOptions = getDictOptions('DT_CATEGORY');
const categoryMap = getDictMap('DT_CATEGORY');
const workTypeOptions = getDictOptions('DT_WORK_TYPE');
const workTypeMap = getDictMap('DT_WORK_TYPE');
const genderOptions = getDictOptions('DT_GENDER'); // 性别
const certificateOptions = getDictOptions('DT_CERTIFICATE'); // 资格证书
const educationOptions = getDictOptions('DT_EDUCATION'); // 最高学历
const degreeOptions = getDictOptions('DT_DEGREE'); // 最高学位

export const getEmployeesListSchemas: FormSchema[] = [
  {
    field: 'organizationId',
    component: 'ApiTreeSelect',
    label: '组织机构',
    componentProps: {
      api: getOrganizationsListApi,
      resultField: 'items',
      params: {
        orderBy: 'Code',
        ascending: true,
        parentId: 0,
      },
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'category',
    component: 'Select',
    label: '员工类型',
    componentProps: {
      options: categoryOptions,
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'workType',
    component: 'Select',
    label: '工种',
    componentProps: {
      options: workTypeOptions,
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'join_time_range',
    component: 'RangePicker',
    label: '入职起止日期',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'globalName',
    component: 'Input',
    label: '搜索',
    colProps: {
      span: 8,
    },
  },
  // --------------------------- hidden fields ---------------------------
  {
    field: 'ascending',
    component: 'Switch',
    label: '正序',
    defaultValue: true,
    show: false,
  },
  {
    field: 'orderBy',
    component: 'Input',
    label: '排序字段',
    defaultValue: 'Code',
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
];

export const getEmployeesListColumns: BasicColumn[] = [
  { title: '工号', dataIndex: 'code', fixed: 'left' },
  { title: '姓名', dataIndex: 'name' },
  { title: '组织机构', dataIndex: 'fullName' },
  { title: '手机号', dataIndex: 'mobilePhone' },
  { title: '专网手机号', dataIndex: 'specialDevice' },
  {
    title: '员工类型',
    dataIndex: 'specialDevice',
    customRender: ({ record }) => {
      return `${categoryMap[record.category]}`;
    },
  },
  {
    title: '工种',
    dataIndex: 'workType',
    customRender: ({ record }) => {
      if (!record.workType) {
        return '';
      } else {
        return `${workTypeMap[record.workType]}`;
      }
    },
  },
  {
    title: '入职日期',
    dataIndex: 'joinDate',
    customRender: ({ record }) => {
      if (!record.joinDate) {
        return '';
      } else {
        return formatToDate(record.joinDate);
      }
    },
  },
];

export const userInfoSchemas: FormSchema[] = [
  {
    field: 'divider-api-select',
    component: 'Divider',
    label: '职位信息',
  },
  {
    field: 'code',
    component: 'Input',
    label: '工号',
    required: true,
    componentProps: {
      placeholder: '请输入工号',
    },
  },
  {
    field: 'specialDevice',
    component: 'Input',
    label: '专网手机号',
    componentProps: {
      placeholder: '请输入专网手机号',
    },
  },
  {
    field: 'fullName',
    component: 'ApiTreeSelect',
    label: '组织机构',
    required: true,
    componentProps: {
      api: getOrganizationsListApi,
      resultField: 'items',
      params: {
        orderBy: 'Code',
        ascending: true,
        parentId: 0,
      },
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
  },
  {
    field: 'officePhoneField',
    component: 'InputGroup',
    label: '办公电话',
    slot: 'officePhoneField',
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
    required: true,
    slot: 'category',
  },
  {
    field: 'workType',
    component: 'Select',
    label: '工种',
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
    required: true,
    componentProps: {
      placeholder: '请输入员工姓名',
    },
  },
  {
    field: 'mobilePhone',
    component: 'Input',
    label: '手机号码',
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
    componentProps: {
      options: genderOptions,
    },
  },
  {
    field: 'email',
    component: 'Input',
    label: '邮箱',
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
    componentProps: {
      placeholder: '请输入毕业学校',
    },
  },
  {
    field: 'specialty',
    component: 'Input',
    label: '专业',
    componentProps: {
      placeholder: '请输入所学专业',
    },
  },
  {
    field: 'qualification',
    component: 'Select',
    label: '职业资格',
    componentProps: {
      placeholder: '请选择职业资格',
      options: certificateOptions,
    },
  },
  {
    field: 'graduationDate',
    component: 'DatePicker',
    label: '毕业时间',
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
    componentProps: {
      placeholder: '请选择最高学历',
      options: educationOptions,
    },
  },
  {
    field: 'highDegree',
    component: 'Select',
    label: '最高学位',
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
