<template>
  <div class="h-full p-4 mt-4 overflow-auto bg-white" ref="locationTreeWrapper">
    <a-button
      class="mb-2.5 mr-4"
      type="primary"
      :disabled="isRoot"
      @click="
        openModal(true, { id: selectedId, fullName: selectedFullName, type: 'createSiblings' })
      "
    >
      新建同级
    </a-button>
    <a-button
      class="mb-2.5"
      type="primary"
      @click="
        openModal(true, { id: selectedId, fullName: selectedFullName, type: 'createSiblings' })
      "
    >
      新建子集
    </a-button>
    <Spin :spinning="loading">
      <BasicTree
        :treeData="treeData"
        :fieldNames="{ key: 'id' }"
        :height="treeHeight"
        @select="handleSelect"
        ref="treeRef"
      />
    </Spin>

    <EditLocationModal @register="registerModal" @done="handleEditLocationSuccess" />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'LocationTree',
  };
</script>

<script lang="ts" setup>
  import { nextTick, onMounted, reactive, ref, unref } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import EditLocationModal from './editLocationModal.vue';
  import { getLocationTreeApi } from '/@/api/info/location';
  import { LocationFullNameModel } from '/@/api/info/model/locationModel';
  import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['select']);

  const [registerModal, { openModal }] = useModal();

  const treeRef = ref<Nullable<TreeActionType>>(null);
  const treeData = ref<any[]>([]);
  const treeHeight = ref<number>();
  const locationTreeWrapper = ref<Nullable<HTMLElement>>(null);
  const isRoot = ref(true);
  const loading = ref(false);
  const getLocationTreeParams = reactive({
    parentId: 0,
    orderBy: 'Code',
    ascending: true,
  });
  const selectedId = ref<number>();
  const selectedFullName = ref<string>('');

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) throw new Error('treeRef is null');
    return tree;
  }

  async function getLocationTree(params) {
    loading.value = true;
    try {
      const { items } = await getLocationTreeApi(params);
      const list: (LocationFullNameModel & { title?: string; label?: string })[] =
        cloneDeep(items) || [];

      // 给列表赋值 title 用于显示标题。除根节点（parentId === -1）外，子目录和部门均显示为 code + name
      list.map((item) => {
        item.title = item.parentId === -1 ? item.name : `${item.code} ${item.name}`;
        item.label = `${item.parentFullName}/` + item.title;
      });

      const locationTree = listToTreeAsParentId(list);
      treeData.value = locationTree;

      await nextTick();
      // 全部展开 & 选中根节点(id === 0)
      getTree()?.expandAll(true);
      getTree()?.setSelectedKeys([treeData.value[0].id]);
      selectedId.value = treeData.value[0].id;
      selectedFullName.value = treeData.value[0].fullName;
      emit('select', treeData.value[0]);
    } catch (error: any) {
      loading.value = false;
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSelect(selectedIds, { selectedNodes }) {
    const node = selectedNodes[0],
      id = selectedIds[0];

    // 选中的是根目录(id === 0)，不允许新建同级目录
    isRoot.value = id === 0;
    selectedId.value = id;
    selectedFullName.value = node.fullName;
    emit('select', node);
  }

  onMounted(async () => {
    await getLocationTree(getLocationTreeParams);

    await nextTick();

    const contentWrapper = locationTreeWrapper.value!;
    const contentWrapperHeight = contentWrapper.getBoundingClientRect().height;
    treeHeight.value = contentWrapperHeight - 42; // 42为新建同级、新建子级按钮高度
  });

  function handleEditLocationSuccess() {
    // 编辑位置信息成功, 刷新数据
    getLocationTree(getLocationTreeParams);
  }

  defineExpose({ getLocationTree });
</script>
