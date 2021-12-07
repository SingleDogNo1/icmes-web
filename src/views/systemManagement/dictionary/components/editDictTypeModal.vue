<template>
  <BasicModal
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}数据字典`"
    :min-height="100"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" :model="model" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ref, Ref } from 'vue';
  import { addDictTypeApi, editDictTypeApi } from '/@/api/info/dict';
  import { AddDictTypeParam, DictTypeModel, EditDictTypeParam } from '/@/api/info/model/dictModel';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  const userStore = useUserStore();
  const { createMessage } = useMessage();

  defineProps({
    form: {
      type: Object,
    },
  });

  const emit = defineEmits(['update:dict']);

  const model = ref({});
  const loading = ref(false);
  // 编辑的类型，通过参数中是否存在versionTag，判断是新建还是编辑
  const editType: Ref<'create' | 'edit' | ''> = ref('');
  const dicts = userStore.getDicts;

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    schemas: [
      {
        field: 'code',
        label: '类型编码',
        component: 'Input',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请输入类型编码',
          },
          {
            validator: async (_, value) => {
              if (editType.value === 'create' && Object.keys(dicts).includes(value)) {
                return Promise.reject('类型编码重复，请重新输入');
              }
              return Promise.resolve();
            },
            trigger: ['change', 'blur'],
          },
        ],
      },
      {
        field: 'name',
        label: '类型名称',
        component: 'Input',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请输入类型名称',
          },
          {
            validator: async (_, value) => {
              const valuesList: string[] = [];
              for (const key in dicts) {
                valuesList.push(dicts[key].name);
              }
              if (valuesList.includes(value)) {
                return Promise.reject('类型名称重复，请重新输入');
              }
              return Promise.resolve();
            },
            trigger: ['change', 'blur'],
          },
        ],
      },
      {
        field: 'versionTag',
        label: '数据版本',
        component: 'Input',
        defaultValue: null,
        show: false,
      },
    ],
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  function onDataReceive(data: DictTypeModel) {
    setFieldsValue({
      code: data.code,
      name: data.name,
      versionTag: data.versionTag,
    });

    // 如果存在versionTag 字段，是编辑，否则是新建。并且编辑时，code 选项不可操作
    editType.value = data.versionTag ? 'edit' : 'create';
    updateSchema({ field: 'code', componentProps: { disabled: Boolean(data.versionTag) } });
  }

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  async function handleSubmit() {
    loading.value = true;
    await validate();

    const value = getFieldsValue() as AddDictTypeParam | EditDictTypeParam;

    try {
      if (editType.value === 'create') {
        delete (value as EditDictTypeParam).versionTag;
        await addDictTypeApi(value as AddDictTypeParam);
      } else if (editType.value === 'edit') {
        await editDictTypeApi(value as EditDictTypeParam);
        await closeModal();
      }
      createMessage.success('保存成功！');
      closeModal();
      emit('update:dict');
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }
</script>
