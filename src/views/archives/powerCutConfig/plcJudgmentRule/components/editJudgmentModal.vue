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
  // import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserState } from '/@/hooks/web/useUserState';

  // const { createMessage } = useMessage();
  const { getDictByType } = useUserState();

  // const props = defineProps({
  //   form: {
  //     type: Object,
  //   },
  // });

  const powerBusinessNode = getDictByType('POWER_BUSINESS_NODE').options;
  const powerBusinessNodeOptions = [];
  for (const key in powerBusinessNode) {
    powerBusinessNodeOptions.push({
      label: powerBusinessNode[key].name,
      value: key,
    });
  }

  const editType: Ref<'create' | 'edit' | ''> = ref('');

  // const [register, { closeModal }] = useModalInner();

  const [registerForm] = useForm({
    schemas: [
      {
        field: 'powerBusinessNode',
        label: '业务节点',
        component: 'Select',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请选择业务节点',
          },
        ],
        componentProps: {
          placeholder: '请选择',
          options: powerBusinessNodeOptions,
        },
      },
      {
        field: 'plcDetectType',
        label: 'PLC监测类型',
        component: 'Select',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请选择PLC监测类型',
          },
        ],
      },
      {
        field: 'strategyId',
        label: '策略规则',
        component: 'Select',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请选择策略规则',
          },
        ],
      },
      {
        field: 'explain',
        label: '校验未通过说明',
        component: 'Select',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请选择校验未通过说明',
          },
        ],
      },
      {
        field: 'description',
        label: '描述',
        component: 'Input',
        defaultValue: '',
      },
    ],
    labelWidth: 120,
    showActionButtonGroup: false,
  });
</script>

<style lang="less" scoped>
  .editJudgmentDialog {
    color: red;
  }
</style>
