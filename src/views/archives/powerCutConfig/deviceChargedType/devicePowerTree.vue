<template>
  <BasicTree
    v-loading="loading"
    ref="treeRef"
    search
    autoExpandParent
    :height="treeHeight"
    :treeData="treeData"
    :fieldNames="{ key: 'id' }"
    @select="handleSelect"
  />
</template>

<script lang="ts">
  export default {
    name: 'DeviceTree',
  };
</script>

<script lang="ts" setup>
  import { ref, unref, /*nextTick,*/ Ref, watch, toRefs } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { listToTreeAsParentId } from '/@/utils/helper/treeHelper';
  import { getDevicesPowerListApi } from '/@/api/info/devices';
  import { GetDevicesPowerListParam, DevicePowerModel } from '/@/api/info/model/devicesModel';
  import { cloneDeep } from 'lodash-es';
  import { error } from '/@/utils/log';

  const props = defineProps({
    tableDataLoaded: {
      type: Boolean,
      required: true,
    },
  });

  const loading = ref(false);
  const treeRef = ref<Nullable<TreeActionType>>(null);
  const treeData = ref<any[]>([]);
  const treeHeight = ref<number>();
  const { tableDataLoaded } = toRefs(props);

  const getDeviceTreeParams = ref({}) as Ref<GetDevicesPowerListParam>;

  const emit = defineEmits(['select']);

  watch(
    () => tableDataLoaded.value,
    (value) => {
      // tableDataLoaded 表示右侧表格数据已经加载完成，此时应重新计算树组件高度，并展开树形组件
      if (value) {
        // TODO
        // nextTick 不触发？？？？
        // nextTick(() => {
        setTimeout(() => {
          loading.value = false;
          const tree = getTree() as unknown as any;
          const treeWrapper = tree.$el as HTMLElement;
          const { height } = treeWrapper.getBoundingClientRect();
          treeHeight.value = height - 37; // 37px 为搜索框的高度

          console.log('treeData.value :>> ', treeData.value);
          const firstTreeNode = treeData.value[0].children[0].children[0];
          console.log(firstTreeNode);

          // 展开第一层 & 选中根节点(id === 0)
          getTree()?.setExpandedKeys([firstTreeNode.id]);
          getTree()?.setSelectedKeys([firstTreeNode.id]);
        }, 200);
        // });
      }
    },
  );

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) error('tree is null');
    return tree;
  }

  async function getDevicesPowerList(params) {
    try {
      const { items } = await getDevicesPowerListApi(params);
      console.log(items);
      // 给列表赋值 title 用于显示标题。除根节点（parentId === -1）外，子目录和部门均显示为 code + name
      const list: (DevicePowerModel & { title?: string; label?: string; key?: string })[] =
        cloneDeep(items) || [];
      list.map((item) => {
        item.title = item.parentId === 0 ? item.name : `${item.code} ${item.name}`;
        item.label = '';
      });
      treeData.value = listToTreeAsParentId(list, {
        parentId: 'categoryTreeParentId',
        id: 'categoryTreeId',
      });
    } catch (err: any) {
      error(err);
    }
  }

  getDeviceTreeParams.value = {
    ascending: true,
    category: [],
    globalName: '',
    needTree: true,
    orderBy: 'processNo',
    organizationIds: [],
    pageNo: 0,
    pageSize: 0,
    parentId: null,
  };

  getDevicesPowerList(getDeviceTreeParams.value);

  function handleSelect(selectedIds, { selectedNodes }) {
    console.log(selectedIds, selectedNodes);
    const node = selectedNodes[0];
    console.log(node);

    if (node.parentId !== 0 || node.id === 0) {
      node.category = [];
      node.parentId = node.id === 0 ? null : node.id;
    } else {
      node.category = [node.id];
      node.parentId = null;
    }
    emit('select', node);
  }
</script>
