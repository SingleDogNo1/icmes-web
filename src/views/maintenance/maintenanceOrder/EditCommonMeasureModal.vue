<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="title"
    :min-height="100"
    @register="register"
    @ok="handleSubmit"
    @visible-change="toggleShow"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { saveMaintenanceOrderCommonMeasureApi } from '/@/api/maintenance/maintenanceOrder';
  import { MaintenanceCommonMeasureModel } from '/@/api/maintenance/model/maintenanceOrderModel';
  import { error } from '/@/utils/log';

  interface DataModel extends MaintenanceCommonMeasureModel {
    edit?: boolean;
    editType?: 'create' | 'edit' | 'view';
  }

  const { createMessage } = useMessage();

  const emit = defineEmits(['update']);

  const loading = ref<boolean>(false);
  const editType: Ref<'create' | 'edit' | 'view' | undefined> = ref();

  const title = computed(() => {
    let title = '';
    switch (editType.value) {
      case 'create':
        title = '新建通用措施';
        break;
      case 'edit':
        title = '编辑通用措施';
        break;
      case 'view':
        title = '查看通用措施';
        break;
    }
    return title;
  });

  const [
    registerForm,
    { getFieldsValue, setFieldsValue, updateSchema, validate, resetFields, clearValidate },
  ] = useForm({
    schemas: [
      {
        field: 'title',
        label: '通用措施标题',
        component: 'Input',
        defaultValue: '',
        required: true,
        componentProps: {
          maxlength: 50,
        },
      },
      {
        field: 'content',
        label: '通用措施内容',
        component: 'InputTextArea',
        defaultValue: '',
        required: true,
        componentProps: {
          autoSize: {
            minRows: 2,
            maxRows: 16,
          },
        },
      },
      // ------------------------ hidden fields ------------------------
      {
        field: 'id',
        label: 'ID',
        component: 'InputNumber',
        show: false,
      },
      {
        field: 'versionTag',
        label: '唯一编码',
        component: 'Input',
        show: false,
      },
    ],
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  function onDataReceive(data: DataModel) {
    setFieldsValue({
      title: data.title ?? '',
      content: data.content ?? '',
    });
    if (data.id) {
      setFieldsValue({
        id: data.id,
        versionTag: data.versionTag,
      });
    } else {
      clearValidate();
    }

    editType.value = data.editType;
    updateSchema([
      { field: 'title', componentProps: { disabled: !data.edit } },
      { field: 'content', componentProps: { disabled: !data.edit } },
    ]);
  }

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  async function handleSubmit() {
    if (editType.value === 'view') {
      closeModal();
    } else {
      await validate();
      loading.value = true;
      const values = getFieldsValue() as DataModel;
      // delete values.edit;
      // delete values.editType;
      console.log('values :>> ', values);
      try {
        await saveMaintenanceOrderCommonMeasureApi(values);

        createMessage.success('保存成功');
        closeModal();
        emit('update');
      } catch (err: any) {
        error(err);
      } finally {
        loading.value = false;
      }
    }
  }

  function toggleShow(visible) {
    console.log('visible :>> ', visible);
    if (!visible) {
      resetFields();
    }
  }
</script>
