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
  import { BasicForm } from '/@/components/Form';
  // import { useMessage } from '/@/hooks/web/useMessage';

  // const { createMessage } = useMessage();

  // const props = defineProps({
  //   form: {
  //     type: Object,
  //   }
  // })

  const editType: Ref<'create' | 'edit' | ''> = ref('');

  // const [register, { closeModal }] = useModalInner();
</script>

<style lang="less" scoped>
  .editJudgmentDialog {
    color: red;
  }
</style>
