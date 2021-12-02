<template>
  <BasicModal
    :loading="loading"
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
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { ref, Ref, PropType } from 'vue';
  import { debounce } from 'lodash-es';
  import { addDictDataApi, updateDictDataApi, getDictDataApi } from '/@/api/info/dict';
  import {
    UpdateDictDataParam,
    AddDictDataParam,
    DictTypeModel,
  } from '/@/api/info/model/dictModel';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const props = defineProps({
    form: {
      type: Object as PropType<AddDictDataParam | UpdateDictDataParam>,
    },
    dictType: {
      type: String,
    },
  });

  const emit = defineEmits(['update:data']);

  const model = ref({});
  const loading = ref(false);
  // 编辑的类型，通过参数中是否存在versionTag，判断是新建还是编辑
  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    schemas: [
      {
        field: 'code',
        label: '字典编码',
        component: 'Input',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请输入字典编码',
          },
          {
            validator: async (_, value) => {
              if (editType.value === 'edit') {
                return Promise.resolve();
              } else {
                loading.value = true;
                const values = getFieldsValue();
                try {
                  const { items } = await getDictDataApi({
                    typeCode: values.typeCode,
                  });
                  const exist_codes = items
                    ? items.reduce((res, pre) => {
                        res.push(pre.code);
                        return res;
                      }, [] as string[])
                    : [];

                  if (exist_codes.includes(value)) {
                    return Promise.reject('字典编码重复，请重新输入');
                  } else {
                    return Promise.resolve();
                  }
                } finally {
                  loading.value = false;
                }
              }
            },
            trigger: 'change',
          },
        ],
      },
      {
        field: 'name',
        label: '字典名称',
        component: 'Input',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请输入字典名称',
          },
          {
            validator: debounce(async (_, value) => {
              loading.value = true;
              const values = getFieldsValue();
              try {
                const { items } = await getDictDataApi({
                  typeCode: values.typeCode,
                });
                const exist_names = items
                  ? items.reduce((res, pre) => {
                      res.push(pre.name);
                      return res;
                    }, [] as string[])
                  : [];

                console.log('exist_names :>> ', exist_names, value, exist_names.includes(value));

                if (exist_names.includes(value)) {
                  return Promise.reject('字典名称重复，请重新输入');
                } else {
                  return Promise.resolve();
                }
              } finally {
                loading.value = false;
              }
            }, 300),
            trigger: ['change', 'blur'],
          },
        ],
      },
      {
        field: 'order',
        label: '顺序号',
        component: 'InputNumber',
        defaultValue: '',
      },
      {
        field: 'typeCode',
        label: '所属类型',
        component: 'Input',
        defaultValue: '',
        componentProps: {
          disabled: true,
        },
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
      code: data.code ?? '',
      name: data.name ?? '',
      versionTag: data.versionTag ?? '',
      typeCode: props.dictType,
    });

    // 如果存在versionTag 字段，是编辑，否则是新建。并且编辑时，code 选项不可操作
    editType.value = data.versionTag ? 'edit' : 'create';
    updateSchema({ field: 'code', componentProps: { disabled: Boolean(data.versionTag) } });
  }

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  async function handleSubmit() {
    await validate();
    loading.value = true;
    const value = getFieldsValue() as AddDictDataParam | UpdateDictDataParam;

    const code = (value as AddDictDataParam).code!;

    try {
      if (editType.value === 'create') {
        delete (value as UpdateDictDataParam).versionTag;
        await addDictDataApi(value);
      } else if (editType.value === 'edit') {
        delete (value as AddDictDataParam).code;
        await updateDictDataApi(code, value);
      }
      createMessage.success('保存成功！');
      closeModal();
      emit('update:data');
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }
</script>
