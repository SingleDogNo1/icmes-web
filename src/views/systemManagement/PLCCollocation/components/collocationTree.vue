<template>
  <div class="w-full h-full bg-white" ref="collocationTreeWrapperRef">
    <BasicTree
      title="配点树"
      ref="treeRef"
      :treeData="treeData"
      :loading="loading"
      search
      toolbar
      :height="treeHeight"
      checkable
      placeholder="请输入关键字进行过滤"
      :load-data="onLoadData"
      :toolbarOptions="extraTooltipOptions"
      :fieldNames="{ title: 'data', key: 'uniPath' }"
      @load="handleNodeLoad"
      @click:extra-tooltip="handleClickTooltip"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'CollocationTree',
  };
</script>

<script lang="ts" setup>
  import { onMounted, ref, unref, nextTick } from 'vue';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import type { TreeProps } from 'ant-design-vue';
  import { getPlcPointsTreeListApi } from '/@/api/info/plcPoints';
  import { PLCPointTreeModel, GetPlcPointsTreeParams } from '/@/api/info/model/plcPointsModel';
  import { cloneDeep } from 'lodash-es';

  const treeRef = ref<Nullable<TreeActionType>>(null);
  const collocationTreeWrapperRef = ref<Nullable<HTMLElement>>(null);
  const loading = ref(false);
  const treeData = ref<PLCPointTreeModel[]>([]);
  const treeHeight = ref();
  const extraTooltipOptions = ref([
    {
      label: '重置',
      value: 'reset',
    },
    {
      label: '配点',
      value: 'collocation',
    },
  ]);

  onMounted(async () => {
    // TODO 如何做到自动请求加载树节点？
    const data = await getPlcPointsList({ uniPath: '0' });
    treeData.value = data;

    await nextTick();
    /*
        https://www.antdv.com/components/tree-cn#components-tree-demo-virtual-scroll
        考虑到性能，使用虚拟滚动，前提是提供 tree 组件的高度
        TODO: 当前获取组件 dom 的高度进行计算得到，如何更好的获取 tree 组件的高度？？？
       */
    const contentWrapper = collocationTreeWrapperRef.value!;
    const contentHeaderWrapper = contentWrapper.querySelector('.icmes-tree-header')!;

    treeHeight.value =
      contentWrapper.getBoundingClientRect().height -
      contentHeaderWrapper.getBoundingClientRect().height;

    // 手动调用展开第一层树，第一层树展开后，将会自动触发 handleNodeLoad 方法，一口气加载全部叶子结点
    // 如果后期性能优化要求不需要一次性加载全部，删除当前行和 handleNodeLoad 函数
    getTree().expandAll(true);
  });

  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  function handleNodeLoad() {
    getTree().expandAll(true);
  }

  async function getPlcPointsList(params: GetPlcPointsTreeParams): Promise<PLCPointTreeModel[]> {
    try {
      const { item } = await getPlcPointsTreeListApi(params);

      const res: (PLCPointTreeModel & {
        isLeaf?: boolean;
      })[] = cloneDeep(item || []);

      res.forEach((v) => {
        // isLeaf(antd 字段): 判断是否为叶子结点
        v.isLeaf = v.point;
      });

      return new Promise((resolve) => {
        resolve(res);
      });
    } catch (error: any) {
      throw new Error(error);
    } finally {
      loading.value = false;
    }
  }

  const onLoadData: TreeProps['loadData'] = (treeNode) => {
    return new Promise((resolve) => {
      const uniPath = treeNode.dataRef?.uniPath;
      getPlcPointsList({ uniPath }).then((data) => {
        getTree().updateNodeByKey(treeNode.eventKey as string, { children: data });
        getTree().setExpandedKeys([treeNode.eventKey as string, ...getTree().getExpandedKeys()]);
        resolve();
      });
    });
  };

  function handleClickTooltip(key) {
    console.log('key :>> ', key);
  }
</script>
