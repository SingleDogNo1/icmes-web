<template>
  <div class="step2">
    <Alert message="确认转账后，资金将直接打入对方账户，无法退回。" show-icon />
    <Descriptions :column="1" class="mt-5">
      <Descriptions.Item label="付款账户"> ant-design@alipay.com </Descriptions.Item>
      <Descriptions.Item label="收款账户"> test@example.com </Descriptions.Item>
      <Descriptions.Item label="收款人姓名"> zfb </Descriptions.Item>
      <Descriptions.Item label="转账金额"> 500元 </Descriptions.Item>
    </Descriptions>
    <Divider />
    <BasicForm @register="register" />
  </div>
</template>
<script lang="ts" setup name="EditYearPlanStep3">
  import { BasicForm, useForm } from '/@/components/Form';
  import { step2Schemas } from './data';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';

  const emit = defineEmits(['submit', 'prev']);

  const [register, { validate, setProps }] = useForm({
    labelWidth: 80,
    schemas: step2Schemas,
    actionColOptions: {
      span: 14,
    },
    resetButtonOptions: {
      text: '上一步',
    },
    // submitButtonOptions: {
    //   text: '下一步',
    // },
    resetFunc: customResetFunc,
    submitFunc: customSubmitFunc,
  });

  async function customResetFunc() {
    emit('prev');
  }

  async function customSubmitFunc() {
    try {
      const values = await validate();
      setProps({
        submitButtonOptions: {
          loading: true,
        },
      });
      setTimeout(() => {
        setProps({
          submitButtonOptions: {
            loading: false,
          },
        });
        emit('submit', values);
      }, 1500);
    } catch (error) {}
  }
</script>
<style lang="less" scoped>
  .step2 {
    width: 450px;
    margin: 0 auto;
  }
</style>
