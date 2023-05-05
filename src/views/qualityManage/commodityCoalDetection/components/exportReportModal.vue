<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    title="导出报表"
    :width="400"
    :min-height="30"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getApprovalsListApi } from '/@/api/quality/commercialCoalInspection';
  import { exportExcel } from '../helper';
  import { exportExcelColumns } from '../data';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { useGlobSetting } from '/@/hooks/setting';
  import { error } from '/@/utils/log';

  const { createMessage } = useMessage();
  const { getDictMap } = useUserState();
  const { projectName } = useGlobSetting();

  const loading = ref(false);
  const coalTypeMap = getDictMap('DT_PROD_CHECK_MINE');
  const directionMap = getDictMap('DT_PROD_CHECK_ DIREC');

  const [registerForm, { getFieldsValue, validate }] = useForm({
    schemas: [
      {
        field: 'month',
        label: '日期',
        component: 'DatePicker',
        defaultValue: dateUtil(),
        componentProps: {
          picker: 'month',
          mode: 'month',
        },
      },
    ],
    showActionButtonGroup: false,
  });

  const [register, { closeModal }] = useModalInner();

  async function handleSubmit() {
    await validate();
    loading.value = true;
    const value = getFieldsValue();

    try {
      const formDate = value.month;
      const filename = `${projectName}商品煤检测统计表${dateUtil(formDate).month() + 1}月份.xlsx`;

      const { items } = await getApprovalsListApi({
        ascending: false,
        batchNumber: '',
        endTime: Number(dateUtil(formDate).endOf('month').format('x')),
        loadingType: 2,
        orderBy: 'inspectionDate',
        pageSize: 0,
        pageNo: 1,
        startTime: Number(dateUtil(formDate).startOf('month').format('x')),
        unqualified: false,
        unstable: false,
        productionId: '',
      });

      if (!items) {
        createMessage.error('当月没有数据');
        return;
      }

      // 重新组织字段，用于导出excel
      const data = items.map((item, i) => {
        return {
          ...item,
          ...{
            index: i + 1,
            inspectionDate: dateUtil(item.inspectionDate).format('MM月DD日'),
            coalType:
              coalTypeMap[item.loadingPlanBaseModel.coalType] ?? item.loadingPlanBaseModel.coalType,
            direction:
              directionMap[item.loadingPlanBaseModel.direction] ??
              item.loadingPlanBaseModel.direction,
            productionVariety: item.loadingPlanBaseModel.productionVariety,
            tonnage: item.loadingPlanBaseModel.tonnage,
          },
        };
      });

      exportExcel(data, exportExcelColumns, filename);
      createMessage.success('保存成功！');
      closeModal();
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
