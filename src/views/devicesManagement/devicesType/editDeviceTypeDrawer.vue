<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="800"
    @ok="handleSubmit"
    @close="handleCloseDrawer"
  >
    <template #title>
      <span> {{ title }} </span>
    </template>

    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts" setup name="EditDeviceDrawer">
  // !组件名不能只有一个单词构成，并且遵循首字母大写的驼峰命名
  import { ref, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {
    getDevicesCategoryApi,
    createDeviceCategoryApi,
    updateDevicesCategoryApi,
  } from '/@/api/info/devicesCategory';
  import {
    DeviceCategoryModel,
    CreateDeviceCategoryParams,
    UpdateDevicesCategoryParams,
  } from '/@/api/info/model/devicesCategoryModel';
  import { editDeviceSchemas } from './data';

  interface Data {
    // 新建 | 编辑 | 查看
    method: 'create' | 'edit' | 'view';
    // 新建 null | 编辑、查看 DeviceCategoryModel
    data: Nullable<DeviceCategoryModel>;
  }

  const emit = defineEmits(['success']);
  const drawerMethod = ref<'create' | 'edit' | 'view'>();
  const editId = ref(-1);
  const title = ref('');

  const [
    registerForm,
    { resetFields, validate, getFieldsValue, setFieldsValue, setProps: setFormProps },
  ] = useForm({
    schemas: editDeviceSchemas,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (record: Data) => {
    resetFields();
    record.method !== 'create' && setDrawerProps({ loading: true });
    drawerMethod.value = record.method;
    title.value =
      record.method === 'create'
        ? '新建设备类型'
        : record.method === 'edit'
        ? '编辑设备类型'
        : '查看设备类型';

    if (record.method !== 'create' && record.data) {
      editId.value = record.data.id;
      if (record.method === 'view') {
        setFormProps({
          disabled: true,
        });
      }
      const data = await getDevicesCategoryApi(record.data.id);
      setFieldsValue({
        primary: data.primary,
        code: data.code,
        name: data.name,
        icon: data.icon ? [{ fileId: data.icon }] : [],
        specDataIds: (data.specDataList || []).reduce((res, pre) => {
          res.push(pre.id);
          return res;
        }, [] as DeviceCategoryModel['id'][]),
      });

      setDrawerProps({ loading: false });
    }
  });

  async function handleSubmit() {
    try {
      await validate();
      await nextTick();
      const formData = getFieldsValue() as CreateDeviceCategoryParams | UpdateDevicesCategoryParams;
      setDrawerProps({ confirmLoading: true });
      if (drawerMethod.value === 'create') {
        await createDeviceCategoryApi(formData as CreateDeviceCategoryParams);
      } else if (drawerMethod.value === 'edit') {
        await updateDevicesCategoryApi(editId.value, formData as UpdateDevicesCategoryParams);
      }
      emit('success');
      closeDrawer();
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  function handleCloseDrawer() {
    setFormProps({ disabled: false });
  }
</script>
