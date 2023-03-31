import { FormSchema } from '/@/components/Form';
import type { BasicColumn } from '/@/components/Table';
import { parseFloatNumber, basicTableCellStyle } from './helper';

export const yearPlanTableColumn = (yearPlanTableData): BasicColumn[] => {
  return [
    {
      title: '',
      width: 90,
      dataIndex: 'title',
      fixed: true,
      customCell: (_, index) => {
        const list = yearPlanTableData;
        // 获取列表中最后一条原煤数据所在的索引
        const rawCoalIndex = list.findLastIndex((v) => v.productType === 0);
        // 获取列表中原煤数据的条数
        const rawCoalList = list.filter((v) => v.productType === 0);
        // 从第一条原煤开始，合并${原煤数据条数}行数据
        if (index === 0) {
          return { rowSpan: rawCoalList.length, style: { background: '#d9f2cb' } };
        }
        if (index > 0 && index <= rawCoalIndex) {
          return { rowSpan: 0 };
        }
        // 原煤位置之后为产出煤种，起始位置为${最后一条原煤索引 + 1}，到数据结束
        if (index === rawCoalIndex + 1) {
          return { rowSpan: list.length - rawCoalList.length, style: { background: '#d8eaff' } };
        }
        if (index > rawCoalIndex + 1) {
          return { rowSpan: 0 };
        }
      },
    },
    {
      title: '',
      dataIndex: 'productVarieties',
      fixed: true,
      format: (amount) => {
        return amount || '/';
      },
      customCell: (_, index) => {
        const list = yearPlanTableData;
        // 获取列表中最后一条原煤数据所在的索引
        const rawCoalIndex = list.findLastIndex((v) => v.productType === 0);
        // 从第一条原煤开始，合并${原煤数据条数}行数据
        if (index < rawCoalIndex) {
          return { style: { background: '#d9f2cb' } };
        }

        if (index === rawCoalIndex) {
          return { style: { color: '#ff6702', background: '#d9f2cb' } };
        }

        // 原煤位置之后为产出煤种，起始位置为${最后一条原煤索引 + 1}，到数据结束
        if (index > rawCoalIndex && index < list.length - 1) {
          return { style: { background: '#d8eaff' } };
        }

        if (index === list.length - 1) {
          return { style: { color: '#ff6702', background: '#d8eaff' } };
        }
      },
    },
    {
      title: '数量(万吨)',
      dataIndex: 'productAmount',
      format: (amount) => {
        if (!amount) return '/';
        return parseFloatNumber(amount);
      },
      customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData),
    },
    {
      title: '产率（%）',
      dataIndex: 'productivity',
      format: (amount) => {
        if (!amount) return '/';
        return parseFloatNumber(amount * 100) + '%';
      },
      customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData),
    },
    {
      title: '灰分（%）',
      dataIndex: 'ash',
      format: (ash) => {
        if (!ash) return '/';
        return parseFloatNumber(ash * 100) + '%';
      },
      customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData),
    },
    {
      title: '水分（%）',
      dataIndex: 'moisture',
      format: (moisture) => {
        if (!moisture) return '/';
        return parseFloatNumber(moisture * 100) + '%';
      },
      customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData),
    },
    {
      title: '发热量(大卡)',
      dataIndex: 'mj',
      format: (mj) => {
        if (!mj) return '/';
        return parseFloatNumber(mj * 100) + '%';
      },
      customCell: (_record, index) => basicTableCellStyle(index, yearPlanTableData),
    },
  ];
};

export const workflowNodeTableColumns: BasicColumn[] = [
  {
    title: '步骤',
    dataIndex: 'order',
    fixed: 'left',
  },
  {
    title: '节点名称',
    dataIndex: 'name',
    width: 125,
  },
  {
    title: '工作类型',
    dataIndex: 'workType',
    slots: { customRender: 'workType' },
  },
  {
    title: '启用/停用',
    dataIndex: 'isDisabled',
    slots: { customRender: 'nodeState' },
  },
];

export const reminderTableColumns: BasicColumn[] = [
  {
    title: '通知时间节点',
    dataIndex: 'notificationPhase',
    slots: { customRender: 'notificationPhase' },
  },
  {
    title: '通知类型',
    dataIndex: 'type',
    slots: { customRender: 'type' },
  },
  {
    title: '通知对象类型',
    dataIndex: 'notificationObjectType',
    slots: { customRender: 'notificationObjectType' },
  },
  {
    title: '通知对象',
    dataIndex: 'jsonParseObjectInfo',
  },
  {
    title: '按班次通知',
    dataIndex: 'isWorkingShiftNoticeOn',
    slots: { customRender: 'isWorkingShiftNoticeOn' },
  },
];

export const reportTableColumns: BasicColumn[] = [
  {
    title: '超时时长/分钟',
    dataIndex: 'timeoutPeriod',
  },
  {
    title: '上报对象类型',
    dataIndex: 'reportingObjectType',
    slots: { customRender: 'type' },
  },
  {
    title: '上报对象',
    dataIndex: 'jsonParseObjectInfo',
  },
  {
    title: '按班次通知',
    dataIndex: 'isWorkingShiftNoticeOn',
    slots: { customRender: 'isWorkingShiftNoticeOn' },
  },
];

export const step1Schemas = (productionList): BasicColumn[] => [
  {
    title: '产品',
    dataIndex: 'productionId',
    editComponent: 'Select',
    editRow: true,
    editRule: async (text) => {
      if (!text) {
        return '产品不能为空';
      }
      return '';
    },
    editComponentProps: {
      style: {
        width: '100%',
      },
    },
  },
  {
    title: '类型',
    dataIndex: 'productTypeText',
    editRow: true,
    editComponentProps: {
      readonly: true,
      bordered: false,
      placeholder: '请选择产品',
    },
  },
  {
    title: '灰分(%)',
    dataIndex: 'ash',
    editRow: true,
  },
  {
    title: '水分(%)',
    dataIndex: 'moisture',
    editRow: true,
  },
  {
    title: '发热量(大卡)',
    dataIndex: 'mj',
    editRow: true,
  },
  {
    title: '计划产率(%)',
    dataIndex: 'productivity',
    helpMessage: '洗选产品必填',
    editRow: true,
    editRule: async (text, record) => {
      const productionId = record.editValueRefs.productionId;
      const currentRow = productionList.find((v) => v.id === productionId);
      // 当前行数据产品如果是原煤，不能输入计划产率，所以不校验
      if (currentRow?.type === 0) {
        return '';
      } else if (!text) {
        return '请输入计划产率';
      } else {
        return '';
      }
    },
    editComponentProps: ({ record }) => {
      const productionId = record.editValueRefs.productionId;
      const currentRow = productionList.find((v) => v.id === productionId);
      // 当前行数据产品如果是原煤，输入框不能输入，视觉上也不可见 (readonly, 去除边框)
      return {
        readonly: currentRow?.type === 0,
        bordered: currentRow?.type !== 0,
        placeholder: '',
      };
    },
  },
];

export const step2Schemas: FormSchema[] = [
  {
    field: 'pwd',
    component: 'InputPassword',
    label: '支付密码',
    required: true,
    defaultValue: '123456',
  },
];
