<template>
  <BasicModal
    :loading="loading"
    v-bind="$attrs"
    :title="`${editType === 'create' ? '新建' : '编辑'}组织机构`"
    :height="400"
    @register="register"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { error } from '/@/utils/log';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    getOrganizationsListApi,
    createOrganizationApi,
    editOrganizationApi,
  } from '/@/api/info/organizations';
  import {
    OrganizationsFullNameModel,
    OrganizationParams,
  } from '/@/api/info/model/organizationsModel';
  import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
  import { editOrgSchemas as schemas } from '../data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();

  const emit = defineEmits(['done']);

  const loading = ref<boolean>(false);
  const editType = ref<'create' | 'edit' | ''>('');

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    schemas,
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  const [register, { closeModal }] = useModalInner(
    async (data: OrganizationsFullNameModel & { type: string }) => {
      console.log('type', data.type);
      loading.value = true;
      editType.value = data.type === 'edit' ? 'edit' : 'create';

      try {
        const { items } = await getOrganizationsListApi({
          ascending: true,
          orderBy: 'Code',
          parentId: 0,
        });
        const list: (OrganizationsFullNameModel & { disabled?: boolean })[] = items || [];

        // 添加参数 disabled, 因为点击的当前节点的上级机构不可选择当前机构和当前机构的子集机构
        list.map((item) => {
          item.disabled = [item.id, item.parentId].includes(data.id);
        });

        const treeData = listToTreeAsParentId(list);
        updateSchema([
          { field: 'code', componentProps: { disabled: data.type === 'edit' } },
          {
            field: 'parentOrganization',
            componentProps: {
              treeData,
              onChange: async (_val, _label, { triggerNode: { dataRef: checkedNode } }) => {
                setFieldsValue({
                  parentId: checkedNode.id,
                  parentFullName: checkedNode.parentFullName,
                });
              },
            },
          },
        ]);

        switch (data.type) {
          case 'createSiblings': // 新建同级
            setFieldsValue({
              parentId: data.parentId,
              parentFullName: data.parentFullName,
            });
            break;
          case 'createChildren': // 新建子级
            setFieldsValue({
              parentId: data.id,
              parentFullName: data.fullName,
            });
            break;
          case 'edit': // 编辑
            setFieldsValue({
              id: data.id,
              phone: data.phone,
              code: data.code,
              name: data.name,
              parentId: data.parentId,
              parentFullName: data.parentFullName,
              versionTag: data.versionTag,
              parentOrganization: data.fullName,
            });
            break;
        }
      } catch (err: any) {
        error(err);
      } finally {
        loading.value = false;
      }
    },
  );

  async function handleSubmit() {
    loading.value = true;
    await validate();
    const values = getFieldsValue() as OrganizationParams;
    console.log('values :>> ', values);
    try {
      if (editType.value === 'create') {
        await createOrganizationApi(values);
      } else if (editType.value === 'edit') {
        await editOrganizationApi(values.id!, values);
      }

      createMessage.success('保存成功');
      closeModal();
      emit('done');
    } catch (err: any) {
      error(err);
    } finally {
      loading.value = false;
    }
  }
</script>
