import { ActionItem } from '/@/components/Table';
import { MaintenanceOrderAdvanceSimplifyModel } from '/@/api/maintenance/model/maintenanceOrderModel';
import { useUserStore } from '/@/store/modules/user';
import { useRoute } from 'vue-router';

export function useMaintenanceOrder() {
  const features = useUserStore().getFeature;
  const {
    meta: { code },
  } = useRoute();
  const editPerm = !!features[code!]?.MAINT_ORDER_EDIT; // 是否有编辑权限
  const configPerm = !!features[code!]?.MAINT_CONFIG; // 是否有配置权限
  const apvPerm = !!features[code!]?.MAINT_ORDER_APV; // 是否有审批权限
  const closePerm = !!features[code!]?.MAINT_ORDER_CLOSE; // 是否有作废权限
  const completePerm = !!features[code!]?.COMPLETE_MAINTENANCE; // 是否有完成权限

  function createActions(record: MaintenanceOrderAdvanceSimplifyModel): ActionItem[] {
    return [
      {
        label: '查看',
        onClick: async () => {
          console.log('查看 :>> ', record);
        },
      },
    ];
  }

  function createDropDownActions(record: MaintenanceOrderAdvanceSimplifyModel) {
    const actions: ActionItem[] = [];

    if (editPerm && ['MAINT_ORDER_NEW', 'MAINT_ORDER_REJECT'].includes(record.status)) {
      actions.push({
        label: '编辑',
        onClick: async () => {
          console.log('编辑 :>> ', record);
        },
      });
    }

    if (editPerm && record.status === 'MAINT_ORDER_NEW') {
      actions.push({
        label: '删除',
        color: 'error',
        popConfirm: {
          title: '数据删除后将无法恢复，确认删除数据？',
          confirm: async () => {
            console.log('删除操作 :>> ', record);
          },
        },
      });
    }

    if (apvPerm && ['MAINT_ORDER_APPROVING', 'MAINT_ORDER_COMMIT'].includes(record.status)) {
      actions.push({
        label: '审批',
        onClick: () => {
          console.log('审批 :>> ', record);
        },
      });
    }

    if (
      ['MAINT_ORDER_ACCEPT', 'MAINT_ORDER_CHECKED', 'MAINT_ORDER_COMPLETE'].includes(record.status)
    ) {
      actions.push({
        label: '记录',
        onClick: () => {
          console.log('记录 :>> ', record);
        },
      });
    }

    if (record.status === 'MAINT_ORDER_CHECKED') {
      actions.push({
        label: '验收',
        onClick: () => {
          console.log('验收 :>> ', record);
        },
      });
    }

    if (closePerm && ['MAINT_ORDER_REJECT', 'MAINT_ORDER_APPROVED'].includes(record.status)) {
      actions.push({
        label: '作废',
        onClick: () => {
          console.log('作废 :>> ', record);
        },
      });
    }

    if (editPerm) {
      actions.push({
        label: '复制',
        onClick: () => {
          console.log('复制 :>> ', record);
        },
      });
    }

    if (completePerm && ['MAINT_ORDER_APPROVED', 'MAINT_ORDER_CHECKING'].includes(record.status)) {
      actions.push({
        label: '完成',
        onClick: () => {
          console.log('完成 :>> ', record);
        },
      });
    }

    return actions;
  }

  return {
    editPerm,
    configPerm,
    createActions,
    createDropDownActions,
  };
}
