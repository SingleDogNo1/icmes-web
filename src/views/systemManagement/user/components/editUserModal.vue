<template>
  <BasicModal
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}账号信息`"
    :min-height="100"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { ref, Ref } from 'vue';
  import { AccountModel, EditAccountParams } from '/@/api/account/model/basicModel';
  import { getAccountByCodeApi, addAccountApi, editAccountApi } from '/@/api/account/basic';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  defineProps({
    form: {
      type: Object,
    },
  });

  const emit = defineEmits(['update:user']);

  const model = ref({});
  const loading = ref(false);
  // 编辑的类型，通过参数中是否存在versionTag，判断是新建还是编辑
  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    schemas: [
      {
        field: 'code',
        label: '工号',
        component: 'Input',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请输入工号',
          },
          {
            validator: async (_, value) => {
              if (editType.value === 'edit') {
                return Promise.resolve();
              } else {
                const accountInfo = await getAccountByCodeApi({ code: value });
                if (accountInfo.hasAccount) {
                  return Promise.reject('该用户已存在');
                } else {
                  return Promise.resolve();
                }
              }
            },
            trigger: 'blur',
          },
        ],
      },
      {
        field: 'name',
        label: '姓名',
        component: 'Input',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请输入类型名称',
          },
        ],
      },
      {
        field: 'specialDevice',
        label: '专网手机号',
        component: 'Input',
        defaultValue: '',
      },
      {
        field: 'id',
        label: '员工标识Id',
        component: 'Input',
        defaultValue: null,
        show: false,
      },
    ],
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  function onDataReceive(data: AccountModel) {
    setFieldsValue<EditAccountParams>({
      id: data.employeeId,
      code: data.employeeCode,
      name: data.name,
      specialDevice: data.specialDevice,
    });

    // 如果存在versionTag 字段，是编辑，否则是新建。并且编辑时，code 选项不可操作
    editType.value = data.versionTag ? 'edit' : 'create';
    updateSchema({ field: 'code', componentProps: { disabled: Boolean(data.versionTag) } });
    updateSchema({ field: 'name', componentProps: { disabled: Boolean(data.versionTag) } });
  }

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  async function handleSubmit() {
    await validate();

    loading.value = true;
    const value = getFieldsValue() as EditAccountParams;

    try {
      if (editType.value === 'create') {
        await addAccountApi(value);
        createMessage.success('保存成功！');
      } else if (editType.value === 'edit') {
        await editAccountApi(value.id!, value);
        createMessage.success('保存成功！');
      }
      closeModal();
      emit('update:user');
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }
</script>
