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
  import { computed, ref, Ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { OrganizationsFullNameModel } from '/@/api/info/model/organizationsModel';
  import { listToTreeAsParentId, treeToList } from '/@/utils/helper/treeHelper';
  import { editOrgSchemas } from '../data';
  // import { useMessage } from '/@/hooks/web/useMessage';

  // const { createMessage } = useMessage();

  // const emit = defineEmits(['update:role']);

  const props = defineProps({
    orgTree: {
      required: true,
      type: Object,
    },
  });
  const loading = ref<boolean>(false);
  const editType: Ref<'create' | 'edit' | ''> = ref('');

  const organizationTree = computed(() => props.orgTree);

  const [registerForm, { getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    schemas: editOrgSchemas(organizationTree.value),
    labelWidth: 120,
    showActionButtonGroup: false,
  });

  const [register, { closeModal }] = useModalInner(
    async (data: OrganizationsFullNameModel & { type: string }) => {
      editType.value = data.type === 'edit' ? 'edit' : 'create';

      updateSchema({ field: 'code', componentProps: { disabled: data.type === 'edit' } });

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

          // updateSchema({
          //   field: 'parentOrganization',
          //   componentProps: { treeData: [] },
          // });

          // const orgTree = toRef(props, 'orgTree');
          // console.log('orgTree :>> ', orgTree);
          const treeList = treeToList(unref(organizationTree));
          treeList.map((item) => {
            item.children = [];
            item.disabled = false;
            if (item.id === data.id || item.parentId === data.id) {
              item.disabled = true;
            }
          });
          console.log('treeList :>> ', treeList);

          const new_tree = listToTreeAsParentId(treeList);
          console.log('new_tree :>> ', new_tree);

          // updateSchema({
          //   field: 'parentOrganization',
          //   componentProps: { treeData: [] },
          // });
          // setTimeout(() => {
          //   updateSchema({
          //     field: 'parentOrganization',
          //     componentProps: { treeData: new_tree },
          //   });
          // }, 1000);

          break;
      }
    },
  );

  async function handleSubmit() {
    // loading.value = true;
    await validate();
    const values = getFieldsValue();
    console.log('values :>> ', values);
    closeModal();
    // try {
    //   if (editType.value === 'create') {
    //     await addRoleApi(values as AddRoleParams);
    //   } else if (editType.value === 'edit') {
    //     await editRoleApi(editId.value as number, values as EditRoleParams);
    //   }

    //   createMessage.success('保存成功');
    //   closeModal();
    //   emit('update:role');
    // } catch (error) {
    //   throw new Error(JSON.stringify(error));
    // } finally {
    //   loading.value = false;
    // }
  }
</script>
