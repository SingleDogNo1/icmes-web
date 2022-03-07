<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white">
      <a-button
        class="mb-2.5 mr-4"
        type="primary"
        :disabled="isRoot"
        @click="openModal(true, { type: 'createSiblings' })"
      >
        新建同级
      </a-button>
      <a-button class="mb-2.5" type="primary" @click="openModal(true, { type: 'createChildren' })">
        新建子集
      </a-button>
      <PageWrapper contentFullHeight dense>
        <Spin :spinning="loading">
          <BasicTree
            :treeData="treeData"
            :fieldNames="{ key: 'id' }"
            ref="treeRef"
            @select="handleSelect"
          />
        </Spin>
      </PageWrapper>
    </div>

    <EditOrganizationModal @register="registerModal" @done="handleEditOrgSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'OrganizationTree',
  };
</script>

<script lang="ts" setup>
  import { nextTick, ref, unref, reactive } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { getOrganizationsListApi } from '/@/api/info/organizations';
  import { OrganizationsFullNameModel } from '/@/api/info/model/organizationsModel';
  import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
  import { cloneDeep } from 'lodash-es';
  import EditOrganizationModal from './editOrganizationModal.vue';
  import { useModal } from '/@/components/Modal';

  const [registerModal, { openModal }] = useModal();

  const emit = defineEmits(['select']);

  const treeRef = ref<Nullable<TreeActionType>>(null);
  const treeData = ref<any[]>([]);
  const loading = ref(false);
  const isRoot = ref(true);
  const selectedNode = ref(null);
  const getOrgListParams = reactive({
    parentId: 0,
    orderBy: 'Code',
    ascending: true,
  });

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) throw new Error('tree is null!');
    return tree;
  }

  async function getOrganizationsList(params) {
    loading.value = true;
    try {
      const { items } = await getOrganizationsListApi(params);
      // 给列表赋值 title 用于显示标题。除根节点（parentId === -1）外，子目录和部门均显示为 code + name
      const list: (OrganizationsFullNameModel & { title?: string; label?: string })[] =
        cloneDeep(items) || [];
      list.map((item) => {
        item.title = item.parentId === -1 ? item.name : `${item.code} ${item.name}`;
        item.label = `${item.parentFullName}/` + item.title;
      });

      const organizationTree = listToTreeAsParentId(list);
      treeData.value = organizationTree;
      await nextTick();
      // 展开第一层 & 选中根节点（id === 0）
      getTree()?.filterByLevel(1);
      getTree()?.setSelectedKeys([9]);
      emit('select', 0);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSelect(selectedIds, { selectedNodes }) {
    // 默认的结果为数组结构，但是项目中为单选，所以直接取出来即可
    console.log('selectedIds :>> ', selectedIds, selectedNodes);
    const id = selectedIds[0],
      node = selectedNodes[0];

    selectedNode.value = node;
    isRoot.value = id === 0; // 选中的是根目录(id === 0)，不允许新建同级目录
    emit('select', id);
  }

  function handleEditOrgSuccess() {
    // 编辑组织机构成功, 刷新数据
    getOrganizationsList(getOrgListParams);
  }

  getOrganizationsList(getOrgListParams);
</script>
