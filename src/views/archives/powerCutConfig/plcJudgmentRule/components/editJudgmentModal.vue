<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}策略`"
    :min-height="100"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>

<script lang="ts">
  export default {
    name: 'EditJudgmentModal',
  };
</script>

<script lang="ts" setup>
  import { Ref, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserState } from '/@/hooks/web/useUserState';
  import { getStrategyListApi } from '/@/api/info/strategy';
  import { EditPowerJudgmentParams } from '/@/api/info/model/plcJudgmentModel';

  // const { createMessage } = useMessage();
  const { getDictByType } = useUserState();

  const model = ref({});
  const loading = ref(false);

  const powerBusinessNode = getDictByType('POWER_BUSINESS_NODE').options;
  const powerBusinessNodeOptions = [];
  for (const key in powerBusinessNode) {
    powerBusinessNodeOptions.push({
      label: powerBusinessNode[key].name,
      value: key,
    });
  }

  const plcDetectTypeMap = {
    '0': '不检测状态信号',
    '1': '只监测运行状态',
    '2': '只监测带电状态',
    '3': '监测运行状态+带电状态',
    '4': '只监测就地状态',
    '5': '参与停送电流程，无电工配电操作',
    '6': '不参与停送电流程',
    '7': '监测运行状态+带电状态+就地状态',
    '8': '监测就地状态+运行状态',
    '9': '监测就地状态+带电状态',
    '-1': '未知',
  };
  const plcDetectTypeMapOptions = [];
  for (const key in plcDetectTypeMap) {
    plcDetectTypeMapOptions.push({
      label: plcDetectTypeMap[key],
      value: parseInt(key),
    });
  }

  const explainMap = getDictByType('BT_POWER_CUT_FAILTIP').options;
  const explainOptions = [];
  for (const key in explainMap) {
    explainOptions.push({
      label: explainMap[key].name,
      value: key,
    });
  }

  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const [register, {}] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  const [registerForm, { setFieldsValue, validate }] = useForm({
    schemas: [
      {
        field: 'powerBusinessNode',
        label: '业务节点',
        component: 'Select',
        rules: [
          {
            required: true,
            message: '请选择业务节点',
          },
        ],
        componentProps: {
          placeholder: '请选择',
          options: powerBusinessNodeOptions,
          getPopupContainer: () => document.body,
        },
      },
      {
        field: 'plcDetectType',
        label: 'PLC监测类型',
        component: 'Select',
        required: true,
        componentProps: {
          placeholder: '请选择',
          options: plcDetectTypeMapOptions,
          getPopupContainer: () => document.body,
        },
      },
      {
        field: 'strategyId',
        label: '策略规则',
        component: 'ApiSelect',
        required: true,
        componentProps: {
          placeholder: '请选择',
          api: getStrategyListApi,
          params: {
            orderBy: '',
            ascending: false,
            pageSize: 0,
            pageNo: 0,
          },
          resultField: 'items',
          labelField: 'label',
          valueField: 'id',
          immediate: true,
          onOptionsReady: (list) => {
            console.log('list', list);
            list.map((item) => {
              item.label = `${item.number} ${item.name}`;
            });
          },
          getPopupContainer: () => document.body,
        },
      },
      {
        field: 'explain',
        label: '校验未通过说明',
        component: 'Select',
        rules: [
          {
            required: true,
            message: '请选择校验未通过说明',
          },
        ],
        componentProps: {
          placeholder: '请选择',
          options: explainOptions,
          getPopupContainer: () => document.body,
        },
      },
      {
        field: 'description',
        label: '描述',
        component: 'Input',
      },
    ],
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  function onDataReceive(data: EditPowerJudgmentParams) {
    setFieldsValue({
      description: data.description ?? '',
      explain: data.explain ?? '',
      plcDetectType: data.plcDetectType ?? '',
      powerBusinessNode: data.powerBusinessNode ?? '',
      strategyId: data.strategyId ?? '',
    });
  }

  function handleSubmit() {
    validate();
  }
</script>

<style lang="less" scoped>
  .editJudgmentDialog {
    color: red;
  }
</style>
