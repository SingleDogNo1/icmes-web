<template>
  <div class="pt-4">
    <Spin :spinning="pageLoading">
      <BasicForm @register="registerForm" @submit="save" />
      <Row>
        <Col :offset="6" :span="10" class="text-right mt-4">
          <a-button type="primary" @click="save" :loading="loading">保存</a-button>
        </Col>
      </Row>
    </Spin>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SafetyTechnology',
  };
</script>

<script lang="ts" setup>
  import { onMounted, nextTick, ref, watchEffect, PropType } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Row, Col, Spin } from 'ant-design-vue';
  import { PowerCutConfigModel } from '/@/api/power/model/configModel';
  import { updatePowerCutConfigApi } from '/@/api/power/config';
  import { useMessage } from '/@/hooks/web/useMessage';

  const props = defineProps({
    form: {
      type: Object as PropType<PowerCutConfigModel>,
      required: true,
    },
  });

  const { createMessage } = useMessage();

  const loading = ref(false);
  const pageLoading = ref(false);
  const powerCutConfigForm = ref<Nullable<PowerCutConfigModel>>(null);

  watchEffect(() => {
    pageLoading.value = true;
    if (props.form) {
      powerCutConfigForm.value = props.form;
      pageLoading.value = false;
    }
  });

  const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    labelWidth: '100px',
    labelCol: { span: 6 },
    wrapperCol: { span: 10 },
    schemas: [
      {
        field: 'safePatchMeasure',
        label: '安全技术措施',
        component: 'InputTextArea',
        componentProps: {
          showCount: true,
          maxlength: 300,
          autoSize: {
            minRows: 5,
            maxRows: 10,
          },
        },
      },
    ],
  });

  onMounted(() => {
    powerCutConfigForm.value &&
      setFieldsValue({ safePatchMeasure: powerCutConfigForm.value.safePatchMeasure });
  });

  async function save() {
    loading.value = true;
    await nextTick();
    const form = getFieldsValue() as PowerCutConfigModel;

    try {
      await updatePowerCutConfigApi({
        name: 'safePatchMeasure',
        value: form.safePatchMeasure,
      });

      createMessage.success('保存成功');
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }
</script>
