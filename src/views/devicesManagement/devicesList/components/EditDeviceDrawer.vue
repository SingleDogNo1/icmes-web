<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="800"
    @ok="handleSubmit"
    @close="handleClose"
  >
    <template #title>
      <span> {{ title }} </span>
      <a-button size="small" type="primary" class="ml-3">导入助手</a-button>
    </template>

    <BasicForm @register="registerForm">
      <template #specDataList="{ model, field }: any">
        <FormItemRest v-for="item in model[field]" :key="item.id">
          <FormItem :label="item.name">
            <a-input
              v-if="!item.extraDisplayMode"
              v-model:value="item.value"
              :addon-after="item.unit"
              :disabled="drawerMethod === 'view'"
            />
            <Textarea v-else v-model:value="item.value" :auto-size="{ minRows: 2, maxRows: 5 }" />
          </FormItem>
        </FormItemRest>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts" setup name="EditDeviceDrawer">
  // !组件名不能只有一个单词构成，并且遵循首字母大写的驼峰命名
  import { ref, computed } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { DeviceModel } from '/@/api/info/model/devicesModel';
  import { getDeviceDetailApi } from '/@/api/info/devices';
  import { FormItem, FormItemRest, Textarea } from 'ant-design-vue';
  import { editDeviceSchemas } from './data';
  import { useRoute } from 'vue-router';
  import { usePermission } from '/@/hooks/web/usePermission';

  interface Data {
    // 主设备 | 附属设备
    type: 'primary' | 'attach';
    // 新建 | 编辑 | 查看
    method: 'create' | 'edit' | 'view';
    // 新建 null | 编辑、查看 DeviceModel
    data: Nullable<DeviceModel>;
  }

  const { getPermissionList } = usePermission();

  const {
    meta: { code: permissionCode },
  } = useRoute();
  const hasEditPermission = !!getPermissionList()?.POWER_CUT_CONFIG;
  console.log('hasEditPermission :>> ', hasEditPermission);
  const emit = defineEmits(['success']);
  const drawerType = ref('');
  const drawerMethod = ref<'create' | 'edit' | 'view'>();
  const drawerMethodText = ref('');

  const [registerForm, { resetFields, validate, setFieldsValue, setProps }] = useForm({
    schemas: editDeviceSchemas(permissionCode!),
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (record: Data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    console.log('record :>> ', record);
    drawerType.value = record.type === 'primary' ? '设备台账' : '附属设备';
    drawerMethod.value = record.method;
    drawerMethodText.value =
      record.method === 'create' ? '新建' : record.method === 'edit' ? '编辑' : '查看';

    if (record.method !== 'create' && record.data) {
      console.log('record.data. :>> ', record.data.id);
      const data = await getDeviceDetailApi(record.data.id);
      console.log('data :>> ', data);
      // data.manufacturingDate = data.manufacturingDate || 1676537083220;
      // data.purchaseDate = data.purchaseDate || 1676537083220;
      setFieldsValue(data);
      if (record.method === 'view') {
        setProps({
          disabled: true,
        });
      }
    }
  });

  const title = computed(() => drawerMethodText.value + drawerType.value);

  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      console.log(values);
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  function handleClose() {
    setProps({ disabled: false });
  }
</script>
