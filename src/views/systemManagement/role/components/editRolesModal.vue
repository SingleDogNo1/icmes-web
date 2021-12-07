<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}数据字典`"
    :height="400"
    @register="register"
    @ok="handleSubmit"
  >
    <Tabs type="card">
      <TabPane key="member" tab="用户列表" forceRender>
        <PageWrapper contentFullHeight fixedHeight dense>
          <BasicForm @register="registerForm" />
        </PageWrapper>
      </TabPane>
      <TabPane key="permission" tab="用户权限">
        <PageWrapper contentFullHeight dense>
          <RoleTree :checked-keys="rowPermission" />
        </PageWrapper>
      </TabPane>
    </Tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, Ref, PropType } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { RoleTree } from '/@/components/Business';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { RoleModel, AddRoleParams, EditRoleParams } from '/@/api/account/model/rolesModel';
  import { Tabs } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addRoleApi, editRoleApi } from '/@/api/account/roles';

  const { createMessage } = useMessage();

  const emit = defineEmits(['update:role']);

  const TabPane = Tabs.TabPane;

  defineProps({
    rowPermission: {
      type: Object as PropType<string[]>,
    },
  });
  const loading = ref<boolean>(false);
  const editType: Ref<'create' | 'edit' | ''> = ref('');
  const editId = ref<Number | undefined>(undefined);

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema }] = useForm({
    schemas: [
      {
        field: 'code',
        label: '角色编码',
        component: 'Input',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请输入角色编码',
          },
        ],
      },
      {
        field: 'name',
        label: '角色名称',
        component: 'Input',
        defaultValue: '',
        rules: [
          {
            required: true,
            message: '请输入角色名称',
          },
        ],
      },
      {
        field: 'remark',
        label: '角色描述',
        component: 'Input',
        defaultValue: '',
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

  function onDataReceive(data: RoleModel) {
    console.log('data :>> ', data);
    setFieldsValue({
      code: data.code ?? '',
      name: data.name ?? '',
      remark: data.remark ?? '',
      versionTag: data.versionTag ?? '',
    });

    // 如果存在versionTag 字段，是编辑，否则是新建。并且编辑时，code 选项不可操作
    editType.value = data.versionTag ? 'edit' : 'create';
    if (editType.value === 'edit') editId.value = data.id;
    updateSchema({ field: 'code', componentProps: { disabled: Boolean(data.versionTag) } });
  }

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  async function handleSubmit() {
    loading.value = true;
    const values = getFieldsValue() as AddRoleParams | EditRoleParams;
    try {
      if (editType.value === 'create') {
        await addRoleApi(values as AddRoleParams);
      } else if (editType.value === 'edit') {
        await editRoleApi(editId.value as number, values as EditRoleParams);
      }

      createMessage.success('保存成功');
      closeModal();
      emit('update:role');
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      loading.value = false;
    }
  }
</script>
